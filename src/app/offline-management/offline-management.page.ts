import { FormMode } from 'src/app/location/enum/mode.enum';
import { Component, OnInit } from '@angular/core';
import { LocationStorageService } from 'src/app/offline-management/services/location-storage.service';
import { LocationService } from 'src/app/location/service/location.service';
import { take, catchError } from 'rxjs/operators';
import { DataPotentialYieldService } from 'src/app/recommendation/services/data-potential-yield.service';
import { PotentialYieldStorageService } from 'src/app/offline-management/services/potential-yield-storage.service';
import { FarmerAndFieldStorageService } from 'src/app/offline-management/services/farmer-and-field-storage.service';
import { FormGroup } from '@angular/forms';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { AlertNotificationService } from 'src/app/v2/core/services/alert-notification.service';
import { FarmerService } from 'src/app/farmer-management/services/farmer.service';
import { OfflineDataModel } from 'src/app/offline-management/models/offline-data-model';
import { VarietyService } from 'src/app/recommendation/services/variety.service';
import { VarietyStorageService } from 'src/app/offline-management/services/variety-storage.service';
import { FieldRecommendationService } from 'src/app/recommendation/services/field-recommendation.service';
import { LocationFormModel } from 'src/app/location/models/location-form.model';
import { progress } from '../v2/helpers/async-progress.helper';
import { LoaderOverlayService } from '../v2/core/services/loader-overlay.service';

@Component({
  selector: 'app-offline-management',
  templateUrl: './offline-management.page.html',
  styleUrls: ['./offline-management.page.scss'],
})
export class OfflineManagementPage implements OnInit {
 
  public isDownloadingFarmerAndFieldData = false;
  public hasFarmerAndFieldData = false;
  public isDownloadingVarietyData = false;
  public downloadInterviewForm = new FormGroup({});
  public dateDownloaded: Date;
  public farmerDataLocation: LocationFormModel;
  public addresssFormMode = FormMode.material;

  constructor(
    private locationStorage: LocationStorageService,
    private locationService: LocationService,
    private potentialYieldService: DataPotentialYieldService,
    private potentialYieldStorage: PotentialYieldStorageService,
    private farmerAndFieldStorage: FarmerAndFieldStorageService,
    private farmerService: FarmerService,
    private offlineStorage: OfflineStorageService,
    private alertNotificationService: AlertNotificationService,
    private varietyService: VarietyService,
    private varietyStorage: VarietyStorageService,
    private recommendationService: FieldRecommendationService,
    private loaderOverlayService: LoaderOverlayService,
  ) {}

  ngOnInit() {

    this.farmerAndFieldStorage.getFarmerData().then((res: OfflineDataModel) => {
      if (res) {
        this.hasFarmerAndFieldData = true;
        this.dateDownloaded = res.dateDownloaded;
      }
    });

    this.farmerAndFieldStorage
      .getFarmerDataLocation()
      .then((res: LocationFormModel) => {
        if (res) {
          this.farmerDataLocation = res;
        }
      });
  }

