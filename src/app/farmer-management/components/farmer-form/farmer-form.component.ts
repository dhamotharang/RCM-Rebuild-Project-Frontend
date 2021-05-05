import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FormMode } from 'src/app/location/enum/mode.enum';
import { AFFIRMATIVE_OPTIONS } from 'src/app/v2/core/constants/options/affirmative-options';
import { AffirmativeEnum } from 'src/app/v2/core/enums/affirmative.enum';
import { ImageCropperComponent } from 'src/app/v2/shared/components/image-cropper/image-cropper.component';
import { FARMER_GENDER_OPTIONS } from '../../constants/farmer-gender-options';
import { PHONE_OWNER_OPTIONS } from '../../constants/phone-owner-options';
import { PhoneOwner } from '../../enums/phone-owner.enum';
import { FarmerModel } from '../../models/farmer.model';
import { AlertNotificationService } from 'src/app/v2/core/services/alert-notification.service';
import { LocationFormModel } from 'src/app/location/models/location-form.model';
import { FarmerType } from 'src/app/farmer-management/enums/farmer-type.enum';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { DownloadService } from 'src/app/v2/core/services/download.service';
import { FarmerService } from 'src/app/farmer-management/services/farmer.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { ConfigurationService } from 'src/app/v2/core/services/configuration.service';
import { Role } from 'src/app/v2/core/enums/role.enum';
import { PrintFarmerIdentificationComponent } from '../../print-farmer-identification/print-farmer-identification.component';

