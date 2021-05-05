import { AlertService } from './../../../core/services/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { FarmerService } from '../../../core/services/farmer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { FarmerSex } from '../../../farmer-management/enums/farmer-sex.enum';
import { Role } from 'src/app/v2/core/enums/role.enum';
import { DatePipe, Location } from '@angular/common';
import { DownloadService } from 'src/app/core/services/download/download.service';
import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FieldService } from 'src/app/farm-management/services/field.service';
import { PrintFarmerIdentificationComponent } from 'src/app/farmer-management/print-farmer-identification/print-farmer-identification.component';

@Component({
  selector: 'app-farmer-info',
  templateUrl: './farmer-info.component.html',
  styleUrls: ['./farmer-info.component.scss'],
})
export class FarmerInfoComponent implements OnInit {
  public farmerInfo: FarmerApiModel;
  public farmerFields: FarmApiModel[];
  private loggedInUser: UserLoginModel;
  private farmerId: number;
  public isLocked = true;
  private isFarmerAlreadyInterviewed = false;
  public isGenerateIdCardDisabled: boolean;

  constructor(
    private farmerService: FarmerService,
    private fieldService: FieldService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private router: Router,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private datepipe: DatePipe,
    public downloadService: DownloadService,
    private _location: Location,
  ) {
    if (this.authService.isAuthenticated()) {
      this.loggedInUser = authService.loggedInUser;
    }
  }

  public goBackToPreviousPage() {
    this._location.back();
  }

  public async getFarmerInfo() {
    this.setFarmerId();

    this.farmerService.getFarmerInfo(this.getFarmerId())
    .pipe(take(1))
    .subscribe((res) => {
      this.farmerInfo = res;
      this.farmerFields = res.fields;

      const farmerAddress = this.farmerInfo.address;
      const farmerBarangay = farmerAddress.barangay != "" ? farmerAddress.barangay : '';
      const farmerMunicipality = farmerAddress.municipality != "" ? farmerAddress.municipality : '';
      const farmerProvince = farmerAddress.province != "" ? farmerAddress.province : '';
      const farmerRegion = farmerAddress.region != "" ? farmerAddress.region : '';
      this.farmerAddressDisplay = `${farmerBarangay} ${farmerMunicipality} ${farmerProvince} ${farmerRegion}`;

      let softDeleted = 1;
      let gao = this.loggedInUser.gao;

      this.isInterviewedByMe().subscribe(res => {
        this.isFarmerAlreadyInterviewed = res.status;

        if (
          gao === Role.REGIONAL ||
          gao === Role.PROVINCIAL ||
          gao === Role.MUNICIPAL ||
          gao === Role.REGIONAL_DATA_ADMIN &&
          this.farmerInfo.status !== softDeleted &&
          (this.isInsideYourJurisdiction(gao) || this.isFarmerAlreadyInterviewed)
          ) {
          this.isLocked = false;
        }

        if (
          gao === Role.NATIONAL ||
          gao === Role.DATA_ADMIN &&
          this.farmerInfo.status !== softDeleted
          ) {
          this.isLocked = false;
        }

        if (gao === Role.PUBLIC && this.isFarmerAlreadyInterviewed) {
          this.isLocked = false;
        }

        if (this.isLocked) {
          this.navigateToDashboard();
        }
      });

      if (!this.farmerFields) {
        this.fieldService.getFields(this.getFarmerId())
        .pipe(take(1))
        .subscribe((res) => {
          this.farmerFields = res;
      this.isAnyFieldVerified(res);
        });
      } else {
        this.isAnyFieldVerified(this.farmerFields);
      }
    });
  }

  public navigateToDashboard() {
    this.router.navigate(['data-admin', 'dashboard']);
  }

