import { Injectable, OnInit } from '@angular/core';
import { take, switchMap, catchError } from 'rxjs/operators';
import { offlineDBkey } from "src/app/offline-management/constants/offlineDBkey.const";
import { OfflineDataModel } from 'src/app/offline-management/models/offline-data-model';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { FarmerFilterModel } from 'src/app/farmer-management/models/farmer-filter.model';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';

import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { AlertNotificationService } from 'src/app/v2/core/services/alert-notification.service';
import { ToastService } from 'src/app/v2/core/services/toast.service';
import { FarmerService } from 'src/app/farmer-management/services/farmer.service';
import { FarmerModel } from 'src/app/farmer-management/models/farmer.model';
import { ErrorModel } from 'src/app/v2/core/models/error.model';
import { FieldService } from 'src/app/farm-management/services/field.service';
import { FieldRecommendationService } from "src/app/recommendation/services/field-recommendation.service";
import { FieldRecommendationApiModel } from 'src/app/recommendation/model/recommendation-form-models/field-recommendation-api.model';

@Injectable({
  providedIn: 'root'
})
export class UploadFarmerAndFieldOfflineStorageService implements OnInit {

  public offlineFarmerDataStorage: any;
  public farmerFields: FarmApiModel[];
  public offlineFieldRecommendations: FieldRecommendationApiModel[] = [];

  public repopulateFieldList: boolean = false;

  constructor(
    private offlineStorage: OfflineStorageService,
    private farmerService: FarmerService,
    private fieldService: FieldService,
    private toastService: ToastService,
    private alertNotification: AlertNotificationService,
    private offlineService: OfflineStorageService,
    private fieldRecommendationService: FieldRecommendationService
  ) { }

  ngOnInit() {
  }

  async uploadFarmerAndFieldInfoAndRecommendation(farmerFieldList: FarmApiModel[], offlineFarmerId: string, onlineFarmerId?: string) {

    this.farmerFields = farmerFieldList;
    if (offlineFarmerId && !onlineFarmerId) {

      this.offlineFarmerDataStorage = await this.offlineStorage.get(offlineDBkey.FARMER_KEY_PREFIX);

      let offlineFarmerInfo = this.offlineFarmerDataStorage.offlineFarmerData.find(farmerInfo => {
        const fetchedFarmerInfo = farmerInfo as FarmerApiModel;
        return (fetchedFarmerInfo.offline_id === offlineFarmerId);
      });
      offlineFarmerInfo = this.farmerService.mapFarmerApiToFarmerModel(offlineFarmerInfo);

      const offlineFarmerIndex = this.offlineFarmerDataStorage.offlineFarmerData.findIndex(farmerInfo => {
        const fetchedFarmerInfo = farmerInfo as FarmerApiModel;
        return (fetchedFarmerInfo.offline_id === offlineFarmerId);
      });

      this.uploadOfflineFarmerInfo(offlineFarmerInfo, offlineFarmerIndex);

    } else {
      // farmer has proper faremrID, meaning s/he was interviewed online
      this.uploadOfflineFarmersFieldInfo(onlineFarmerId, offlineFarmerId);
    }
  }


  uploadOfflineFarmerInfo(farmerData: FarmerModel, offlineFarmerDataIndex: number) {

    this.farmerService
      .addFarmer(farmerData)
      .pipe(
        take(1),
        switchMap((response: FarmerModel) => {
          return this.farmerService.getFarmerById(response.id).pipe(take(1));
        }))
      .subscribe(
        (res: FarmerModel) => {

          const uploadedOfflineFarmerDataStorage = this.offlineFarmerDataStorage.offlineFarmerData[offlineFarmerDataIndex] as FarmerApiModel;

          uploadedOfflineFarmerDataStorage.id = res.id;
          uploadedOfflineFarmerDataStorage.farmer_id = res.farmerId;

          this.offlineFarmerDataStorage.offlineFarmerData[offlineFarmerDataIndex] = uploadedOfflineFarmerDataStorage;

          this.offlineStorage.set(offlineDBkey.FARMER_KEY_PREFIX, this.offlineFarmerDataStorage);
          this.uploadOfflineFarmersFieldInfo(res.farmerId, farmerData.offlineId);
          this.toastService
            .showSuccessToast('Farmer was synchronized successfully!').then(() => {
            });
        },
        (errorData: ErrorModel) => {
          this.alertNotification.showAlert(errorData.message);
        }
      );
  }

  async uploadOfflineFarmersFieldInfo(farmerId: string, offlineFarmerId?: string) {

    const offlineFarmerFarmlots = await this.offlineStorage.get(offlineDBkey.FIELD_KEY_PREFIX);

    this.uploadOfflineFarmersFieldInfoProcess(0, offlineFarmerFarmlots.length, offlineFarmerFarmlots, farmerId, offlineFarmerId)

  }

  offlineOnlineFieldIdPair: object = { offlineFieldId: '', fieldId: '' };
  offlineOnlineFieldIdPairList: object[] = [];

