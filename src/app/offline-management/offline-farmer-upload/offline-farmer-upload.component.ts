import { Component, OnInit } from '@angular/core';
import { FarmerService } from 'src/app/farmer-management/services/farmer.service';
import { AlertNotificationService } from 'src/app/v2/core/services/alert-notification.service';
import { FarmerAndFieldStorageService } from '../services/farmer-and-field-storage.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { OfflineSyncService } from '../services/offline-sync.service';
import { RecommendationStorageService } from '../services/recommendation-storage.service';

@Component({
  selector: 'app-offline-farmer-upload',
  templateUrl: './offline-farmer-upload.component.html',
  styleUrls: ['./offline-farmer-upload.component.scss'],
})
export class OfflineFarmerUploadComponent implements OnInit {
  constructor(
    private farmerOfflineStorageService: FarmerAndFieldStorageService,
    private offlineSyncService: OfflineSyncService,
    private recommendationStorageService: RecommendationStorageService,
    private farmerService: FarmerService,
    private alertNotificationService: AlertNotificationService,
    public offlineStorage: OfflineStorageService,
  ) {}

  public isUploadFarmersClicked = false;

  public farmerList = [];

  public allOfflineFields = [];

  public uploadingFarmerData = false;

  public isOfflineIconVisible: boolean;


  public async uploadFarmers() {
    this.isUploadFarmersClicked = true;
    if (this.offlineStorage.isOfflineIconVisible) {
      this.alertNotificationService.showAlert(
        'You may need to go online first',
        'Notice'
      );

      return;
    }
    const waitAndDo = async (index) => {

      if (this.farmerList.length == 0) {
        this.alertNotificationService.showAlert(
          'No offline data to push',
          'Notice'
        );
      }

      if (index >= this.farmerList.length) {
        return;
      }

      if (this.farmerList[index].upload_failed) {
        waitAndDo(index + 1);
      } else {
        this.farmerList[index].isUploading = true;
        try {
          const result = await this.offlineSyncService
            .pushFarmerData(this.farmerList[index])
            .toPromise();

          // persist online id locally
          if (this.farmerList[index].offline_id) {
            const farmerData = this.farmerService.mapFarmerApiModelToUpdateOfflineFarmer(result);
            await this.farmerOfflineStorageService.updateOfflineFarmer(
              farmerData,
              this.farmerList[index].offline_id
            );
            this.farmerList[index].id = result.id;
            this.farmerList[index].farmer_id = result.farmer_id;
          }

          // persist updated fields
          if (result.fields && result.fields.length > 0) {
            const offlineFieldData = await this.farmerOfflineStorageService.getFieldData();
            const offlineRecommendationData = await this.recommendationStorageService.getRecommendationData();
            
            result.fields.forEach(async (field, fieldIndex) => {
              
              const offlineId = this.farmerList[index].fields[fieldIndex].offlineFieldId;
              const farmDataIndex = offlineFieldData.findIndex(farm => farm.offlineFieldId === offlineId);
              
              if (offlineId) {
                this.farmerOfflineStorageService.updateOfflineField(
                  field,
                  offlineFieldData,
                  farmDataIndex
                );
                this.farmerList[index].fields[fieldIndex].id = field.id;
              }

              if (field.recommendations && field.recommendations.length > 0) {
                field.recommendations.forEach(async (rec, recIndex) => {
                  const offlineRecommendationId = this.farmerList[index].fields[fieldIndex].recommendations[recIndex].temporaryRefId;
                  const recommendationIndex = offlineRecommendationData.findIndex(recommendation => recommendation.temporaryRefId === offlineRecommendationId);

                  if (offlineRecommendationId) {
                    await this.recommendationStorageService.updateRecommendation(
                      rec,
                      offlineRecommendationData,
                      recommendationIndex,
                      field
                    );
  
                    this.farmerList[index].fields[fieldIndex].recommendations[
                      recIndex
                    ].refId = rec.refId;
                  }
                });
              }
            });
          }
          this.farmerList[index].isUploading = false;
        } catch (e) {
          this.farmerList[index].upload_failed = true;
          this.farmerList[index].isUploading = false;
          await this.farmerOfflineStorageService.updateOfflineFarmer(
            { ...this.farmerList[index] },
            this.farmerList[index].offline_id
          );
        }

        waitAndDo(index + 1);
      }
    };

    waitAndDo(0);
  }

  public checkRecommendationsWithRefId(fields) {
    let recommendations = [];
    fields.forEach((field) => {
      if (field.recommendations.length > 0) {
        field.recommendations.forEach((recommendation) => {
          recommendations.push(recommendation.refId);
        });
      }
    });

    return recommendations.includes(null);
  }

  public async resetOfflineFarmerUpload() {
    this.farmerList
      .filter((farmer) => farmer.upload_failed === true)
      .forEach(async (farmer) => {
        if (farmer.offline_id) {
          await this.farmerOfflineStorageService.updateOfflineFarmer(
            { ...farmer, upload_failed: false },
            farmer.offline_id
          );
        } else {
          await this.farmerOfflineStorageService.updateFarmer(
            { ...farmer, upload_failed: false },
            farmer.id
          );
        }

        farmer.upload_failed = false;
      });
  }

  public farmerFieldsHasNoRecommendations(fields) {
    return (
      !fields ||
      fields.length === 0 ||
      fields.every(
        (field) => !field.recommendations || field.recommendations.length === 0
      )
    );
  }

  public async resetFarmerUpload(farmer) {
    this.isUploadFarmersClicked = false;
    if (farmer.offline_id) {
      await this.farmerOfflineStorageService.updateOfflineFarmer(
        { ...farmer, upload_failed: false },
        farmer.offline_id
      );

      const i = this.farmerList.findIndex(
        (item) => item.offline_id === farmer.offline_id
      );

      this.farmerList[i].upload_failed = false;
    } else {
      await this.farmerOfflineStorageService.updateFarmer(
        { ...farmer, upload_failed: false },
        farmer.id
      );

      const i = this.farmerList.findIndex((item) => item.id === farmer.id);

      this.farmerList[i].upload_failed = false;
    }
  }

  public async uploadFarmer() {
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({});
      }, 5000);
    });

    return p;
  }

  async ngOnInit() {
    const allOfflineFarmerData = await this.farmerOfflineStorageService.getFarmerData();
    this.allOfflineFields = await this.farmerOfflineStorageService.getFieldData();
    const allRecommendations = await this.recommendationStorageService.getOfflineRecommendations();
    this.farmerList = allOfflineFarmerData.offlineFarmerData
      .map((farmer) => ({
        ...farmer,
        fields: this.allOfflineFields
          .filter(
            (field) =>
              farmer.farmer_id
                ? field.farmer_id === farmer.farmer_id // farmer exist online
                : field.offlineFarmerId === farmer.offline_id // farmer created offline
          )
          .map((field) => ({
            ...field,
            recommendations: allRecommendations.filter(
              (recommendation) =>
                field.field_id
                  ? field.field_id === recommendation.farmLotId // field already exist online
                  : field.offlineFieldId ===
                    recommendation.farmLotId // field created offline
            ),
          })),
      }))
      .filter(
        (farmer) =>
          !farmer.id ||
          !farmer.fields.every(
            (field) => !!field.id &&
              field.recommendations.every((recommendation) => !!recommendation.refId)
          )
      )
      .map((farmer) => ({
        ...farmer,
        uploaded: farmer.farmer_id && farmer.fields.every((field) => field.id) && farmer.fields.every((field) => field.recommendations.every((recommendation) => !!recommendation.refId)),
      }));

  }
}
