import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { formatDate } from '@angular/common';

import { ModalController } from '@ionic/angular';

import { ImageCropperComponent } from 'src/app/v2/shared/components/image-cropper/image-cropper.component';

import { PhoneOwnerModel } from '../../../core/models/phone-owner.model';
import { validation } from '../../../core/constants/validation.constant';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { getAlertMessage } from '../../../core/helpers/alert-message-helper';
import { getEditAccess } from '../../../core/helpers/check-user-access-helper';

import { AlertService } from './../../../core/services/alert/alert.service';
import { FarmerService } from 'src/app/core/services/farmer.service';
import { FarmerType } from 'src/app/farmer-management/enums/farmer-type.enum';
import { CheckboxValidatorService } from 'src/app/core/services/checkbox-validator.service';
import { isMobileNumberPrefixValid, isMobileNumberLengthValid } from "src/app/v2/helpers/form-validator-custom.helper";
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { PhoneOwner } from 'src/app/farmer-management/enums/phone-owner.enum';

@Component({
  selector: 'app-farmer-form',
  templateUrl: './farmer-form.component.html',
  styleUrls: ['./farmer-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FarmerFormComponent implements OnInit {
  private maxYear = validation.maxYear;
  private minYear = validation.minYear;
  private file: any;
  private id: number;

  public selectedPhoto = '';
  public dataPrivacyImg = '';
  public farmerInfo: FarmerApiModel;
  public phoneOwner: PhoneOwnerModel[];
  public invalidForm: boolean;
  public adminUser: boolean;
  public disabled = false;
  public minDate: string;
  public maxDate: string;
  public rsbsaVal = false;


  public selectedPhoneOwner: any;
  public selectedAltPhoneOwner: any;

  public minimumCheckedRequired = 1;

  public localFarmerTechnician = new FormControl(false);
  public farmerLedExtensionist = new FormControl(false);
  public technoDemoFarmer = new FormControl(false);
  public seedGrower = new FormControl(false);
  public typicalFarmer = new FormControl(false);
  public otherFarmerType = new FormControl(false);

  @Output()
  public formSubmit = new EventEmitter<FarmerApiModel>();
  public isFormSubmitted = false;
  public isClicked = false;

  @Output() public onFormCancel = new EventEmitter<any>();

  public readonly FARMER_TYPE_VALUE = {
    LOCAL_FARMER_TECHNICIAN: FarmerType.LOCAL_FARMER_TECHNICIAN,
    FARMER_LED_EXTENSIONIST: FarmerType.FARMER_LED_EXTENSIONIST,
    TECHNO_DEMO_FARMER_COOPERATOR: FarmerType.TECHNO_DEMO_FARMER_COOPERATOR,
    SEED_GROWER: FarmerType.SEED_GROWER,
    TYPICAL_FARMER: FarmerType.TYPICAL_FARMER,
    OTHER_FARMER_TYPE: FarmerType.OTHER_FARMER_TYPE
  };

  public farmerTypeFormGroup = new FormGroup({
    localFarmerTechnician: this.localFarmerTechnician,
    farmerLedExtensionist: this.farmerLedExtensionist,
    technoDemoFarmer: this.technoDemoFarmer,
    seedGrower: this.seedGrower,
    typicalFarmer: this.typicalFarmer,
    otherFarmerType: this.otherFarmerType
  }, this.checkboxValidatorService.checkBoxValidator(this.minimumCheckedRequired));

  public addFarmerForm = new FormGroup({
    photo: new FormControl(null),
    dataPrivacy: new FormControl(null),
    firstName: new FormControl(null, [Validators.required, Validators.pattern("[a-zA-Z ñÑ'.-]*")]),
    middleName: new FormControl(null, [Validators.required, Validators.pattern("[a-zA-Z ñÑ'.-]*")]),
    lastName: new FormControl(null, [Validators.required, Validators.pattern("[a-zA-Z ñÑ'.-]*")]),
    suffix: new FormControl(null),
    birthDate: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, Validators.required),
    primaryMobileNo: new FormControl(null, [
      Validators.required,
      Validators.pattern('0{1}9[0-9]{9}|9[0-9]{9}'),
      mobileNumberLengthValidator,
      mobileNumberPrefixValidator
    ]),
    primaryPhoneOwner: new FormControl(null, Validators.required),
    otherPhoneOwnerName: new FormControl(null),
    alternativeMobileNo: new FormControl(null),
    alternativePhoneOwner: new FormControl(null),
    altOtherPhoneOwnerName: new FormControl(null),
    farmersAssociation: new FormControl(null),
    rsbsa: new FormControl(null, Validators.required),
    rsbsaRefId: new FormControl(null),
    farmerTypeFormGroup: this.farmerTypeFormGroup,
    otherFarmerTypeName: new FormControl(null, Validators.required)
  });
  @Input() public submitLabel = 'Submit';

  private _farmerInfo: FarmerApiModel;
  public get farmer(): FarmerApiModel {
    return this._farmerInfo;
  }

  @Input()
  public set farmer(value: FarmerApiModel) {
    if (value) {
      this.id = value.id;
      this.addFarmerForm.controls.firstName.setValue(value.first_name);
      this.addFarmerForm.controls.middleName.setValue(value.middle_name);
      this.addFarmerForm.controls.lastName.setValue(value.last_name);
      this.addFarmerForm.controls.suffix.setValue(value.suffix_name);
      this.addFarmerForm.controls.birthDate.setValue(value.birth_date);
      this.addFarmerForm.controls.gender.setValue(value.sex);
      this.addFarmerForm.controls.rsbsa.setValue(value.rsbsa);

      if (value.rsbsa != null && value.rsbsa.toString() === '1') {
        this.rsbsaVal = true;
        this.addFarmerForm.controls.rsbsaRefId.setValue(value.rsbsa_id);
      }

      if (value.contact_info) {
        if (value.contact_info.phone_owner == '0') {
          value.contact_info.phone_owner = PhoneOwner.SELF;
        }

        this.addFarmerForm.controls.primaryMobileNo.setValue(
          value.contact_info.mobile_number
        );
        this.addFarmerForm.controls.primaryPhoneOwner.setValue(
          value.contact_info.phone_owner.toString()
        );

        this.selectedPhoneOwner = value.contact_info.phone_owner;

        if (this.selectedPhoneOwner === 6) {
          this.addFarmerForm.controls.otherPhoneOwnerName.enable();
          this.addFarmerForm.controls.otherPhoneOwnerName.setValue(
            value.contact_info.other_phone_owner
          );
          this.addFarmerForm.controls.otherPhoneOwnerName.setValidators([
            Validators.required,
          ]);
        }

        this.addFarmerForm.controls.alternativeMobileNo.setValue(
          value.contact_info.alternative_mobile_number
        );

        let altPhoneOwner: any;
        if (value.contact_info.alternative_phone_owner === null) {
          altPhoneOwner = value.contact_info.alternative_phone_owner;
        } else {
          altPhoneOwner = value.contact_info.alternative_phone_owner.toString();
        }

        this.addFarmerForm.controls.alternativePhoneOwner.setValue(
          altPhoneOwner
        );

        this.selectedAltPhoneOwner = altPhoneOwner;

        if (this.selectedAltPhoneOwner == 6) {
          this.addFarmerForm.controls.altOtherPhoneOwnerName.enable();
          this.addFarmerForm.controls.altOtherPhoneOwnerName.setValue(
            value.contact_info.alt_other_phone_owner
          );
          this.addFarmerForm.controls.altOtherPhoneOwnerName.setValidators([
            Validators.required,
          ]);
        }

        this.addFarmerForm.controls.primaryMobileNo.enable();
        this.addFarmerForm.controls.primaryPhoneOwner.enable();
        this.addFarmerForm.controls.alternativeMobileNo.enable();
        this.addFarmerForm.controls.alternativePhoneOwner.enable();
        this.addFarmerForm.controls.photo.enable();
        this.addFarmerForm.controls.dataPrivacy.enable();
      }

      this.addFarmerForm.controls.farmersAssociation.setValue(
        value.farmer_association
      );
      this.addFarmerForm.controls.farmersAssociation.enable();
      this.selectedPhoto = value.photo;
      this.dataPrivacyImg = value.data_privacy_consent;

      if (value.farmer_type.includes(FarmerType.LOCAL_FARMER_TECHNICIAN.toString())) {
        this.localFarmerTechnician.patchValue(true);
      }

      if (value.farmer_type.includes(FarmerType.FARMER_LED_EXTENSIONIST.toString())) {
        this.farmerLedExtensionist.patchValue(true);
      }

      if (value.farmer_type.includes(FarmerType.TECHNO_DEMO_FARMER_COOPERATOR.toString())) {
        this.technoDemoFarmer.patchValue(true);
      }

      if (value.farmer_type.includes(FarmerType.SEED_GROWER.toString())) {
        this.seedGrower.patchValue(true);
      }

      if (value.farmer_type.includes(FarmerType.TYPICAL_FARMER.toString())) {
        this.typicalFarmer.patchValue(true);
      }
      
      if (value.farmer_type === FarmerType.OTHER_FARMER_TYPE.toString()) {
        this.shouldDisplayOtherFarmerType;
        this.otherFarmerType.patchValue(true);
        this.addFarmerForm.controls.otherFarmerTypeName.setValue(value.other_farmer_type);
      }
    }

    this._farmerInfo = value;
  }

  public onAlternativeMobileNoChange(ev: any) {
    const mobileNumberLength = ev.target.value.length;
    const isMobileNumberLengthValid = mobileNumberLength == 10 || mobileNumberLength == 11;
    
    const alternativeMobileNo = this.addFarmerForm.controls.alternativeMobileNo;
    const alternativePhoneOwner = this.addFarmerForm.controls.alternativePhoneOwner;
    const altOtherPhoneOwnerName = this.addFarmerForm.controls.altOtherPhoneOwnerName;
    
    if (isMobileNumberLengthValid) {
      alternativePhoneOwner.setValidators([
        Validators.required
      ]);
    } else {
      if (mobileNumberLength == 0) {
        alternativeMobileNo.setValidators([]);
        alternativePhoneOwner.setValidators([]);
        altOtherPhoneOwnerName.setValidators([]);
        alternativePhoneOwner.setValue(null);
        altOtherPhoneOwnerName.setValue(null);  
      } else {
        alternativeMobileNo.setValidators([
          Validators.required,
          Validators.pattern('0{1}9[0-9]{9}|9[0-9]{9}'),
          mobileNumberLengthValidator,
          mobileNumberPrefixValidator
        ]);
      }
    }

    alternativeMobileNo.updateValueAndValidity();
    alternativePhoneOwner.updateValueAndValidity();
  }

  public onRSBSAChange(ev: any) {
    const val = parseInt(ev.target.value, 10);

    if (val === 1) {
      this.addFarmerForm.controls.rsbsaRefId.setValidators([
        Validators.required,
      ]);
      this.rsbsaVal = true;
    } else {
      this.addFarmerForm.controls.rsbsaRefId.clearValidators();
      this.addFarmerForm.controls.rsbsaRefId.setValue(null);
      this.rsbsaVal = false;
    }
  }

  public constructor(
    private modalController: ModalController,
    private authService: AuthenticationService,
    private farmerService: FarmerService,
    public alertService: AlertService,
    public checkboxValidatorService: CheckboxValidatorService
  ) {}

  public ngOnInit() {
    const gao = this.authService.loggedInUser.gao;
    this.adminUser = getEditAccess(gao);

    if (this.edit) {
      this.addFarmerForm.disable();
      this.addFarmerForm.controls.primaryMobileNo.enable();
      this.addFarmerForm.controls.primaryPhoneOwner.enable();
      this.addFarmerForm.controls.otherPhoneOwnerName.enable();
      this.addFarmerForm.controls.alternativeMobileNo.enable();
      this.addFarmerForm.controls.alternativePhoneOwner.enable();
      this.addFarmerForm.controls.altOtherPhoneOwnerName.enable();
      this.addFarmerForm.controls.photo.enable();
      this.addFarmerForm.controls.farmerTypeFormGroup.enable();
      this.disabled = true;
    }

    if (this.adminUser) {
      this.addFarmerForm.enable();
      this.disabled = false;
    }

    this.phoneOwner = [
      {
        name: 'Self',
        key: '1',
      },
      {
        name: 'Spouse',
        key: '2',
      },
      {
        name: 'Son or daughter',
        key: '3',
      },
      {
        name: 'Other relative',
        key: '4',
      },
      {
        name: 'Neighbor',
        key: '5',
      },
      {
        name: 'Others',
        key: '6',
      },
    ];
    this.setBirthdate();
    this.farmerService.notify.subscribe((parentComponentEmit) => {
      if (parentComponentEmit.status === 'success') {
        if (!this.edit) {
          this.addFarmerForm.reset();
          this.isFormSubmitted = false;
          this.selectedPhoto = '';
          this.dataPrivacyImg = '';
        }
      }
      this.isClicked = false;
    });
  }

  public resetForm() {
    this.addFarmerForm.reset();
    this.isFormSubmitted = false;
    this.isClicked = false;
  }

  public setBirthdate() {
    const today = new Date();

    const dayMin = '01';
    const monthMin = '01';
    const dayMax = '31';
    const monthMax = '12';

    const yearMax = today.getFullYear() - this.minYear;
    const yearMin = today.getFullYear() - this.maxYear - this.minYear;

    this.minDate = yearMin + '-' + monthMin + '-' + dayMin;
    this.maxDate = yearMax + '-' + monthMax + '-' + dayMax;
  }

  public onSubmit() {
    this.isFormSubmitted = true;
    this.isClicked = true;
    this.addFarmerForm.markAllAsTouched();

    let isValidEmitOnOfFarmerModel = false;

    if (this.edit) {
      if (this.adminUser) {
        if (this.addFarmerForm.valid && !!this.dataPrivacyImg) {
          isValidEmitOnOfFarmerModel = true;
        }
      } else {
        if (this.addFarmerForm.valid) {
          isValidEmitOnOfFarmerModel = true;
        }
      }
    }

    if (!this.edit) {
      if (this.addFarmerForm.valid && !!this.dataPrivacyImg) {
        isValidEmitOnOfFarmerModel = true;
      }
    }

    if (isValidEmitOnOfFarmerModel) {
      const farmer: FarmerApiModel = this.createRequestData();
      this.formSubmit.emit(farmer);
    } else {
      const msg = getAlertMessage(this.addFarmerForm);
      let modalHeaderText = 'Add Farmer';

      if (this.edit) {
        modalHeaderText = 'Edit Farmer'
      }
      
      this.alertService.alert(modalHeaderText, msg, 'Okay', '', '');

      this.isClicked = false;
    }
  }

  private createRequestData() {
    const form = this.addFarmerForm.getRawValue();
    const farmer: FarmerApiModel = {
      id: this.id,
      farmer_id: '',
      first_name: form.firstName.toLowerCase(),
      last_name: form.lastName.toLowerCase(),
      middle_name: !!form.middleName
        ? form.middleName.toLowerCase()
        : form.middleName,
      is_middle_name_unknown: form.isMiddleNameUnknown,
      suffix_name: form.suffix,
      sex: form.gender,
      rsbsa: form.rsbsa,
      rsbsa_id: form.rsbsaRefId,
      farmer_type: this.farmerTypeData,
      other_farmer_type: form.otherFarmerTypeName,
      birth_date: formatDate(form.birthDate, 'yyyy-MM-dd', 'en-US'),
      address: {
        region: '',
        region_code: '',
        region_id: form.region,

        province: '',
        province_code: '',
        province_id: form.province,

        municipality: '',
        municipality_code: '',
        municipality_id: form.municipality,

        barangay: '',
        barangay_code: '',
        barangay_id: form.barangay ? form.barangay : 0,
      },
      photo: this.selectedPhoto,
      data_privacy_consent: this.dataPrivacyImg,
      farmer_association: !!form.farmersAssociation
        ? form.farmersAssociation.toLowerCase()
        : form.farmersAssociation,
      contact_info: {
        mobile_number: form.primaryMobileNo,
        phone_owner: form.primaryPhoneOwner,
        other_phone_owner: form.otherPhoneOwnerName,
        alternative_mobile_number: form.alternativeMobileNo,
        alternative_phone_owner: form.alternativePhoneOwner,
        alt_other_phone_owner: form.altOtherPhoneOwnerName,
      },
      created_at: new Date(),
      updated_at: new Date(),
      status: 0,
      fields: []
    };

    return farmer;
  }

  public onPhoneOwnerChange(ev: any) {
    const val = parseInt(ev.source.value, 10);
    this.selectedPhoneOwner = val;
    this.otherNameInput(val, 'otherPhoneOwnerName');
  }

  public onAltPhoneOwnerChange(ev: any) {
    const val = parseInt(ev.source.value, 10);
    this.selectedAltPhoneOwner = val;
    this.otherNameInput(val, 'altOtherPhoneOwnerName');
  }

  public otherNameInput(val: number, formElement: string) {
    if (val === 6) {
      this.addFarmerForm.controls[formElement].setValidators([
        Validators.required,
      ]);
      this.addFarmerForm.controls[formElement].enable();
    } else {
      this.addFarmerForm.controls[formElement].setValidators([]);
      this.addFarmerForm.controls[formElement].setValue(null);
    }

    this.addFarmerForm.controls[formElement].updateValueAndValidity();
  }

  public onFileSelected(event) {
    this.file = (event.target as HTMLInputElement).files[0];
    const fileSizeInMb = this.file.size / 1024 / 1024;

    if (fileSizeInMb > 2) {
      this.alertService.alert(
        'Profile picture',
        'File too big! Max file size is 2 MB',
        'Okay',
        '',
        ''
      );
    } else {
      this.imageModal(event, true);
    }
  }

  public onDataPrivacySelected(event) {
    this.file = (event.target as HTMLInputElement).files[0];
    const fileSizeInMb = this.file.size / 1024 / 1024;

    if (fileSizeInMb > 2) {
      this.alertService.alert(
        'Data Privacy',
        'File too big! Max file size is 2 MB',
        'Okay',
        '',
        ''
      );
    } else {
      this.imageModal(event, false);
    }
  }

  forbiddenBirthDate(max: number, min: number): ValidatorFn {
    return (
      control: FormControl
    ): {
      [s: string]: boolean;
    } => {
      if (control.value != null) {
        const currentYear = new Date().getFullYear();
        const formattedDate =
          control.value.getMonth() +
          1 +
          '-' +
          control.value.getDate() +
          '-' +
          control.value.getFullYear();

        const farmerBirthDate = formattedDate;
        const farmerBirthYear = farmerBirthDate.substr(0, 4);
        const farmerAge = currentYear - +farmerBirthYear;

        if (farmerAge < min || farmerAge > max) {
          return { forbiddenBirthDate: true };
        }
      }
    };
  }

  

  onClear() {
    this.alertService.alert(
      'Clear Farmer Form',
      'Are you sure?',
      'Cancel',
      'Okay',
      this.resetFarmerFormHelper.bind(this)
    );
  }

  public resetFarmerFormHelper() {
    this.addFarmerForm.reset();
    this.selectedPhoto = '';
    this.dataPrivacyImg = '';
    this.isFormSubmitted = false;
  }

  async imageModal(event, isFarmerPhoto) {
    const modal = await this.modalController.create({
      component: ImageCropperComponent,
      componentProps: {
        imageFile: event,
        isFarmerPhoto,
      },
    });

    modal.onDidDismiss().then((img) => {
      if (img.data) {
        if (isFarmerPhoto) {
          this.selectedPhoto = img.data.toString();
        } else {
          this.dataPrivacyImg = img.data.toString();
        }
      }
    });
    return await modal.present();
  }

  public get showPrivacyConsentErrorMessage() {
    if (!this.edit || this.adminUser) {
      return (
        this.addFarmerForm.get('dataPrivacy').touched && !this.dataPrivacyImg
      );
    } else {
      return false;
    }
  }

  public get edit(): boolean {
    if (this.farmer) {
      return this.farmer.id !== null;
    }
    return false;
  }

  public onOtherFarmerTypeChange(event) {
    if (event.detail.checked) {
      this.localFarmerTechnician.patchValue(false);
      this.farmerLedExtensionist.patchValue(false);
      this.technoDemoFarmer.patchValue(false);
      this.seedGrower.patchValue(false);
      this.typicalFarmer.patchValue(false);
    }

    this.shouldDisplayOtherFarmerType;
  }

  public onFarmerTypeChange(event) {
    if (event.detail.checked) {
      this.otherFarmerType.patchValue(false);
    }

    this.shouldDisplayOtherFarmerType;
  }

  public get shouldDisplayOtherFarmerType() {
    const formValue = this.addFarmerForm.value.farmerTypeFormGroup;
    let shouldDisplayOtherFarmerTypeQuestion = false;

    if (formValue.otherFarmerType) {
      this.addFarmerForm.controls.otherFarmerTypeName.setValidators([Validators.required]);
      shouldDisplayOtherFarmerTypeQuestion = true;
    } else {
      this.addFarmerForm.controls.otherFarmerTypeName.clearValidators();
      this.addFarmerForm.controls.otherFarmerTypeName.setValue(null);
    }
    this.addFarmerForm.controls.otherFarmerTypeName.updateValueAndValidity();

    return shouldDisplayOtherFarmerTypeQuestion;
  }

  public get farmerTypeData(): string {
    const farmerType = [];
    const formValue = this.addFarmerForm.value.farmerTypeFormGroup;
    if (formValue.localFarmerTechnician) {
      farmerType.push(FarmerType.LOCAL_FARMER_TECHNICIAN);
    }
    if (formValue.farmerLedExtensionist) {
      farmerType.push(FarmerType.FARMER_LED_EXTENSIONIST);
    }
    if (formValue.technoDemoFarmer) {
      farmerType.push(FarmerType.TECHNO_DEMO_FARMER_COOPERATOR);
    }
    if (formValue.seedGrower) {
      farmerType.push(FarmerType.SEED_GROWER);
    }
    if (formValue.typicalFarmer) {
      farmerType.push(FarmerType.TYPICAL_FARMER);
    }
    if (formValue.otherFarmerType) {
      farmerType.push(FarmerType.OTHER_FARMER_TYPE);
    }

    const farmerTypeValue = farmerType.join(", "); 
    
    return farmerTypeValue;
  }
}

function mobileNumberPrefixValidator(control: AbstractControl): { [key: string]: boolean } | null {
  
  return isMobileNumberPrefixValid(control.value);
}

function mobileNumberLengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    
  return isMobileNumberLengthValid(control.value);
}