  uploadOfflineFarmersFieldInfoProcess(
    offlineFarmLotIndex: number,
    totalFarmerFieldCount,
    offlineFarmerFarmlots,
    farmerId,
    offlineFarmerId
  ) {

    const farmerField = offlineFarmerFarmlots[offlineFarmLotIndex];

    if (offlineFarmLotIndex < totalFarmerFieldCount) {
      const farmLot = farmerField as FarmApiModel;

      if (offlineFarmerId && offlineFarmerId === farmLot.offlineFarmerId) {
        farmLot.farmer_id = farmerId;
      }

      if (farmLot.farmer_id === farmerId && !farmLot.field_id) {
        this.fieldService.addField(farmLot).pipe(
          take(1)).subscribe(response => {
            offlineFarmerFarmlots[offlineFarmLotIndex] = response.data;

            const offlineFieldId = offlineFarmerFarmlots[offlineFarmLotIndex].offlineFieldId;

            if (offlineFieldId) {
              this.offlineOnlineFieldIdPair['offlineFieldId'] = offlineFieldId;
              this.offlineOnlineFieldIdPair['fieldId'] = offlineFarmerFarmlots[offlineFarmLotIndex].field_id;

              this.offlineOnlineFieldIdPairList.push(this.offlineOnlineFieldIdPair);
            }

            this.offlineStorage.set(offlineDBkey.FIELD_KEY_PREFIX, offlineFarmerFarmlots);
            this.toastService
              .showSuccessToast(`<b>${farmLot.field_name}</b> was synchronized successfully!`).then(() => {

                this.repopulateFieldList = true;

                offlineFarmLotIndex++;
                this.uploadOfflineFarmersFieldInfoProcess(
                  offlineFarmLotIndex,
                  totalFarmerFieldCount,
                  offlineFarmerFarmlots,
                  farmerId,
                  offlineFarmerId);
              });
          });

      } else {
        offlineFarmLotIndex++;
        this.uploadOfflineFarmersFieldInfoProcess(
          offlineFarmLotIndex,
          totalFarmerFieldCount,
          offlineFarmerFarmlots,
          farmerId,
          offlineFarmerId);
      }

    } else {
      if (offlineFarmLotIndex === totalFarmerFieldCount) {

        this.uploadOfflineRecommendation(
          this.farmerFields.length,
          0,
          this.farmerFields,
          farmerId,
          offlineFarmerId
        );
      }
    }

  }

  async uploadOfflineRecommendation(
    offlineRecommendationsTotal,
    offlineRecommendationIndex,
    offlineRecommendation,
    farmerId,
    offlineFarmerId
  ) {
    if (offlineRecommendationIndex < offlineRecommendationsTotal) {
      let offlineFieldId = offlineRecommendation[offlineRecommendationIndex].field_id;
      let offlineFieldIdStorage = offlineFieldId;

      const searchFieldId = this.offlineOnlineFieldIdPairList.filter(fieldIds => {
        return fieldIds['offlineFieldId'] === offlineRecommendation[offlineRecommendationIndex].offlineFieldId
      });

      if (!offlineFieldId) {
        offlineFieldId = searchFieldId[0]['offlineFieldId'];
        offlineFieldIdStorage = searchFieldId[0]['fieldId'];
      }

      this.offlineFieldRecommendations = await this.fieldRecommendationService.getOfflineRCMRecommendation(
        offlineFieldId
      );

      if (!!this.offlineFieldRecommendations && this.offlineFieldRecommendations !== null) {

        for (let i = 0; i < this.offlineFieldRecommendations.length; i++) {

          if (!this.offlineFieldRecommendations[i].refId) {
            try {
              this.offlineFieldRecommendations[i].farmerId = farmerId;
              this.offlineFieldRecommendations[i].fieldInfoModel.farmerId = farmerId;
              this.offlineFieldRecommendations[i].fieldInfoModel.field_id = offlineFieldIdStorage;
              const savedRecommendation = await this.fieldRecommendationService
                .saveRecommendation(this.offlineFieldRecommendations[i])
                .toPromise();
              const refId = (savedRecommendation as any).ref;
              this.offlineFieldRecommendations[i].refId = refId;
            } catch (e) {
              catchError(e);
            }
          }
        }

        await this.offlineStorage.set(
          offlineDBkey.FIELD_RECOMMENDATIONS_KEY_PREFIX + offlineFieldIdStorage,
          this.offlineFieldRecommendations
        );

        this.toastService
          .showSuccessToast(`Field id ${offlineFieldIdStorage} synchronized successfully!`).then(() => {
            offlineRecommendationIndex++;
            this.uploadOfflineRecommendation(
              offlineRecommendationsTotal,
              offlineRecommendationIndex,
              offlineRecommendation,
              farmerId,
              offlineFarmerId
            )
          });
      } else {
        offlineRecommendationIndex++;
        this.uploadOfflineRecommendation(
          offlineRecommendationsTotal,
          offlineRecommendationIndex,
          offlineRecommendation,
          farmerId,
          offlineFarmerId
        )
      }

    } else {
      if (offlineRecommendationIndex === offlineRecommendationsTotal) {

        this.toastService
          .showSuccessToast('No more data to synchronize').then(() => {
          });
      }
    }
  }

}
