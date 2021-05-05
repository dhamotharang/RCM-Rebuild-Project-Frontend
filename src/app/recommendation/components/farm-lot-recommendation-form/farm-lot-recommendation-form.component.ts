import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FieldInfoRecommendationModel } from '../../model/field-info-recommendation.model';
import { WaterSource } from '../../enum/water-source.enum';
import {
  HECTARE,
  SQUARE_METER,
} from '../../constant/field-unit.constant';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { DaProject } from 'src/app/recommendation/enum/da-project.enum';
import { RecommendationModel } from 'src/app/recommendation/model/recommendation-model';
import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import {AddressPipe} from '../../../v2/shared/pipe/address.pipe';

@Component({
  selector: 'app-farm-lot-recommendation-form',
  templateUrl: './farm-lot-recommendation-form.component.html',
  styleUrls: ['./farm-lot-recommendation-form.component.scss'],
})
export class FarmLotRecommendationFormComponent implements OnInit {
  @Input() fieldInfo: FarmApiModel;
  @Input() wasTheRecommendationSaved: boolean;
  private _recommendation: RecommendationModel;
  @Input() public set recommendation(recommendation: RecommendationModel) {
    if (recommendation) {
      this._recommendation = recommendation;
      this.populateForm();
    } else {
      this._recommendation = null;
    }
  }
  public get recommendation() {
    return this._recommendation;
  }

  @Input() public viewMode: boolean;

  @Output() formSubmit: EventEmitter<void> = new EventEmitter();
  @Output() formValid: EventEmitter<
    FieldInfoRecommendationModel
  > = new EventEmitter();
  @Input() public fieldInfoRecommendationForm: FormGroup;
  @Input() hideSubmitButton: boolean;
  @Output() formUpdate = new EventEmitter<boolean>(false);

  public shouldUseFullFarmSize = true;
  public maxValueValidation = 0;
  public minValueValidation = 0;
  public fieldSizeHa = 0;

  //Da Program/Project
  public readonly RCM_LARGE_SCALE = DaProject.RCM_LARGE_SCALE;
  public readonly RICE_MODEL_FARM = DaProject.RICE_MODEL_FARM;
  public readonly INTENSIVE_HYBRIDIZATION_PROGRAM = DaProject.INTENSIVE_HYBRIDIZATION_PROGRAM;
  public readonly RCM_RESEARCH = DaProject.RCM_RESEARCH;
  public readonly OTHERS = DaProject.OTHERS;

  // season field description
  public readonly RAINFED = WaterSource.RAINFED;
  public readonly IRRIGATED = WaterSource.IRRIGATED;

  // field units
  public readonly HECTARE = HECTARE.id;
  public readonly SQUARE_METER = SQUARE_METER.id;

  //YesNoValue
  public readonly YES_VALUE = YesNo.YES;
  public readonly NO_VALUE = YesNo.NO;

  constructor(private alertService: AlertService, private addressPipe: AddressPipe) { }

  ngOnInit() {
    if (this.fieldInfoRecommendationForm) {
      this.fieldInfoRecommendationForm.addControl(
        'daProject',
        new FormControl(null, [Validators.required])
      );
      this.fieldInfoRecommendationForm.addControl(
        'specifiedDaProject',
        new FormControl(null, [])
      );
      this.fieldInfoRecommendationForm.addControl(
        'farmSize',
        new FormControl(null, [])
      );
      this.fieldInfoRecommendationForm.addControl(
        'farmSizeUnit',
        new FormControl(null, [])
      );
      this.fieldInfoRecommendationForm.addControl(
        'fieldSeasonDescription',
        new FormControl(null, [Validators.required])
      );
      this.fieldInfoRecommendationForm.addControl(
        'isUsingPumpPoweredEquipment',
        new FormControl(null, [])
      );
      this.fieldInfoRecommendationForm.addControl(
        'hasPumpSupplyAccess',
        new FormControl(null, [])
      );
    } else {
      this.fieldInfoRecommendationForm = new FormGroup({
        daProject: new FormControl(null, [Validators.required]),
        specifiedDaProject: new FormControl(null, []),
        farmSize: new FormControl(null, []),
        farmSizeUnit: new FormControl(null, []),
        fieldSeasonDescription: new FormControl(null, [Validators.required]),
        isUsingPumpPoweredEquipment: new FormControl(null, []),
        hasPumpSupplyAccess: new FormControl(null, []),
      });
    }
  }

  private populateForm() {
    const farmLot = this.recommendation.farmLot;
    this.shouldUseFullFarmSize = farmLot.isSelectedWholeFarmLotSize === YesNo.YES;
    this.fieldInfoRecommendationForm.setValue({
      'farmSizeUnit': farmLot.specifiedFarmLotSizeUnit,
      'farmSize': farmLot.specifiedFarmLotSize,
      'daProject': farmLot.daProject,
      'specifiedDaProject': farmLot.specifiedDaProject,
      'fieldSeasonDescription': farmLot.waterSource,
      'isUsingPumpPoweredEquipment': farmLot.isUsingPumpPoweredEquipment,
      'hasPumpSupplyAccess': farmLot.hasPumpSupplyAccess
    });

    if (farmLot.specifiedFarmLotSizeUnit === this.SQUARE_METER) {
      this.fieldSizeHa = farmLot.specifiedFarmLotSize / 10000;
    }

  }