  private isInsideYourJurisdiction(gao) {
    let isInsideYourJurisdiction = false;

    switch (gao) {
      case Role.REGIONAL:
      case Role.REGIONAL_DATA_ADMIN:
        isInsideYourJurisdiction = (this.farmerInfo.address.region_id === this.loggedInUser.officeAddress.regionId);
        break;
      case Role.PROVINCIAL:
        isInsideYourJurisdiction = (this.farmerInfo.address.province_id === this.loggedInUser.officeAddress.provinceId);
        break;
      case Role.MUNICIPAL:
        isInsideYourJurisdiction = (this.farmerInfo.address.municipality_id === this.loggedInUser.officeAddress.municipalityId);
        break;
    }

    return isInsideYourJurisdiction;

  }

  private isInterviewedByMe() {
    return this.farmerService.isInterviewedByMe(this.getFarmerId());
  }

  private setFarmerId() {
    this.farmerId = +this.route.snapshot.paramMap.get('id');
  }

  private getFarmerId() {
    return this.farmerId;
  }

  public onFieldSelected(field: FarmApiModel) {
    if(field.field_id){
      this.router.navigate(['data-admin', 'farmers', this.farmerInfo.id, 'field', field.id]);
    }else{
      const farmerId = this.farmerInfo.id ? this.farmerInfo.id : this.farmerInfo.offline_id;
      this.router.navigate(['data-admin', 'farmers', farmerId, 'field', field.offlineFieldId]);
    }
  }

  get farmerSexText() { return FarmerSex; }

  ngOnInit() { }

  async ionViewWillEnter() {
    await this.getFarmerInfo();
  }

  private isAnyFieldVerified(fieldsArray: FarmApiModel[]) {
    let arrFieldsVerified = fieldsArray.map(farmerField => farmerField['is_verified']);

    this.isGenerateIdCardDisabled = true;

    if (arrFieldsVerified.includes(1)) {
      this.isGenerateIdCardDisabled = false;
    }
  }

  get bgProfileImg(): string {
    if (!this.farmerInfo) {
      return '';
    }
    return 'url(' + this.farmerInfo.photo + ')';
  }

  get farmerNameDisplay(): string {
    return this.farmerInfo ? `${this.farmerInfo.first_name} ${this.farmerInfo.last_name}` : '';
  }

  get birthdate(): any {

    if (this.farmerInfo && this.farmerInfo.birth_date) {
      const d = new Date(this.farmerInfo.birth_date);
      if (d.toString() === 'Invalid Date') {
        return this.farmerInfo.birth_date;
      } else {
        return  this.datepipe.transform(d);
      }
    }
    else {
      return '';
    }
  }

  public async onPrintId() {
    const modal = await this.modalCtrl.create({
      component: PrintFarmerIdentificationComponent,
      componentProps: {
        farmerInfo: this.farmerInfo,
        farmerFields: this.farmerFields,
        roleId: this.loggedInUser.gao
      }
    });
    await modal.present();
  }

  public onViewDataPrivacy() {
    if (this.farmerInfo.data_privacy_consent) {
      const fileName = this.farmerInfo.farmer_id + "-data-privacy.jpeg";
      this.downloadService.downloader(this.farmerInfo.data_privacy_consent, fileName);
    } else {
      this.alertService.alert(
        'Data Privacy',
        'No Data Privacy Consent Available',
        'Okay',
        '',
        ''
      );
    }
  }

  public farmerAddressDisplay: string;

  public onDeleteFarmer() {

    let farmerId = this.getFarmerId();
    this.farmerService.deleteFarmer(farmerId).subscribe(res => {
      let isSoftDeleted = 1;

      if (res.status == isSoftDeleted) {
        this.navigateToDashboard();
      }
    });
  }

  async confirmDeletion() {
    this.alertService.alert(
      'Delete Farmer',
      'Are you sure you want to delete ' + this.farmerInfo.farmer_id + '? All related farm lot/s and Gpx/s will also be deleted.',
      'No',
      'Yes',
      this.onDeleteFarmer.bind(this)
    );
  }

  public isDataAdmin() {
    const GAO = this.loggedInUser.gao;
    return GAO === Role.REGIONAL_DATA_ADMIN || GAO === Role.DATA_ADMIN;
  }

}
