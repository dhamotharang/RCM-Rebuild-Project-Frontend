import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { ErrorModel } from 'src/app/v2/core/models/error.model';
import { AlertNotificationService } from 'src/app/v2/core/services/alert-notification.service';
import { ToastService } from 'src/app/v2/core/services/toast.service';
import { FarmerFormComponent } from '../components/farmer-form/farmer-form.component';
import { FarmerModel } from '../models/farmer.model';
import { FarmerService } from '../services/farmer.service';
import { pageAction } from "src/app/v2/core/enums/pageaction.enum";
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { getEditAccess } from 'src/app/core/helpers/check-user-access-helper';
import { FarmerAndFieldStorageService } from 'src/app/offline-management/services/farmer-and-field-storage.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { FarmLotFormModalComponent } from 'src/app/farm-management/modals/farm-lot-form-modal/farm-lot-form-modal.component';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FieldService } from 'src/app/farm-management/services/field.service';
import { FarmerFieldListComponent } from 'src/app/farm-management/farmer-field-list/farmer-field-list.component';
import { UploadFarmerAndFieldOfflineStorageService } from "src/app/offline-management/services/upload-farmer-and-field-offline-storage.service";

@Component({
  selector: 'app-edit-farmer',
  templateUrl: './edit-farmer.component.html',
  styleUrls: ['./edit-farmer.component.scss'],
})
export class EditFarmerComponent implements OnInit {

  public adminUser: boolean;
  public farmerId: number;
  public farmerInfo: FarmerModel;
  public submitBtnLabel: string = 'SAVE FARMER';

  public editFarmerInfo: boolean;
  public isUrlEditFarmer: boolean;

  public farmerFields: FarmApiModel[];
  public isOfflineModeEnabled: boolean;

  constructor(
    private authService: AuthenticationService,
    public farmerService: FarmerService,
    public fieldService: FieldService,
    public activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private router: Router,
    private alertNotification: AlertNotificationService,
    private offlineStorage: OfflineStorageService,
    private farmerLocalStorageService: FarmerAndFieldStorageService,
    private location: Location,
    private modalController: ModalController,
    private uploadFarmerAndFieldOfflineDataService: UploadFarmerAndFieldOfflineStorageService,
  ) {
    const urlPath = this.router.routerState.snapshot.url;
    const editFarmerUrl = urlPath.split('/').slice(-1)[0];
    this.isUrlEditFarmer = editFarmerUrl == "edit";
  }

  @ViewChild('farmerFormInstance') farmerFormInstance: FarmerFormComponent;
  loggedInUserGao: number;
  ngOnInit() {
    this.loggedInUserGao = this.authService.loggedInUser.gao;
    this.adminUser = getEditAccess(this.loggedInUserGao);
    if (this.farmerFormInstance) {
      this.farmerFormInstance.clearForm();
    }
    this.activatedRoute.params.subscribe(params => {
      this.farmerId = params['id'];

      this.editFarmerInfo = true;

      if (params['action'] === pageAction.VIEW) {
        this.editFarmerInfo = false;
        this.submitBtnLabel = 'EDIT FARMER';
      }
    });
  }

  async ionViewWillEnter() {
    this.isOfflineModeEnabled = await this.offlineStorage.getOfflineMode();
    this.populateFieldLIst();
  }

  public getFarmerPageInfoOffline(farmerId: number) {
    this.farmerLocalStorageService.getFarmerPageInfoData(farmerId).then((farmer) => {
      if (farmer) {
        this.farmerInfo = this.farmerService.mapFarmerApiToFarmerModel(farmer);
        this.farmerFields = farmer.fields;
      }
    });
  }

  public onFarmerFormSubmit(farmerData: FarmerModel) {
    if (this.editFarmerInfo) {
      this.farmerService.updateFarmerInfo(this.farmerId, farmerData).pipe(take(1))
        .subscribe((res: FarmerModel) => {
          this.toastService.showSuccessToast('Farmer was edited successfully!')
            .then(() => {
		          this.router.navigate(['/data-admin/farmer-management/farmer-info', this.farmerId, 'view']);
            })
        }, (errorData: ErrorModel) => {
          this.alertNotification.showAlert(errorData.message);
        });
    } else {
      this.router.navigate(['/data-admin/farmer-management/farmer-info', this.farmerId, 'edit']);
    }
  }

  public backClicked() {
    if (this.isUrlEditFarmer) {
      this.location.back();
    } else {
      this.router.navigate(['/data-admin/farmer-management/farmer-list']);
    }
  }

  get fieldNameDisplay(): string {
    return this.farmerInfo.firstName.charAt(0) + this.farmerInfo.lastName;
  }


  public async onAddFarmLot(){
      const modal = await this.modalController.create({
        component: FarmLotFormModalComponent,
        componentProps: {
          fields: this.farmerFields,
          farmer_id: this.farmerInfo.farmerId,
          farmerInfo: this.farmerInfo,
          field_name: this.fieldNameDisplay,
          type: 'add',
        },
      });
  
      modal.onDidDismiss().then(field => {
        if (field['data']) {
          field['data'].farmer_id = this.farmerInfo.farmerId;
          this.farmerFields.push(field['data']);
          this.toastService.showSuccessToast('Farm Lot was added successfully!');
          this.farmerFields.sort((a, b) => b.id - a.id);
        }
      });
  
      return modal.present();
  }

  public async onViewFarmLotList() {
    if (this.uploadFarmerAndFieldOfflineDataService.repopulateFieldList) {
      this.populateFieldLIst();
    }
    const modal = await this.modalController.create({
      component: FarmerFieldListComponent,
      componentProps: {
        fieldList: this.farmerFields,
        farmerInfo: this.farmerInfo,
      },
    });

    return modal.present();
  }

  async syncOfflineFarmerAndField(){
    if (this.isOfflineModeEnabled) {
      this.alertNotification
        .showAlert(`Please <i><u>Uncheck</u> <u>Offline mode</u></i> on the settings menu`, 'Alert');
    } else {
      await this.uploadFarmerAndFieldOfflineDataService
        .uploadFarmerAndFieldInfoAndRecommendation(
            this.farmerFields, 
            this.farmerInfo.offlineId, 
            this.farmerInfo.farmerId);

    }
  }

  populateFieldLIst() {
    if (this.isOfflineModeEnabled) {
      this.getFarmerPageInfoOffline(this.farmerId);
    } else {
      if (isNaN(this.farmerId)) {
        this.getFarmerPageInfoOffline(this.farmerId);
      } else {
        this.farmerService.getFarmerById(this.farmerId).pipe(take(1)).subscribe(farmerInfo => {
          this.farmerInfo = farmerInfo;
          if (farmerInfo) {
            this.fieldService.getFields(this.farmerId)
            .pipe(take(1))
            .subscribe((res) => {
              const results = !res ? [] : res;


              const offlineFields = [];

              const allFields = [offlineFields, results] as any;
              this.farmerFields = allFields.flat();
            });
          }
        });
      }
    }
  }

}