  public get farmSizeUnitControl() {
    return this.fieldInfoRecommendationForm.get('farmSizeUnit');
  }

  public get farmSizeUnitSelected() {
    const unitSelected = this.fieldInfoRecommendationForm.get('farmSizeUnit').value;
    if (unitSelected === this.HECTARE) {
      return HECTARE.shortname;
    } else {
      return SQUARE_METER.shortname;
    }
  }

  public get farmSizeControl() {
    return this.fieldInfoRecommendationForm.get('farmSize');
  }

  public get irrigatedQuestionShouldShow() {
    return (
      this.fieldInfoRecommendationForm.get('fieldSeasonDescription').value ===
      this.IRRIGATED
    );
  }

  public get rainfedQuestionShouldShow() {
    return (
      this.fieldInfoRecommendationForm.get('fieldSeasonDescription').value ===
      this.RAINFED
    );
  }

  public onDaProjectChange(event: CustomEvent) {
    const daProjectFormControlValue = (event.target as HTMLIonRadioElement).value;
    const specifiedDaProject = this.fieldInfoRecommendationForm.controls.specifiedDaProject;

    if (daProjectFormControlValue === DaProject.OTHERS) {
      specifiedDaProject.setValidators(Validators.required);
    } else {
      specifiedDaProject.reset();
      specifiedDaProject.clearValidators();
    }
    specifiedDaProject.updateValueAndValidity();
    this.emitFormModel();
  }

  public onSpecifiedDaProjectChange() {
    this.emitFormModel();
  }

  public onFieldSeasonDescriptionChange(ev: CustomEvent) {
    const selectedFieldSeasonDescription = ev.detail.value;
    const hasPumpSupplyAccess = this.fieldInfoRecommendationForm.get(
      'hasPumpSupplyAccess'
    );
    const isUsingPumpPoweredEquipment = this.fieldInfoRecommendationForm.get(
      'isUsingPumpPoweredEquipment'
    );

    if (selectedFieldSeasonDescription === this.IRRIGATED) {
      hasPumpSupplyAccess.clearValidators();
      isUsingPumpPoweredEquipment.setValidators([Validators.required]);
    } else if (selectedFieldSeasonDescription === this.RAINFED) {
      isUsingPumpPoweredEquipment.clearValidators();
      hasPumpSupplyAccess.setValidators([Validators.required]);
    }
    isUsingPumpPoweredEquipment.updateValueAndValidity();
    hasPumpSupplyAccess.updateValueAndValidity();

    this.emitFormModel();
  }

  public onFieldUnitChange(ev: CustomEvent) {
    if (ev.detail.value === this.HECTARE) {
      this.maxValueValidation = this.fieldInfo.field_size_ha;
      this.minValueValidation = 0.02;
    } else if (ev.detail.value === this.SQUARE_METER) {
      this.maxValueValidation = this.fieldInfo.field_size_ha * 10000; // hectare to sqm conversion
      this.minValueValidation = 200;
    }

    const farmSize = this.fieldInfoRecommendationForm.controls.farmSize;

    farmSize.reset();
    farmSize.setValidators([
      Validators.required,
      Validators.max(this.maxValueValidation),
      Validators.min(this.minValueValidation),
    ]);

    farmSize.updateValueAndValidity();
    this.emitFormModel();
  }

  public onShouldUseFullFarmSizeChange(ev: CustomEvent) {
    this.shouldUseFullFarmSize = ev.detail.checked;

    if (!this.shouldUseFullFarmSize) {
      this.farmSizeUnitControl.setValidators(Validators.required);
      this.farmSizeControl.setValidators(Validators.required);
    } else {
      this.farmSizeControl.reset();
      this.farmSizeUnitControl.reset();
      this.farmSizeControl.clearValidators();
      this.farmSizeUnitControl.clearValidators();
    }

    this.farmSizeControl.updateValueAndValidity();
    this.farmSizeUnitControl.updateValueAndValidity();

    this.emitFormModel();
  }

  public onFieldInfoRecommendationFormSubmit() {
    this.fieldInfoRecommendationForm.markAllAsTouched();
    this.emitFormModel();
    this.formSubmit.emit();
  }