  public async downloadFarmerAndFieldOfflineData() {
    this.downloadInterviewForm.markAllAsTouched();
    this.isDownloadingFarmerAndFieldData = true;
    this.downloadInterviewForm.controls.barangay.clearValidators();
    this.downloadInterviewForm.controls.barangay.updateValueAndValidity();

    if (this.downloadInterviewForm.valid) {
      const address: LocationFormModel = {
        regionId: this.downloadInterviewForm.controls.region.value,
        provinceId: this.downloadInterviewForm.controls.province.value,
        municipalityId: this.downloadInterviewForm.controls.municipality.value,
      };
      this.farmerDataLocation = address;

      const municipalityId = this.downloadInterviewForm.controls.municipality
        .value;

      try {
        await this.loaderOverlayService.showProgress();
        const  [
          regionData,
          provinceData,
          municipalityData,
          barangayData,
          potentialYieldData,
          varietyData,
          farmerAndFieldInfoForOffline,
          recommendations,
        ] = await progress([
          this.locationService
            .getRegionsApi()
            .pipe(
              take(1),
              catchError(() => {
                throw new Error('Regions Data')
              }),
            ).toPromise(),
          this.locationService
            .getProvinces()
            .pipe(
              take(1),
              catchError(() => {
                throw new Error('Provinces Data')
              })
            ).toPromise(),
          this.locationService
            .getMunicipalities()
            .pipe(
              take(1),
              catchError(() => {
                throw new Error('Municipalities Data');
              })
            ).toPromise(),
          this.locationService
            .getBarangaysApi()
            .pipe(
              take(1),
              catchError(() => {
                throw new Error('Barangay Data');
              })
            ).toPromise(),
          this.potentialYieldService
            .getPotentialYieldApi()
            .pipe(
              take(1),
              catchError(() => {
                throw new Error('Potential Yield Data');
              })
            ).toPromise(),
          this.varietyService
            .getVarietyApi()
            .pipe(
              take(1),
              catchError(() => {
                throw new Error('Variety Data');
              })
            ).toPromise(),
          this.farmerService
            .getFarmerAndFieldInfoForOffline(municipalityId)
            .pipe(
              take(1),
            ).toPromise(),
          this.recommendationService
            .getAllRecommendationForOffline(municipalityId)
            .toPromise(),
        ], (progress) => {
          this.loaderOverlayService.setProgress(progress);
        }).finally(() => {
          this.loaderOverlayService.stopProgress();
        });

        if (
          regionData &&
          provinceData &&
          municipalityData &&
          barangayData &&
          potentialYieldData &&
          varietyData
        ) {
          await this.loaderOverlayService.showProgress('Storing data');
          
          const storagePromises: Array<Promise<any>> = [
            this.locationStorage.storeRegionData(regionData),
            this.locationStorage.storeProvinceData(provinceData),
            this.locationStorage.storeMunicipalityData(municipalityData),
            this.locationStorage.storeBarangayData(barangayData),
            this.potentialYieldStorage.storePotentialYieldData(potentialYieldData),
            this.varietyStorage.storeVarietyData(varietyData),
          ];

          if (farmerAndFieldInfoForOffline) {
            storagePromises.push(
              this.farmerAndFieldStorage
                .storeFarmerAndFieldData(farmerAndFieldInfoForOffline, recommendations)
                .then(() => {
                  this.dateDownloaded = farmerAndFieldInfoForOffline.dateDownloaded;
                  this.hasFarmerAndFieldData = true;
                  this.isDownloadingFarmerAndFieldData = false;
                })
                .catch(() => {
                  this.isDownloadingFarmerAndFieldData = false;
                  this.hasFarmerAndFieldData = false;
                }),
            )

            storagePromises.push(
              this.farmerAndFieldStorage
              .storeFarmerLocation(this.farmerDataLocation)
              .catch(() => {
                this.farmerDataLocation = null;
              }),
            );
          }
          
          
          await progress(storagePromises, (progress) => {
            this.loaderOverlayService.setProgress(progress);
          }).finally(() => {
            this.loaderOverlayService.stopProgress();
          });
        } else {
          throw new Error();
        }
      } catch (error) {
        this.downloadError(error)
      }
    } else {
      this.isDownloadingFarmerAndFieldData = false;
    }
  }

  public downloadError(error = '') {
    this.alertNotificationService.showAlert(
      error,
      'Offline Data Error, Please try again.'
    );
    this.isDownloadingFarmerAndFieldData = false;
    this.hasFarmerAndFieldData = false;
    this.clearOfflineData();
  }

  public uploadNewFarmerAndFieldOfflineData() {
    this.farmerAndFieldStorage
      .clearFarmerAndFieldData()
      .then(() => {
        this.hasFarmerAndFieldData = false;
        this.farmerDataLocation = null;
        this.downloadInterviewForm.reset();
      })
      .catch(() => {
        // catch here
      });
  }

  public async clearOfflineData() {
    this.offlineStorage
      .clearAll()
      .then(() => {
        this.hasFarmerAndFieldData = false;
        this.downloadInterviewForm.reset();
      })
      .catch(() => {
        // catch here
      });
  }
}
