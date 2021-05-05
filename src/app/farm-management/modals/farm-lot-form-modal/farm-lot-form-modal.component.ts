import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { InitFieldInfoModel } from 'src/app/core/models/field-info.model';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import {
  mobileNumberLengthValidator,
  mobileNumberPrefixValidator,
} from 'src/app/v2/helpers/form-validator-custom.helper';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FormMode } from 'src/app/location/enum/mode.enum';
import { LocationFormModel } from 'src/app/location/models/location-form.model';
import { FieldService } from 'src/app/farm-management/services/field.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { FarmerAndFieldStorageService } from 'src/app/offline-management/services/farmer-and-field-storage.service';
import {v4 as uuidv4} from 'uuid';
import { FarmerModel } from 'src/app/farmer-management/models/farmer.model';
import { LocationService } from 'src/app/location/service/location.service';

@Component({
  selector: 'app-farm-lot-form-modal',
  templateUrl: './farm-lot-form-modal.component.html',
  styleUrls: ['./farm-lot-form-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FarmLotFormModalComponent implements OnInit {
  public clickedSubmit = false;
  public invalidForm: boolean;
  @Input() public type: string;
  private id: number;
  public adminUser: boolean;
  public field_name_raw: string;
  public locationIsDisabled: boolean = true;
  public otherFName: string;
  public otherLName: string;
  public farmer_id: string;
  @Input() field_name: string;
  @Input() field_desc: string;
  @Input() field_size_ha: number;
  @Input() fieldInfo: FarmApiModel;
  @Input() farmerInfo: FarmerModel;
  @Input() public edit: boolean;
  public isFarmerFarmLotOrgExists = false;
  public addresssFormMode = FormMode.ionic;
  public fieldAddress: LocationFormModel;
  public isOffline: Boolean;

  public farmerFieldForm = new FormGroup({
    field_name: new FormControl(null, Validators.required),
    fieldUnit: new FormControl(null, Validators.required),
    fieldSizeHa: new FormControl(null, []),
    fieldOrgName: new FormControl(null, []),
    fieldMemberOrg: new FormControl({ disabled: true }, Validators.required),
    fieldOwnership: new FormControl(null, Validators.required),
    farmLotOwnerGivenName: new FormControl(null, []),
    farmLotOwnerSurname: new FormControl(null, []),
    farmLotOwnerNumber: new FormControl(null, []),
    sameFormLocation: new FormControl(null, []),
    sameFieldOrg: new FormControl(null, []),
  });

  @Input()
  public setField(value: FarmApiModel) {
    if (value) {
      this.fieldAddress = {
        regionId: this.fieldInfo.address.region_id,
        provinceId: this.fieldInfo.address.province_id,
        municipalityId: this.fieldInfo.address.municipality_id,
        barangayId: this.fieldInfo.address.barangay_id,
      };

      this.id = value.id;

      let f_unit = value.field_unit;
      let f_size: any = value.field_size;

      if (value.field_unit === 0) {
        f_unit = 1;
        f_size = value.field_size_ha;
      }

      this.farmerFieldForm.controls.fieldUnit.setValue(f_unit);
      this.selectedFieldUnit = f_unit;
      this.setFieldUnitValidation(this.selectedFieldUnit);

      this.farmerFieldForm.controls.fieldSizeHa.setValue(f_size);
      this.field_size_ha = value.field_size_ha;

      let f_fmo = value.field_member_org;

      if (f_fmo == '') {
        f_fmo = '2';
      }

      this.farmerFieldForm.controls.fieldMemberOrg.setValue(f_fmo);
      this.selectedFieldMemberOrg = parseInt(f_fmo);
      this.setFieldMemOrgValidation(this.selectedFieldMemberOrg);

      this.farmerFieldForm.controls.fieldOrgName.setValue(value.field_org_name);

      this.farmerFieldForm.controls.fieldOwnership.setValue(
        value.field_ownership.toString()
      );
      this.selectedFieldOwnership = value.field_ownership;
      this.setFieldOwnValidation(this.selectedFieldOwnership);

      this.farmerFieldForm.controls.farmLotOwnerGivenName.setValue(
        value.farm_lot_owner_given_name
      );
      this.farmerFieldForm.controls.farmLotOwnerSurname.setValue(
        value.farm_lot_owner_surname
      );
      this.farmerFieldForm.controls.farmLotOwnerNumber.setValue(
        value.farm_lot_owner_number
      );

      if (this.selectedFieldOwnership != 1) {
        let firstLetter = this.farmerFieldForm.controls.farmLotOwnerGivenName.value.charAt(
          0
        );
        this.field_name =
          firstLetter + this.farmerFieldForm.controls.farmLotOwnerSurname.value;
        this.otherFName = firstLetter;
      } else {
        this.field_name = this.field_name_raw;
      }

      this.farmerFieldForm.controls.sameFormLocation.setValue(
        value.same_farmer_location
      );

      this.fieldNameDynamics(value, this.field_name);
    }
  }

  public fieldNameDynamics(value, name) {
    const fieldFullName = value.field_name.toLowerCase();
    const fieldNames = fieldFullName.split(' ');
    const hasPrefix = !!fieldNames.find(fName => fName === name.toLowerCase());
    const hasDescription = fieldNames.length > 1;

    if (hasPrefix) {
      const fieldDescription = hasDescription ? fieldNames.filter((n, i) => i > 0).join(' ') : '';
      this.farmerFieldForm.controls.field_name.setValue(fieldDescription);
    } else {
      this.farmerFieldForm.controls.field_name.setValue(value.field_name);
    }
  }
  private form: any;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private fieldService: FieldService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private offlineService: OfflineStorageService,
    private farmerFieldOfflineService: FarmerAndFieldStorageService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.type = this.navParams.get('type');
    this.field_name_raw = this.navParams.get('field_name_display');
    this.farmer_id = this.farmerInfo.farmerId;

    this.adminUser =
      this.authService.isDataAdmin || this.authService.isRegionalDataAdmin;

    if (this.adminUser || this.type === 'add') {
      this.locationIsDisabled = false;
    }

    this.edit = this.type == 'add' ? true : this.adminUser ? true : false;
    this.isFarmerFarmLotOrgExists = !!this.farmerInfo.farmerAssociation;
  }

  async ionViewWillEnter() {
    this.isOffline = await this.offlineService.getOfflineMode();
  }

  ionViewDidEnter() {
    this.setField(this.fieldInfo);
  }

  public onSameLocationChange() {
    if (this.type == 'add') {
      this.fieldInfo = InitFieldInfoModel();
    } else {
      this.fieldInfo.address = {
        region: '',
        region_code: '',
        region_id: 0,

        province: '',
        province_code: '',
        province_id: 0,

        municipality: '',
        municipality_code: '',
        municipality_id: 0,

        barangay: '',
        barangay_code: '',
        barangay_id: 0,
      };
    }

    if (this.farmerFieldForm.controls.sameFormLocation.value) {

      this.fieldAddress = {...this.farmerInfo.address};

      this.locationIsDisabled = true;
    } else {
      this.farmerFieldForm.controls.region.reset();
      this.farmerFieldForm.controls.province.reset();
      this.farmerFieldForm.controls.municipality.reset();
      this.farmerFieldForm.controls.barangay.reset();

      this.farmerFieldForm.controls.province.disable();
      this.farmerFieldForm.controls.municipality.disable();
      this.farmerFieldForm.controls.barangay.disable();

      if (this.adminUser || this.type === 'add') {
        this.locationIsDisabled = false;
      }
    }
  }

  public onSameFieldOrgChange() {
    if (this.farmerFieldForm.controls.sameFieldOrg.value) {
      this.farmerFieldForm.controls.fieldOrgName.setValue(
        this.farmerInfo.farmerAssociation
      );
    } else {
      this.farmerFieldForm.controls.fieldOrgName.reset();
    }
  }

  private conversion(validFieldSize: any) {
    if (validFieldSize % 1 != 0) {
      if (validFieldSize.toString().split('.')[1].length > 2) {
        validFieldSize = validFieldSize.toFixed(2);
      }
    }

    return validFieldSize;
  }

  public validFieldSize(event) {
    const regex = '^d+.?d*$';
    let fsize = this.farmerFieldForm.controls.fieldSizeHa.value;

    if (this.selectedFieldUnit === 1) {
      this.field_size_ha = this.conversion(fsize);
    } else {
      this.field_size_ha = this.conversion(fsize / 10000);
    }

    event.target.value = event.target.value.replace(regex, '');
  }

  private selectedFieldLocation: LocationFormModel;
  public onFieldLocationChange(fieldLocation: LocationFormModel) {
    this.selectedFieldLocation = fieldLocation;
  }

  public async addField() {
    this.farmerFieldForm.markAllAsTouched();
    if (this.farmerFieldForm.valid) {
      this.clickedSubmit = true;
      this.form = this.farmerFieldForm.getRawValue();
      let form = this.form;
      const fieldModel: FarmApiModel = this.fieldInfo
        ? this.fieldInfo
        : InitFieldInfoModel();
      fieldModel.field_name =
        this.field_name + ' ' + form.field_name.toLowerCase();
      fieldModel.field_unit = form.fieldUnit;
      fieldModel.field_size = form.fieldSizeHa;
      if (form.fieldUnit == 1) {
        fieldModel.field_size_ha = form.fieldSizeHa;
      } else {
        fieldModel.field_size_ha = this.field_size_ha;
      }

      fieldModel.field_ownership = form.fieldOwnership;

      if (fieldModel.field_ownership == 2 || fieldModel.field_ownership == 3) {
        fieldModel.farm_lot_owner_given_name = form.farmLotOwnerGivenName.toLowerCase();
        fieldModel.farm_lot_owner_surname = form.farmLotOwnerSurname.toLowerCase();
        fieldModel.farm_lot_owner_number = form.farmLotOwnerNumber;
      }

      fieldModel.field_member_org = form.fieldMemberOrg;

      if (fieldModel.field_member_org == '1') {
        fieldModel.field_org_name = form.fieldOrgName.toLowerCase();
      }

      fieldModel.farmer_id = this.farmerInfo.farmerId;

      if(this.farmerFieldForm.controls.sameFormLocation.value){
        const regionList = await this.locationService.getRegionsApi().toPromise();
        this.selectedFieldLocation.regionName = regionList.find((r) => r.id === form.region).label;

        const provincesList = await this.locationService
        .getRegionProvinces(this.form.region)
        .toPromise();
        this.selectedFieldLocation.provinceName = provincesList.find((p) => p.id === form.province).label;

        const municipalitiesList = await this.locationService
        .getProvinceMunicipalities(form.province)
        .toPromise();
        this.selectedFieldLocation.municipalityName = municipalitiesList.find((m) => m.id === form.municipality).label;


        const barangaysList = await this.locationService
        .getMunicipalityBarangays(form.municipality)
        .toPromise();
        this.selectedFieldLocation.barangayName = barangaysList.find((b) => b.id === form.barangay).label;
      }

      fieldModel.address = {
        region: this.selectedFieldLocation.regionName,
        region_code: '',
        region_id: form.region,

        province: this.selectedFieldLocation.provinceName,
        province_code: '',
        province_id: form.province,

        municipality: this.selectedFieldLocation.municipalityName,
        municipality_code: '',
        municipality_id: form.municipality,

        barangay: this.selectedFieldLocation.barangayName,
        barangay_code: '',
        barangay_id: form.barangay,
      };

      fieldModel.same_farmer_location = this.farmerFieldForm.controls.sameFormLocation.value;
      fieldModel.offlineFarmerId = this.farmerInfo.offlineId ? this.farmerInfo.offlineId : '';

      const duplicateErrorMessage = `The farm lot you are trying to register has identical details with already registered farm lot.
      Please review details and/or input a proper farm lot name.`;

      if (this.type == 'add') {
        if (this.isOffline) {
          fieldModel.offlineFieldId = uuidv4();
          this.farmerFieldOfflineService.addField(fieldModel)
          .then(() => {
            this.dataProcess(fieldModel);
          })
        } else {
          this.fieldService.addField(fieldModel).subscribe(async response => {
            if (response && response.success && response.data) {
              const { data } = response;
              this.dataProcess(data);
            } else {
              let alert = await this.alertController.create({
                header: `Can't add field`,
                message: duplicateErrorMessage,
                buttons: ['Ok'],
              });
              await alert.present();;
              this.clickedSubmit = false;
            }
          });
        }
      } else {
        this.fieldService.updateField(fieldModel).subscribe(async (response: any) => {
          if (response && response.success && response.data) {
            const { data } = response;
            this.dataProcess(data);
          } else {
            let alert = await this.alertController.create({
              header: `Can't update field`,
              message: duplicateErrorMessage,
              buttons: ['Ok'],
            });
            await alert.present();
            this.clickedSubmit = false;
          }
        });
      }
    } else {
      let alert = await this.alertController.create({
        header: 'Add Farm Lot',
        message: 'Kindly complete the form.',
        buttons: ['Ok'],
      });
      await alert.present();
      this.clickedSubmit = false;
    }
  }

  public dataProcess(data) {
    this.farmerFieldForm.reset();
    this.modalController.dismiss(data);
  }

  public closeModal() {
    this.modalController.dismiss();
  }

  public setFieldUnitValidation(val) {
    this.farmerFieldForm.controls['fieldSizeHa'].setValidators([]);

    if (val === 1) {
      this.farmerFieldForm.controls['fieldSizeHa'].setValidators([
        Validators.required,
        Validators.max(10),
        Validators.min(0.02),
      ]);
    } else {
      this.farmerFieldForm.controls['fieldSizeHa'].setValidators([
        Validators.required,
        Validators.max(100000),
        Validators.min(200),
      ]);
    }

    this.farmerFieldForm.controls['fieldSizeHa'].updateValueAndValidity();
  }

  public selectedFieldUnit: number;
  public onFieldUnitChange(ev: any) {
    const fieldUnitId = parseInt(ev.target.value);
    this.setFieldUnitValidation(fieldUnitId);
    this.selectedFieldUnit = fieldUnitId;

    if (fieldUnitId === 1) {
      const hectareEquivalent =
        parseFloat(this.farmerFieldForm.get('fieldSizeHa').value) / 10000;
      if (!isNaN(hectareEquivalent)) {
        this.farmerFieldForm.get('fieldSizeHa').setValue(hectareEquivalent);
      }
    } else {
      const sqmEquivalent =
        parseFloat(this.farmerFieldForm.get('fieldSizeHa').value) * 10000;
      if (!isNaN(sqmEquivalent)) {
        this.farmerFieldForm.get('fieldSizeHa').setValue(sqmEquivalent);
      }
    }
  }

  public setFieldMemOrgValidation(val) {
    this.farmerFieldForm.controls['fieldOrgName'].setValidators([]);

    if (val === 1) {
      this.farmerFieldForm.controls['fieldOrgName'].setValidators([
        Validators.required,
      ]);
    } else {
      this.farmerFieldForm.controls['fieldOrgName'].setValue(null);
    }

    this.farmerFieldForm.controls['fieldOrgName'].updateValueAndValidity();
  }

  public selectedFieldMemberOrg: number;
  public onFieldMemberOrgChange(ev: any) {
    const val = parseInt(ev.target.value);
    this.setFieldMemOrgValidation(val);
    this.selectedFieldMemberOrg = ev.target.value;
    this.farmerFieldForm.controls.sameFieldOrg.setValue(false);
  }

  public ownerNameChange(val) {
    if (val) {
      this.field_name = this.otherFName + this.otherLName+' '+this.farmerInfo.firstName.charAt(0) + this.farmerInfo.lastName;
    }

    if (this.otherFName == '' || this.otherLName == '') {
      this.field_name = '';
    }
  }

  public onOwnershipFName(event) {
    this.otherFName = event.target.value.charAt(0);
    this.ownerNameChange(this.otherLName);
  }

  public onOwnershipLName(event) {
    this.otherLName = event.target.value;
    this.ownerNameChange(this.otherFName);
  }

  public setFieldOwnValidation(val) {
    this.farmerFieldForm.controls['farmLotOwnerGivenName'].setValidators([]);
    this.farmerFieldForm.controls['farmLotOwnerSurname'].setValidators([]);
    this.farmerFieldForm.controls['farmLotOwnerNumber'].setValidators([]);

    if (val === 2 || val === 3) {
      this.farmerFieldForm.controls['farmLotOwnerGivenName'].setValidators([
        Validators.required,
        Validators.pattern("[a-zA-Z0-9 ñÑ'.-]*"),
      ]);
      this.farmerFieldForm.controls['farmLotOwnerSurname'].setValidators([
        Validators.required,
        Validators.pattern("[a-zA-Z0-9 ñÑ'.-]*"),
      ]);
      this.farmerFieldForm.controls['farmLotOwnerNumber'].setValidators([
        Validators.pattern('0{1}9[0-9]{9}|9[0-9]{9}'),
        mobileNumberLengthValidator,
        mobileNumberPrefixValidator,
      ]);
      this.field_name = '';
    } else {
      if (this.type == 'add') {
        this.field_name =
          this.farmerInfo.firstName.charAt(0) + this.farmerInfo.lastName;
      } else {
        this.field_name = this.field_name_raw;
      }
    }

    this.farmerFieldForm.controls['farmLotOwnerGivenName'].setValue(null);
    this.farmerFieldForm.controls['farmLotOwnerSurname'].setValue(null);
    this.farmerFieldForm.controls['farmLotOwnerNumber'].setValue(null);

    this.farmerFieldForm.controls[
      'farmLotOwnerGivenName'
    ].updateValueAndValidity();
    this.farmerFieldForm.controls[
      'farmLotOwnerSurname'
    ].updateValueAndValidity();
    this.farmerFieldForm.controls[
      'farmLotOwnerNumber'
    ].updateValueAndValidity();
  }

  public selectedFieldOwnership: number;
  public onFieldOwnershipChange(ev: any) {
    const val = parseInt(ev.target.value);
    this.setFieldOwnValidation(val);
    this.selectedFieldOwnership = val;
  }

  public onCancel(){
    this.modalController.dismiss();
  }
}