  public emitFormModel() {
    if (this.fieldInfoRecommendationForm.valid) {
      const fieldInfoRecommendation: FieldInfoRecommendationModel = {
        farmerId: this.fieldInfo.farmer_id,
        farmLotName: this.fieldInfo.field_name,
        regionId: this.fieldInfo.address ? this.fieldInfo.address.region_id : 0,
        provinceId: this.fieldInfo.address
          ? this.fieldInfo.address.province_id
          : 0,
        municipalityId: this.fieldInfo.address
          ? this.fieldInfo.address.municipality_id
          : 0,
        barangayId: this.fieldInfo.address
          ? this.fieldInfo.address.barangay_id
          : 0,
        selectedFarmSize: this.getSelectedFarmSize(),
        daProject: this.fieldInfoRecommendationForm.get('daProject').value,
        specifiedDaProject: this.getSpecifiedDaProject(),
        waterSource: this.getWaterSource(),
        useGasolineDieselOrElectricity: this.getGasolineDieselOrElectricity(),
        hasAccessToPump: this.getAccessToPump(),
        region: this.fieldInfo.address ? this.fieldInfo.address.region : '',
        province: this.fieldInfo.address ? this.fieldInfo.address.province : '',
        municipality: this.fieldInfo.address
          ? this.fieldInfo.address.municipality
          : '',
        barangay: this.fieldInfo.address ? this.fieldInfo.address.barangay : '',
        field_id: this.fieldInfo.field_id,
        isSelectedWholeFarmLotSize: this.shouldUseFullFarmSize ? this.YES_VALUE : this.NO_VALUE,
        specifiedFarmLotSizeUnit: this.fieldInfoRecommendationForm.get('farmSizeUnit').value,
        specifiedFarmLotSize: this.fieldInfoRecommendationForm.get('farmSize').value,
        farmLotAddress: this.fieldInfo.address ? this.addressPipe.transform(this.fieldInfo.address) : '',
        offlineFieldId: this.fieldInfo.offlineFieldId
      };
      this.formValid.emit(fieldInfoRecommendation);
    }
  }

  private getSpecifiedDaProject(): string | null {
    const specifiedDaProject = this.fieldInfoRecommendationForm.get('specifiedDaProject').value;
    return specifiedDaProject ? specifiedDaProject : null;
  }

  private getSelectedFarmSize() {
    let selectedFarmSize = 0;
    const farmSize = this.fieldInfoRecommendationForm.get('farmSize').value;
    const farmSizeUnit = this.fieldInfoRecommendationForm.get('farmSizeUnit')
      .value;

    if (this.shouldUseFullFarmSize) {
      selectedFarmSize = this.fieldInfo.field_size_ha;
    } else {
      if (farmSizeUnit === this.HECTARE) {
        selectedFarmSize = parseFloat(farmSize);
      } else {
        selectedFarmSize = parseFloat(farmSize) / 10000;
      }
    }

    return selectedFarmSize;
  }

  private getWaterSource() {
    const fieldSeasonDescription = this.fieldInfoRecommendationForm.get(
      'fieldSeasonDescription'
    ).value;
    let waterSource = WaterSource.RAINFED;

    if (fieldSeasonDescription === this.IRRIGATED) {
      waterSource = WaterSource.IRRIGATED;
    }

    return waterSource;
  }

  private getGasolineDieselOrElectricity() {
    const fieldSeasonDescription = this.fieldInfoRecommendationForm.get(
      'fieldSeasonDescription'
    ).value;
    const isUsingPumpPoweredEquipment = this.fieldInfoRecommendationForm.get(
      'isUsingPumpPoweredEquipment'
    ).value;
    let useGasolineDieselOrElectricity = null;

    if (fieldSeasonDescription === this.IRRIGATED) {
      useGasolineDieselOrElectricity =
        isUsingPumpPoweredEquipment;
    }

    return useGasolineDieselOrElectricity;
  }

  private getAccessToPump() {
    const fieldSeasonDescription = this.fieldInfoRecommendationForm.get(
      'fieldSeasonDescription'
    ).value;
    const hasPumpSupplyAccess = this.fieldInfoRecommendationForm.get(
      'hasPumpSupplyAccess'
    ).value;
    let accessToPump = null;

    if (fieldSeasonDescription === this.RAINFED) {
      accessToPump = hasPumpSupplyAccess;
    }
    return accessToPump;
  }

  public get isFormDisabled() {
    return this.fieldInfoRecommendationForm.disabled || this.recommendation;
  }

  public editForm() {
    this.alertService.alert(
      'Form Change',
      'Modifying this form will reset succeeding questions. Please confirm.',
      'Cancel',
      'Ok',
      this.enableAndUpdateForm.bind(this)
    );
  }

  public enableAndUpdateForm() {
    this.fieldInfoRecommendationForm.enable();
    this.formUpdate.emit(true);
  }

  public onFieldSizeChange() {
    let fSize = this.fieldInfoRecommendationForm.get('farmSize').value;
    const fUnit = this.fieldInfoRecommendationForm.get('farmSizeUnit').value;
    if (fUnit === this.SQUARE_METER) {
      fSize = fSize / 10000;
    }
    this.fieldSizeHa = fSize;

    this.emitFormModel();
  }


}
