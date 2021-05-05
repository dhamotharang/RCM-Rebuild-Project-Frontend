import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { AlertService } from './../../../core/services/alert/alert.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { InitFieldInfoModel } from '../../../core/models/field-info.model';
import { Location } from '@angular/common';
import { GpxModel } from '../../../core/models/gpx.model';
import { FieldOwner } from '../../../v2/core/enums/field-ownership.enum';
import { ModalController } from '@ionic/angular';
import { GpxFileUploaderService } from '../../../core/services/gpx-file-uploader.service';
import { GpxFileUploadModel } from '../../../core/models/gpx-file-upload.model';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Role } from 'src/app/v2/core/enums/role.enum';
import { FieldRecommendationService } from '../../../recommendation/services/field-recommendation.service';
import { RCMRecommendationListModel } from 'src/app/recommendation/model/rcm-recommendation-list.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DownloadService } from 'src/app/core/services/download/download.service';
import { FieldRecommendationApiModel } from 'src/app/recommendation/model/recommendation-form-models/field-recommendation-api.model';
import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FarmLotFormModalComponent } from 'src/app/farm-management/modals/farm-lot-form-modal/farm-lot-form-modal.component';
import { FieldService } from 'src/app/farm-management/services/field.service';
import { FarmerAndFieldStorageService } from 'src/app/offline-management/services/farmer-and-field-storage.service';
import { FarmerModel } from 'src/app/farmer-management/models/farmer.model';
import { FarmerService } from 'src/app/farmer-management/services/farmer.service';
import { RecommendationStorageService } from 'src/app/offline-management/services/recommendation-storage.service';

const OFFLINE_RECOMMENDATION_KEY_PREFIX = 'OFFLINE_RECOMMENDATION_STORAGE_KEY';

@Component({
  selector: 'app-farmer-field-info',
  templateUrl: './farmer-field-info.component.html',
  styleUrls: ['./farmer-field-info.component.scss'],
})
export class FarmerFieldInfoComponent implements OnInit {
  public recommendationColumns: string[] = ['sowingDate', 'refId', 'action'];
  public recommendationOfflineColumns: string[] = [
    'sowingDate',
    'temporaryRefId',
    'action',
    'uploaded',
  ];
  public recommendationDataSource = new MatTableDataSource();
  public recommendationOfflineDataSource = new MatTableDataSource();

  public fieldId: number;
  public offlineFieldId: string;
  public farmerId: number;
  public _fieldInfo: FarmApiModel;
  public fieldAddressDisplay: string;
  public polygonPaths: any[] = [];
  public mapLongitude: number;
  public mapLatitude: number;
  public loadingInfo: boolean;
  public fieldNameDisplay: string;
  public farmerInfo: FarmerModel;
  public gpxModels: GpxModel[] = [];
  public lat: number;
  public long: number;
  public gpxId: string;
  public calculatedArea: number;
  public errors: [];
  public overlapData: [];
  public uploadDate: string;
  public fileListMetadata: GpxFileUploadModel[] = [];