@Component({
  selector: 'app-farmer-form',
  templateUrl: './farmer-form.component.html',
  styleUrls: ['./farmer-form.component.scss'],
})
export class FarmerFormComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private alertNotificationService: AlertNotificationService,
    private downloadService: DownloadService,
    private farmerService: FarmerService,
    private offlineStorage: OfflineStorageService,
    private configurationService: ConfigurationService
  ) {}

  private id: number;
  public address: LocationFormModel = {
    regionId: 0,
    provinceId: 0,
    municipalityId: 0,
    barangayId: 0,
  };

  disableLocationInput: boolean = false;
  farmerInfo: FarmerModel;
  offlineEnabled: boolean;
  isEditDisabled: boolean = false;

  @Input() addFarmerInfo: boolean = false;
  @Input() editFarmerInfo: boolean = false;
  @Output() viewFarmerInfoClearBtn = new EventEmitter<any>();

  @Input() adminUser: boolean;
  @Input() submitBtnLabel: string = 'Submit';

  @Input() loggedInUserGao: number;

  @Input()
  public set farmer(value: FarmerModel) {
    if (value) {
      this.farmerInfo = value;
      this.id = value.id;

      if (!this.id) {
        this.isEditDisabled = true;
      }

      this.address = value.address;
      this.farmerForm.controls.firstName.setValue(value.firstName);
      this.farmerForm.controls.middleName.setValue(value.middleName);
      this.farmerForm.controls.isMiddleNameUnknown.setValue(
        !!value.isMiddleNameUnknown
      );
      this.farmerForm.controls.lastName.setValue(value.lastName);
      this.farmerForm.controls.suffix.setValue(value.suffixName);

      const birthDate = new Date(value.birthdate).toLocaleDateString();
      this.farmerForm.controls.birthdate.setValue(birthDate);
      this.farmerForm.get('birthdate').setErrors(null);

      this.farmerForm.controls.gender.setValue(+value.gender);

      this.farmerForm.controls.primaryContactNumber.setValue(
        value.contactInfo.mobileNumber
      );
      this.farmerForm.controls.primaryContactOwner.setValue(
        +value.contactInfo.phoneOwner
      );

      this.farmerForm.controls.otherPrimaryContactOwner.setValue(value.contactInfo.otherPhoneOwner);
      this.farmerForm.controls.otherAlternativeContactOwner.setValue(value.contactInfo.alternativeOtherPhoneOwner);

      this.farmerForm.controls.alternativeContactNumber.setValue(
        value.contactInfo.alternativeMobileNumber
      );
      this.farmerForm.controls.alternativeContactOwner.setValue(
        +value.contactInfo.alternativePhoneOwner
      );

      const isFarmerRegisteredInRSBSA = +value.rsbsaId
        ? AffirmativeEnum.Yes
        : AffirmativeEnum.No;
      this.onIsFarmerAlreadyRegisteredInRsbsaChanged(isFarmerRegisteredInRSBSA);
      this.farmerForm.controls.isFarmerAlreadyRegisteredInRSBSA.setValue(
        isFarmerRegisteredInRSBSA
      );

      this.farmerForm.controls.rsbsaId.setValue(value.rsbsaId);

      // this.farmerForm.controls.dataPrivacyFile.setValue(value.dataPrivacyConsentBase64)
      // this.farmerForm.controls.farmerPhoto.setValue(value.farmerPhotoBase64);

      if (value.dataPrivacyConsentBase64) {
        this.dataPrivacyBase64String = value.dataPrivacyConsentBase64.toString();
        this.isDataPrivacyBase64StringBeingEdited = true;
      }

      if (value.farmerPhotoBase64) {
        this.farmerPhotoBase64String = value.farmerPhotoBase64.toString();
        this.isFarmerPhotoBase64StringBeingEdited = true;
      }

      this.farmerForm.controls.farmerType.setValue(value.farmerType);

      this.farmerForm.controls.farmerAssociation.setValue(value.farmerAssociation);

      if (value.farmerType) {
        if (value.farmerType.includes(FarmerType.LOCAL_FARMER_TECHNICIAN)) {
          this.farmerForm.controls.localFarmerTechnician.patchValue(true);
        }

        if (value.farmerType.includes(FarmerType.FARMER_LED_EXTENSIONIST)) {
          this.farmerForm.controls.farmerLedExtensionist.patchValue(true);
        }

        if (
          value.farmerType.includes(FarmerType.TECHNO_DEMO_FARMER_COOPERATOR)
        ) {
          this.farmerForm.controls.technoDemoFarmer.patchValue(true);
        }

        if (value.farmerType.includes(FarmerType.SEED_GROWER)) {
          this.farmerForm.controls.seedGrower.patchValue(true);
        }

        if (value.farmerType.includes(FarmerType.TYPICAL_FARMER)) {
          this.farmerForm.controls.typicalFarmer.patchValue(true);
        }

        if (value.farmerType.includes(FarmerType.OTHER_FARMER_TYPE)) {
          // this.shouldDisplayOtherFarmerType;
          this.farmerForm.controls.otherFarmerType.patchValue(true);
          this.farmerForm.controls.otherFarmerTypeName.setValue(
            value.otherFarmerTypeName
          );
        }
      }
    }
  }

  private _fieldList: FarmApiModel[];
  @Input() set farmerFieldList(value: FarmApiModel[]) {
    this._fieldList = value;
  }

  public get fieldList() {
    return this._fieldList;
  }

  @Output() formSubmit = new EventEmitter<FarmerModel>();

  @Output() viewFarmLotList = new EventEmitter<any>();
  @Output() addFarmLot = new EventEmitter<any>();

  async ngOnInit() {
    this.offlineEnabled = await this.offlineStorage.getOfflineMode();

    if ((!this.adminUser || !this.editFarmerInfo) && !this.addFarmerInfo) {
      this.farmerForm.disable();
      this.disableLocationInput = true;
      if (this.offlineEnabled) {
        this.isEditDisabled = true;
      }
    }

    if (this.editFarmerInfo && !this.addFarmerInfo) {
      this.farmerForm.controls.farmerPhoto.enable();
      this.farmerForm.controls.dataPrivacyFile.enable();
      if (!this.adminUser) {
        this.farmerForm.controls.primaryContactNumber.enable();
        this.farmerForm.controls.primaryContactOwner.enable();

        this.farmerForm.controls.alternativeContactNumber.enable();
        this.farmerForm.controls.alternativeContactOwner.enable();
      }
      if (this.adminUser) {
        this.farmerForm.enable();
        this.disableLocationInput = false;
        if (this.loggedInUserGao === Role.REGIONAL_DATA_ADMIN) {
          this.farmerForm.get('region')?.disable();
        }
      }
    }
  }

  public get birthdateFormatted() {
    return this.farmerForm.get('birthdate') &&
      this.farmerForm.get('birthdate').value
      ? new Date(this.farmerForm.get('birthdate').value).toLocaleDateString()
      : '';
  }

  private initializeForm() {
    return new FormGroup({
      firstName: new FormControl(null, [
        Validators.required,
        Validators.pattern("[a-zA-Z ñÑ'.-]*"),
      ]),
      middleName: new FormControl(null, [
        Validators.required,
        Validators.pattern("[a-zA-Z ñÑ'.-]*"),
      ]),
      isMiddleNameUnknown: new FormControl(null, []),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.pattern("[a-zA-Z ñÑ'.-]*"),
      ]),
      suffix: new FormControl(null, []),
      birthdate: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      primaryContactNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern('0{1}9{1}[0-9]{9}'),
      ]),
      primaryContactOwner: new FormControl(null, [Validators.required]),
      otherPrimaryContactOwner: new FormControl(null, []),
      alternativeContactNumber: new FormControl(null, [
        Validators.pattern('0{1}9{1}[0-9]{9}'),
      ]),
      alternativeContactOwner: new FormControl(null, []),
      otherAlternativeContactOwner: new FormControl(null, []),
      specificFarmerType: new FormControl(null, []),
      isFarmerAlreadyRegisteredInRSBSA: new FormControl(null, [
        Validators.required,
      ]),
      rsbsaId: new FormControl(null, []),
      farmerType: new FormControl(null, [Validators.required]),
      farmerPhoto: new FormControl(null, []),
      dataPrivacyFile: new FormControl(null, [Validators.required]),
      // farmer types
      localFarmerTechnician: new FormControl(null, []),
      farmerLedExtensionist: new FormControl(null, []),
      technoDemoFarmer: new FormControl(null, []),
      seedGrower: new FormControl(null, []),
      typicalFarmer: new FormControl(null, []),
      otherFarmerType: new FormControl(null, []),
      farmerAssociation: new FormControl(null, []),
    });
  }

  public farmerForm = this.initializeForm();

  public get birthdateValidationMessage() {
    const birthdateControl = this.farmerForm.get('birthdate');
    if (birthdateControl.dirty && birthdateControl.errors) {
      if (birthdateControl.errors.required) {
        return 'Please specify your birth date!';
      }
    }
    return null;
  }

  public GENDER_OPTIONS = FARMER_GENDER_OPTIONS;
  public PHONE_OWNER_OPTIONS = PHONE_OWNER_OPTIONS;
  public AFFIRMATIVE_OPTIONS = AFFIRMATIVE_OPTIONS;
  public FARMER_TYPE = FarmerType;
  public addresssFormMode = FormMode.ionic;

  public onFarmerTypeChange(event) {
    const selectedFarmerType = parseInt(event.detail.value) as FarmerType;
    let selectedFarmerTypes = this.farmerForm.get('farmerType').value
      ? this.farmerForm
          .get('farmerType')
          .value.split(',')
          .map((farmerType) => parseInt(farmerType))
      : [];

    if (event.detail.checked) {
      selectedFarmerTypes.push(selectedFarmerType);
      this.farmerForm.get('otherFarmerType').patchValue(false);
      this.farmerForm.get('specificFarmerType').reset();
      this.farmerForm.get('specificFarmerType').setValidators([]);

      if (selectedFarmerTypes.length === 1) {
        this.farmerForm.get('farmerType').setValidators([Validators.required]);
        this.farmerForm.get('farmerType').updateValueAndValidity();
      }
    } else {
      const i = selectedFarmerTypes.findIndex(
        (fType) => fType === selectedFarmerType
      );
      selectedFarmerTypes.splice(i, 1);
    }

    selectedFarmerTypes = selectedFarmerTypes.filter(function (item, pos) {
      return selectedFarmerTypes.indexOf(item) === pos;
    });

    this.farmerForm
      .get('farmerType')
      .patchValue(
        selectedFarmerTypes && selectedFarmerTypes.length > 0
          ? selectedFarmerTypes.join(',')
          : null
      );

    if (!this.farmerForm.get('farmerType').touched) {
      this.farmerForm.get('farmerType').markAsTouched();
    }
  }

  public rsbsaIdFormInputVisible = false;
  public onIsFarmerAlreadyRegisteredInRsbsaChanged(value: AffirmativeEnum) {
    if (value === AffirmativeEnum.Yes) {
      this.rsbsaIdFormInputVisible = true;
      this.farmerForm.get('rsbsaId').setValidators([Validators.required]);
    } else {
      this.rsbsaIdFormInputVisible = false;
      this.farmerForm.get('rsbsaId').setValidators([]);
    }
    this.farmerForm.get('rsbsaId').updateValueAndValidity();
  }

  public onOtherFarmerTypeChange(event) {
    if (event.detail.checked) {
      this.farmerForm.get('localFarmerTechnician').patchValue(false);
      this.farmerForm.get('farmerLedExtensionist').patchValue(false);
      this.farmerForm.get('technoDemoFarmer').patchValue(false);
      this.farmerForm.get('seedGrower').patchValue(false);
      this.farmerForm.get('typicalFarmer').patchValue(false);

      this.farmerForm.get('farmerType').setValidators([]);
      this.farmerForm.get('farmerType').patchValue(null);

      this.farmerForm
        .get('specificFarmerType')
        .setValidators([Validators.required]);
    } else {
      this.farmerForm.get('specificFarmerType').setValidators([]);
      this.farmerForm.get('farmerType').setValidators([Validators.required]);
    }

    this.farmerForm.get('farmerType').updateValueAndValidity();
  }

  public otherPhoneOwnerPrimaryInputVisible = false;
  public onPrimaryContactOwnerChange(value: PhoneOwner) {
    if (value === PhoneOwner.OTHERS) {
      this.otherPhoneOwnerPrimaryInputVisible = true;
      this.farmerForm
        .get('otherPrimaryContactOwner')
        .setValidators([Validators.required]);
    } else {
      this.otherPhoneOwnerPrimaryInputVisible = false;
      this.farmerForm.get('otherPrimaryContactOwner').setValidators([]);
    }
    this.farmerForm
      .get('otherPrimaryContactOwner')
      .updateValueAndValidity();
  }

  public otherPhoneOwnerAlternativeInputVisible = false;
  public onAlternativeContactOwnerChange(value: PhoneOwner) {
    if (value === PhoneOwner.OTHERS) {
      this.otherPhoneOwnerAlternativeInputVisible = true;
      this.farmerForm
        .get('otherAlternativeContactOwner')
        .setValidators([Validators.required]);
    } else {
      this.otherPhoneOwnerAlternativeInputVisible = false;
      this.farmerForm.get('otherAlternativeContactOwner').setValidators([]);
    }
    this.farmerForm
      .get('otherAlternativeContactOwner')
      .updateValueAndValidity();
  }

  public onAlternativeContaceNumberChange(value: string) {
    this.alternativeContactOwnerControl.clearValidators();
    if (value) {
      this.alternativeContactOwnerControl.setValidators([Validators.required]);
    } else {
      this.alternativeContactOwnerControl.setValidators([]);
    }
    this.alternativeContactOwnerControl.updateValueAndValidity();
  }

  public get shouldShowSpecificOtherInput() {
    return this.farmerForm.get('otherFarmerType').value;
  }

  public get farmerPhotoControl() {
    if (this.isFarmerPhotoBase64StringBeingEdited) {
      this.farmerForm.get('farmerPhoto').setErrors(null);
      this.farmerForm.get('farmerPhoto').setValidators([]);
      return {
        errors: null,
        touched: false,
      };
    }
    return this.farmerForm.get('farmerPhoto');
  }

  public get dataPrivacyControl() {
    if (this.isDataPrivacyBase64StringBeingEdited) {
      this.farmerForm.get('dataPrivacyFile').setErrors(null);
      this.farmerForm.get('dataPrivacyFile').setValidators([]);
      return {
        errors: null,
        touched: false,
      };
    }
    return this.farmerForm.get('dataPrivacyFile');
  }

  public get alternativeContactNumberControl() {
    return this.farmerForm.get('alternativeContactNumber');
  }

  public get alternativeContactOwnerControl() {
    return this.farmerForm.get('alternativeContactOwner');
  }

  public getDefaultValidationError(formControlName: string, label?: string) {
    if (
      this.farmerForm.get(formControlName).touched &&
      this.farmerForm.get(formControlName).errors
    ) {
      if (this.farmerForm.get(formControlName).errors.required) {
        return `please enter ${label}!`;
      } else if (this.farmerForm.get(formControlName).errors.pattern) {
        return `invalid characters!`;
      } else {
        return `invalid`;
      }
    } else {
      return '';
    }
  }

  public getDefaultSelectionValidationError(
    formControlName: string,
    label?: string
  ) {
    if (
      this.farmerForm.get(formControlName).dirty &&
      this.farmerForm.get(formControlName).errors &&
      this.farmerForm.get(formControlName).errors.required
    ) {
      return `please select ${label.toLowerCase()}!`;
    } else {
      return '';
    }
  }

  public getCustomSelectionValidationError(
    formControlName: string,
    customErrorMessage: string
  ) {
    if (
      this.farmerForm.get(formControlName).dirty &&
      this.farmerForm.get(formControlName).errors &&
      this.farmerForm.get(formControlName).errors.required
    ) {
      return customErrorMessage;
    } else {
      return '';
    }
  }

  public getCustomRequiredValidationError(
    formControlName: string,
    customErrorMessage: string
  ) {
    if (
      this.farmerForm.get(formControlName).touched &&
      this.farmerForm.get(formControlName).errors &&
      this.farmerForm.get(formControlName).errors.required
    ) {
      return customErrorMessage;
    } else {
      return '';
    }
  }

  public isFarmerPhotoBase64StringBeingEdited: boolean;
  public isDataPrivacyBase64StringBeingEdited: boolean;

  public farmerPhotoBase64String: string;
  public dataPrivacyBase64String: string;

  public onFarmerPhotoFileSelected(event) {
    this.showFarmerPhotoImageCropper(event);
  }

  async showFarmerPhotoImageCropper(event) {
    const modal = await this.modalController.create({
      component: ImageCropperComponent,
      componentProps: {
        imageFile: event,
        resizeToWidth: this.configurationService.getValue(
          'avatarImageCropperToWidth'
        ),
        maintainAspectRatio: true,
        cropperTitle: 'Farmer Photo',
      },
    });

    modal.onDidDismiss().then((img) => {
      if (img.data) {
        this.farmerPhotoBase64String = img.data.toString();
        this.isFarmerPhotoBase64StringBeingEdited = false;
      }
    });
    return await modal.present();
  }

  public onDataPrivacyFileSelected(event) {
    this.showDataPrivacyImageCropper(event);
  }

  async showDataPrivacyImageCropper(event) {
    const modal = await this.modalController.create({
      component: ImageCropperComponent,
      componentProps: {
        imageFile: event,
        resizeToWidth: this.configurationService.getValue(
          'dataPrivacyImageCropperToWidth'
        ),
        cropperTitle: 'Data Privacy',
      },
    });

    modal.onDidDismiss().then((img) => {
      if (img.data) {
        this.isDataPrivacyBase64StringBeingEdited = false;
        this.dataPrivacyBase64String = img.data.toString();
      }
    });
    return await modal.present();
  }

  public submitForm() {
    this.farmerForm.markAllAsTouched();
    this.farmerForm.get('gender').markAsDirty();
    this.farmerForm.get('birthdate').markAsDirty();
    this.farmerForm.get('primaryContactOwner').markAsDirty();
    this.alternativeContactOwnerControl.markAsDirty();

    if (!this.editFarmerInfo && !this.addFarmerInfo) {
      this.formSubmit.emit();
      return;
    }
    if (this.farmerForm.valid) {
      const formRawValue = this.farmerForm.getRawValue();
      const farmerData: FarmerModel = {
        farmerId:
          this.farmerInfo && this.farmerInfo.farmerId
            ? this.farmerInfo.farmerId
            : '',
        firstName: formRawValue.firstName,
        middleName: formRawValue.middleName,
        isMiddleNameUnknown: !!formRawValue.isMiddleNameUnknown,
        lastName: formRawValue.lastName,
        gender: formRawValue.gender,
        suffixName: formRawValue.suffix,
        birthdate: formRawValue.birthdate,
        contactInfo: {
          mobileNumber: formRawValue.primaryContactNumber,
          phoneOwner: formRawValue.primaryContactOwner,
          otherPhoneOwner: formRawValue.otherPrimaryContactOwner,
          alternativeMobileNumber: formRawValue.alternativeContactNumber,
          alternativePhoneOwner: formRawValue.alternativeContactOwner,
          alternativeOtherPhoneOwner: formRawValue.otherAlternativeContactOwner,
        },
        rsbsa: formRawValue.isFarmerAlreadyRegisteredInRSBSA,
        rsbsaId: formRawValue.rsbsaId,
        farmerType: formRawValue.farmerType,
        otherFarmerType: formRawValue.otherFarmerType,
        otherFarmerTypeName: formRawValue.specificFarmerType,
        address: {
          regionId: formRawValue.region,
          provinceId: formRawValue.province,
          municipalityId: formRawValue.municipality,
          barangayId: formRawValue.barangay,
        },
        farmerPhotoBase64: this.farmerPhotoBase64String,
        dataPrivacyConsentBase64: this.dataPrivacyBase64String,
        createdDate: new Date(),
        modifiedDate: new Date(),
        farmerAssociation: formRawValue.farmerAssociation,
      };

      this.formSubmit.emit(farmerData);
    } else {
      this.alertNotificationService.showAlert(
        'Kindly check for invalid inputs',
        'Add Farmer'
      );
    }
  }

  public clearForm() {
    if (!this.addFarmerInfo && !this.editFarmerInfo) {
      this.viewFarmerInfoClearBtn.emit();
      return;
    }
    this.farmerForm.get('otherPrimaryContactOwner').setValidators([]);
    this.alternativeContactOwnerControl.setValidators([]);

    // clear file properties
    this.farmerPhotoBase64String = '';
    this.dataPrivacyBase64String = '';

    this.farmerForm.updateValueAndValidity();
    this.farmerForm.reset();

    this.farmerForm.get('farmerType').markAsUntouched();
  }

  // Validation

  public get primaryContactValidationMessage() {
    const primaryContactControl = this.farmerForm.get('primaryContactNumber');
    if (primaryContactControl.touched && primaryContactControl.errors) {
      if (primaryContactControl.errors.required) {
        return 'please enter primary contact number';
      } else if (primaryContactControl.errors.pattern) {
        return 'please use correct mobile number';
      }
    }
    return '';
  }

  public get alternativeContactValidationMessage() {
    const alternativeContactControl = this.farmerForm.get(
      'alternativeContactNumber'
    );
    if (alternativeContactControl.touched && alternativeContactControl.errors) {
      if (alternativeContactControl.errors.pattern) {
        return 'please use correct mobile number';
      }
    }
    return '';
  }

  public get minBirthdate() {
    const today = new Date();

    const dayMin = 1;
    const monthMin = 0;
    const yearMin =
      today.getFullYear() - this.configurationService.getValue('farmerMaxAge');

    return new Date(yearMin, monthMin, dayMin);
  }

  public get maxBirthdate() {
    const today = new Date();
    const dayMax = 31;
    const monthMax = 11;
    const yearMax =
      today.getFullYear() - this.configurationService.getValue('farmerMinAge');
    return new Date(yearMax, monthMax, dayMax);
  }

  public viewDataPrivacy() {
    if (this.dataPrivacyBase64String) {
      const fileName = this.id + '-data-privacy.jpeg';
      this.downloadService.downloader(this.dataPrivacyBase64String, fileName);
    } else {
      this.alertNotificationService.showAlert(
        'No Data Privacy Consent Available',
        'Data Privacy'
      );
    }
  }

  public async onPrintId() {
    const filteredFieldList =
      this.fieldList && this.fieldList.length > 0
        ? this.fieldList.filter((field) => field.is_verified === 1)
        : [];
    if (filteredFieldList.length > 0) {
      const modal = await this.modalController.create({
        component: PrintFarmerIdentificationComponent,
        componentProps: {
          farmerInfo: this.farmerService.mapModeltoApi(this.farmerInfo),
          farmerFields: filteredFieldList,
          roleId: this.loggedInUserGao,
        },
      });
      await modal.present();
    } else {
      this.alertNotificationService.showAlert(
        'No verified farm lots yet.',
        'Generate ID Card'
      );
    }
  }
  public onMiddleNameUnknownChange(event: CustomEvent) {
    if (event.detail.checked) {
      this.farmerForm.controls.middleName.setValue(null, []);
      this.farmerForm.controls.middleName.disable();
    } else {
      this.farmerForm.controls.middleName.setValidators([
        Validators.required,
        Validators.pattern("[a-zA-Z ñÑ'.-]*"),
      ]);
      this.farmerForm.controls.middleName.enable();
    }
    this.farmerForm.controls.middleName.updateValueAndValidity();
  }
}