  public hasGpxFile = false;
  public isVerified = false;
  public fieldData: FarmApiModel;
  public posted: boolean;
  private loggedInUser: UserLoginModel;
  public isUploading = false;
  public showLoader = false;
  public rcmRecommendations: RCMRecommendationListModel[] = [];
  public isOffline: boolean;
  public offlineFieldRecommendations: FieldRecommendationApiModel[] = [];
  public roleId: number;
  public readonly PUBLIC_ACCESS = 5;
  private latestRCMSowingDateRecommendation: RCMRecommendationListModel;
  public isSyncButtonEnabled: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private fieldService: FieldService,
    private farmerService: FarmerService,
    private location: Location,
    private modalController: ModalController,
    private gpxFileUploaderService: GpxFileUploaderService,
    private authService: AuthenticationService,
    private router: Router,
    public alertService: AlertService,
    private fieldRecommendationService: FieldRecommendationService,
    public downloadService: DownloadService,
    public offlineStorageService: OfflineStorageService,
    private recommendationService: FieldRecommendationService,
    private farmerAndFieldStorage: FarmerAndFieldStorageService,
    private recommendationStorageService: RecommendationStorageService
  ) {
    if (this.authService.isAuthenticated()) {
      this.loggedInUser = authService.loggedInUser;
    }
  }

  get fieldOwnerText() {
    return FieldOwner;
  }

  @ViewChild(MatSort)
  set sort(sort: MatSort) {
    this.recommendationDataSource.sort = sort;
  }

  @ViewChild('offlineSort', { static: false })
  set sortOffline(offlineSort: MatSort) {
    this.recommendationOfflineDataSource.sort = offlineSort;
  }

  async ngOnInit() {
    const routeId = this.route.snapshot.paramMap.get('fieldId');
    this.fileListMetadata = [];
    this.loadingInfo = true;
    this._fieldInfo = InitFieldInfoModel();
    this.isOffline = await this.offlineStorageService.getOfflineMode();
    this.offlineFieldId = routeId;
    this.fieldId = !isNaN(Number(routeId)) ? parseInt(routeId) : 0;
    let fieldModel: FarmApiModel;
    if (isNaN(Number(routeId))) {
      fieldModel = await this.farmerAndFieldStorage.getFieldInfoByOfflineFieldId(
        this.offlineFieldId
      );
      this.getOfflineRCMRecommendations(this.offlineFieldId);
      this.setFieldInfo(fieldModel);
      this.loadingInfo = false;
    } else {
      if (this.isOffline) {
        fieldModel = await this.farmerAndFieldStorage.getFieldInfoByFieldId(
          this.fieldId
        );
        this.getRCMRecommendations(this.fieldId);
        this.getOfflineRCMRecommendations(fieldModel.field_id);
        this.setFieldInfo(fieldModel);
        this.loadingInfo = false;
      } else {
        await this.fieldService
          .getFarmerField(this.fieldId)
          .pipe(take(1))
          .subscribe((res) => {
            this.loadingInfo = false;
            if (res && res.fieldModel) {
              this.getRCMRecommendations(this.fieldId);
              this.getOfflineRCMRecommendations(res.fieldModel.field_id);
              this.setFieldInfo(res['fieldModel']);
            }
          });
      }
    }

    const routeFarmerId = this.route.snapshot.paramMap.get('id');
    this.farmerId = parseInt(routeFarmerId);

    if (isNaN(Number(routeFarmerId))) {
      this.setFarmerInfo(routeFarmerId);
    } else {
      if (this.isOffline) {
        this.setFarmerInfo(routeFarmerId);
      } else {
        this.farmerService
          .getFarmerById(this.farmerId)
          .pipe(take(1))
          .subscribe((farmerInfo) => {
            this.farmerInfo = farmerInfo;
            this.setFieldNameInfo(farmerInfo);
          });
      }
    }

    if (!this._fieldInfo.offlineFieldId) {
      this.gpxFileUploaderService
        .getGpxInfo(this.fieldId)
        .pipe(
          take(1),
          map((res: any) => {
            if (res) {
              if (
                res['gpxData']['fieldData'].length &&
                res['gpxData']['fieldData'][0]['verification_date']
              ) {
                this.isVerified = true;
                this.fieldData = res['gpxData']['fieldData'];
              }

              if (res['gpxData']['trackData'].length) {
                this.hasGpxFile = true;

                const gpxModel = {
                  paths: [],
                  errors: res['gpxData']['errorList'],
                  computedArea:
                    res['gpxData']['fieldData'][0].verified_field_size,
                  overlapData: res['gpxData']['overlapData'],
                  uploadDate: '',
                  gpxId: res['fieldModel']['gpx_id'],
                } as GpxModel;

                res['gpxData']['trackData'].forEach((trk: any) => {
                  gpxModel.paths.push({
                    lat: Number.parseFloat(trk.lat),
                    lng: Number.parseFloat(trk.lng),
                    elevation: Number.parseFloat(trk.elevation),
                    dateTime: trk.dateTime,
                  });
                });

                this.gpxModels = [gpxModel];
                return gpxModel;
              }
            }
          })
        )
        .subscribe((res: GpxModel) => {
          if (res) {
            this.loadingInfo = false;
            this.errors = res.errors;
            this.overlapData = res.overlapData;
            this.uploadDate = res.uploadDate;
            this.gpxId = res.gpxId;

            res.fillColor = '#86cff2';
            res.strokeColor = '#00ffff';

            let lenError = this.errors.length;
            let lenPath = res.paths.length;

            if (lenError == 0 || lenPath != 0) {
              this.lat = res.paths[0].lat;
              this.long = res.paths[0].lng;
            }

            this.calculatedArea = res.computedArea;
            this.gpxModels = [res];
          }
        });
    }
  }

  async ionViewDidEnter() {
    this.isSyncButtonEnabled = true;
    this.isOffline = await this.offlineStorageService.getOfflineMode();
    if (this.isOffline) {
      const fieldId = this.field.field_id
        ? this.field.field_id
        : this.field.offlineFieldId;
      this.getOfflineRCMRecommendations(fieldId);
    } else {
      if (this.field.field_id) {
        this.getRCMRecommendations(this.fieldId);
      } else {
        this.getOfflineRCMRecommendations(this.field.offlineFieldId);
      }
    }
  }

  private async setFarmerInfo(id) {
    const farmerModel = await this.farmerAndFieldStorage.getFarmerPageInfoData(
      id
    );
    const farmer = this.farmerService.mapFarmerApiToFarmerModel(farmerModel);
    this.farmerInfo = farmer;
    this.setFieldNameInfo(farmer);
  }

  hasUploaded(uploaded: boolean) {
    this.isUploading = uploaded;
  }

  public get field(): FarmApiModel {
    return this._fieldInfo;
  }

  setFieldInfo(value: FarmApiModel) {
    if (value.address) {
      this.fieldAddressDisplay = `${
        value.address.barangay ? value.address.barangay : ''
      } ${value.address.municipality} ${value.address.province} ${
        value.address.region
      }`;
    }
    this._fieldInfo = value;
  }

  public getRCMRecommendations(fieldId: number) {
    this.showLoader = true;
    this.fieldRecommendationService
      .getAllRCMRecommendation(fieldId)
      .subscribe((data) => {
        if (data) {
          this.showLoader = false;
          this.rcmRecommendations = this.sortRecommendationListBySowingDate(
            data
          );
          this.recommendationDataSource = new MatTableDataSource(data);
          this.recommendationDataSource.sort = this.sort;
        }
      });
  }

  private offlineLatestRcmRecommendation: FieldRecommendationApiModel;
  private isSowingDateWithinThreeMonths(): boolean {
    const numberOfRecommendations = this.rcmRecommendations.length;
    const numberOfRecommendationsOffline = this.offlineFieldRecommendations
      .length;
    let latestRCMRecommendationSowingDate: Date;
    if (!this.isOffline && numberOfRecommendations > 0) {
      this.latestRCMSowingDateRecommendation = this.sortRecommendationListBySowingDate(
        this.rcmRecommendations
      )[0];
      latestRCMRecommendationSowingDate = new Date(
        this.latestRCMSowingDateRecommendation.sowingDate
      );
    } else {
      if (numberOfRecommendationsOffline > 0) {
        this.offlineLatestRcmRecommendation = this.sortRecommendationListBySowingDate(
          this.offlineFieldRecommendations
        )[0];
        latestRCMRecommendationSowingDate = new Date(
          this.offlineLatestRcmRecommendation.targetYieldModel.sowingDate
        );
      } else if (
        numberOfRecommendationsOffline === 0 &&
        numberOfRecommendations > 0
      ) {
        this.latestRCMSowingDateRecommendation = this.sortRecommendationListBySowingDate(
          this.rcmRecommendations
        )[0];
        latestRCMRecommendationSowingDate = new Date(
          this.latestRCMSowingDateRecommendation.sowingDate
        );
      }
    }

    if (numberOfRecommendations > 0 || numberOfRecommendationsOffline > 0) {
      const today = new Date();
      const threeMonths = 3;
      const dateThreeMonthsPriorToday = new Date(
        today.setMonth(today.getMonth() - threeMonths)
      );
      return dateThreeMonthsPriorToday < latestRCMRecommendationSowingDate;
    }
    return false;
  }

  public checkFarmLotRecommendation() {
    let recommendationRefId: string;
    let recommendationSowingDate: Date;
    const numberOfRecommendations = this.rcmRecommendations.length;
    const numberOfRecommendationsOffline = this.offlineFieldRecommendations
      .length;
    if (this.isSowingDateWithinThreeMonths()) {
      if (this.isOffline && numberOfRecommendations > 0) {
        recommendationRefId = String(
          this.latestRCMSowingDateRecommendation.refId
        );
        recommendationSowingDate = this.latestRCMSowingDateRecommendation
          .sowingDate;

        this.alertService.alert(
          'Warning',
          'The farm lot you have selected had already been provided with RCM recommendation with reference number: <b>' +
            recommendationRefId +
            '</b> and sowing date: <b>' +
            recommendationSowingDate +
            '</b> that is within the last 3 months.',
          'Okay',
          '',
          false
        );
      } else {
        if (!this.isOffline && numberOfRecommendations > 0) {
          recommendationRefId = String(
            this.latestRCMSowingDateRecommendation.refId
          );
          recommendationSowingDate = this.latestRCMSowingDateRecommendation
            .sowingDate;
        } else {
          if (numberOfRecommendationsOffline > 0) {
            recommendationRefId = this.offlineLatestRcmRecommendation
              .temporaryRefId;
            recommendationSowingDate = this.offlineLatestRcmRecommendation
              .targetYieldModel.sowingDate;
          }
        }

        this.alertService.alert(
          'Warning',
          'The farm lot you have selected had already been provided with RCM recommendation with reference number: <b>' +
            recommendationRefId +
            '</b> and sowing date: <b>' +
            recommendationSowingDate +
            '</b> that is within the last 3 months. Do you want to replace the existing recommendation for this farm lot?',
          'Cancel',
          'Yes',
          this.routeToGenerateRecommendationPage.bind(this, true)
        );
      }
    } else {
      this.routeToGenerateRecommendationPage(false);
    }
  }

  public routeToGenerateRecommendationPage(isRecommendationForUpdate: boolean) {
    const numberOfRecommendations = this.rcmRecommendations.length;
    const numberOfRecommendationsOffline = this.offlineFieldRecommendations
      .length;
    let generateRecommendationRoute;

    if (!this.isOffline && numberOfRecommendations > 0) {
      generateRecommendationRoute = [
        'recommendation',
        this.latestRCMSowingDateRecommendation.refId,
        'update',
      ];
    } else {
      if (numberOfRecommendationsOffline > 0) {
        generateRecommendationRoute = [
          'recommendation',
          this.offlineLatestRcmRecommendation.temporaryRefId,
          'update',
        ];
      }
    }

    if (isRecommendationForUpdate) {
      this.router.navigate(generateRecommendationRoute, {
        relativeTo: this.route,
      });
    } else {
      this.router.navigate(['recommendation'], {
        relativeTo: this.route,
      });
    }
  }

  public async getOfflineRCMRecommendations(fieldId: string) {
    this.showLoader = true;
    let recommendationList = [];
    this.offlineFieldRecommendations = await this.fieldRecommendationService.getOfflineRCMRecommendation(
      fieldId
    );

    if (this.offlineFieldRecommendations) {
      this.offlineFieldRecommendations.forEach((data) => {
        const rcmRecommendation: RCMRecommendationListModel = {
          refId: data.refId,
          temporaryRefId: data.temporaryRefId,
          dateGenerated: data.dateGenerated
            ? new Date(data.dateGenerated)
            : new Date(),
          pdfFile: data.pdfFile,
          isUploading: false,
          error: false,
          sowingDate: data.sowingDate ? new Date(data.sowingDate) : new Date(),
        };
        recommendationList.push(rcmRecommendation);
        if (
          !rcmRecommendation.refId &&
          !rcmRecommendation.isUploading &&
          !rcmRecommendation.error &&
          !this.isFarmerRegisteredOffline(data.farmerId)
        ) {
          this.isSyncButtonEnabled = false;
        }
      });
    } else {
      this.offlineFieldRecommendations = [];
    }
    recommendationList = this.sortRecommendationListBySowingDate(
      recommendationList
    );
    this.recommendationOfflineDataSource = new MatTableDataSource(
      recommendationList
    );
    this.recommendationOfflineDataSource.sort = this.sortOffline;
  }

  public isFarmerOffline: boolean;

  public isFarmerRegisteredOffline(farmerId) {
    this.isFarmerOffline = farmerId.split('-').length > 2;
    return this.isFarmerOffline;
  }

  private sortRecommendationListBySowingDate(recommendationsList) {
    return recommendationsList.sort(
      (a, b) =>
        new Date(b.sowingDate).getTime() - new Date(a.sowingDate).getTime()
    );
  }

  setFieldNameInfo(value: FarmerModel) {
    this.fieldNameDisplay = `${value.firstName.charAt(0) + value.lastName}`;
  }

  public backClicked() {
    this.location.back();
  }

  public async onFileChange(event: Event) {
    this.posted = false;
    const fileName = event.target['files'][0].name;
    const gpxId = this._fieldInfo.gpx_id;
    const fileNameTemp = fileName.includes('Track_')
      ? fileName.slice(6, 23)
      : fileName;

    if (
      this.gpxFileUploaderService.isFileNameAndTrackNameMatch(fileName, gpxId)
    ) {
      this.fileListMetadata = await this.gpxFileUploaderService.getGpxMetadata(
        event
      );
    } else {
      this.alertService.alert(
        'Gpx Upload',
        "Farm lot's Gpx ID: <b>" +
          gpxId +
          '</b> does not match Gpx ID in the file name: <b>' +
          fileNameTemp +
          '</b> to be uploaded.',
        'Okay',
        '',
        ''
      );
    }
  }

  async editFieldModal() {
    const modal = await this.modalController.create({
      component: FarmLotFormModalComponent,
      componentProps: {
        type: 'edit',
        fieldInfo: this._fieldInfo,
        field_name_display: this.fieldNameDisplay,
        farmerInfo: this.farmerInfo,
      },
    });

    modal.onDidDismiss().then((field) => {
      if (field['data']) {
        this._fieldInfo = field['data'];
        this.setFieldInfo(this._fieldInfo);
        this.alertService.alert(
          'Edit Farm Lot',
          'Successfully edited farm lot!',
          'Okay',
          '',
          ''
        );
      }
    });

    return modal.present();
  }

  public onDeleteField() {
    this.fieldService.deleteField(this.fieldId).subscribe((res) => {
      let isSoftDeleted = 1;

      if (res.status == isSoftDeleted) {
        this.router.navigate([
          '/data-admin/farmer-management/farmer-info',
          this.farmerId,
          'view',
        ]);
      }
    });
  }

  async confirmDeletion() {
    this.alertService.alert(
      'Delete Farm Lot',
      'Are you sure you want to delete ' +
        this._fieldInfo.field_id +
        '? All related Gpx/s will also be deleted.',
      'No',
      'Yes',
      this.onDeleteField.bind(this)
    );
  }

  async confirmGpxDeletion() {
    this.alertService.alert(
      'Delete Gpx',
      'Are you sure you want to delete ' + this._fieldInfo.gpx_id + '?',
      'No',
      'Yes',
      this.onDeleteGpx.bind(this)
    );
  }

  public onDeleteGpx() {
    this.gpxFileUploaderService.deleteGpx(this.fieldId).subscribe((res) => {
      let isSoftDeleted = 1;

      if (res.status == isSoftDeleted) {
        this.router.navigate([
          '/data-admin/farmers/' + this.farmerId + '/field/' + this.fieldId,
        ]);
        this.isVerified = false;
        this.hasGpxFile = false;
      }
    });
  }

  public downloadGpx() {
    this.gpxFileUploaderService.downloadGpx(this.gpxId).subscribe((data) => {
      if (data) {
        const fileName = data.gpx_id + '.gpx';
        this.downloadService.downloader(data.gpx_file, fileName);
      } else {
        this.alertService.alert(
          'Download Gpx',
          'No GPX File Uploaded!',
          'Okay',
          '',
          ''
        );
      }
    });
  }

  public navigateToRecommendation(recommendationId) {
    setTimeout(() => {
      this.router.navigate(['recommendation', recommendationId], {
        relativeTo: this.route,
      });
    });
  }

  public downloadRecommendation(pdfFile, refId) {
    let farmerName =
      this.farmerInfo.firstName +
      '_' +
      this.farmerInfo.middleName +
      '_' +
      this.farmerInfo.lastName;

    if (this.farmerInfo.isMiddleNameUnknown) {
      farmerName = this.farmerInfo.firstName + '_' + this.farmerInfo.lastName;
    }

    const fileName = farmerName + '_' + refId + '.pdf';

    this.downloadService.downloader(pdfFile, fileName);
  }

  public isDataAdmin() {
    const GAO = this.loggedInUser.gao;
    return GAO === Role.REGIONAL_DATA_ADMIN || GAO === Role.DATA_ADMIN;
  }

  public checkIfValidDate(date: Date) {
    return new Date(date).toString() !== 'Invalid Date';
  }

  public fieldDetails: any;
  public onFormValid(event: any) {
    this.fieldDetails = event;
  }

  public async syncRecommendation() {
    for (let i = 0; i < this.offlineFieldRecommendations.length; i++) {
      const recommedation = this.offlineFieldRecommendations[i];
      if (!recommedation.refId) {
        const recommedationList = this.recommendationOfflineDataSource
          .filteredData[i] as any;
        recommedationList.isUploading = true;

        try {
          const savedRecommendation = await this.recommendationService
            .saveRecommendation(recommedation)
            .toPromise();
          const refId = (savedRecommendation as any).ref;
          recommedationList.isUploading = false;
          recommedationList.error = false;
          recommedationList.refId = refId;
          recommedation.refId = refId;

          await this.recommendationStorageService.update(recommedation);

          this.isSyncButtonEnabled = true;
        } catch (e) {
          recommedationList.error = true;
          recommedationList.isUploading = false;
          this.isSyncButtonEnabled = false;
        }
      }
    }

    this.getRCMRecommendations(this.fieldId);
  }
}
