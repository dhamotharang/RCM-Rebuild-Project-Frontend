import { EditFormModel } from 'src/app/recommendation/model/edit-form.model';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  TRANSPLANTING,
  SOWING,
  EMERGENCE,
} from 'src/app/recommendation/constant/establisment-label.constant';
import { Establishment } from 'src/app/recommendation/enum/establishment.enum';
import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';
import { ZincObservation } from 'src/app/recommendation/enum/zinc-observation.enum';
import { WeedControl } from 'src/app/recommendation/enum/weed-control.enum';
import { OtherCropManagementModel } from 'src/app/recommendation/model/other-crop-management.model';
import { TargetYieldModel } from 'src/app/recommendation/model/target-yield.model';
import { FertlizerRatesFormOutputModel } from 'src/app/recommendation/model/fertlizer-rates-form-output.model';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { FieldInfoRecommendationModel } from 'src/app/recommendation/model/field-info-recommendation.model';
import { TimingAndFertilizerSourcesModel } from 'src/app/recommendation/model/timing-and-fertilizer-sources-model';
import { RiceCropPerYear } from 'src/app/recommendation/enum/rice-crop-per-year.enum';
import { format, add, sub } from 'date-fns';
import { PreviousCrop } from 'src/app/recommendation/enum/previous-crop.enum';
import { CheckboxValidatorService } from 'src/app/core/services/checkbox-validator.service';
import { RecommendationModel } from 'src/app/recommendation/model/recommendation-model';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from 'src/app/recommendation/components/image-modal/image-modal.component';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';

@Component({
  selector: 'app-other-crop-management',
  templateUrl: './other-crop-management.component.html',
  styleUrls: ['./other-crop-management.component.scss'],
})
export class OtherCropManagementComponent implements OnInit {
  @Input() otherCropManagementForm: FormGroup;
  @Output() formUpdate = new EventEmitter<boolean>(false);
  @Output() public formEdit: EventEmitter<EditFormModel> = new EventEmitter();

  @Input() farmerNameDisplay: string;
  private _fieldInfoRecommendation;
  @Input() public set fieldInfoRecommendation(fieldInfoRecommendation: FieldInfoRecommendationModel) {
    this._fieldInfoRecommendation = fieldInfoRecommendation;

  }
  public get fieldInfoRecommendation() {
    return this._fieldInfoRecommendation;
  }

  private _targetYield;
  @Input() public set targetYield(targetYield: TargetYieldModel) {
    this._targetYield = targetYield;
  }
  public get targetYield() {
    return this._targetYield;
  }

  private _fertilizerRates;
  @Input() public set fertilizerRates(
    fertilizerRates: FertlizerRatesFormOutputModel
  ) {
    this._fertilizerRates = fertilizerRates;
  }
  public get fertilizerRates() {
    return this._fertilizerRates;
  }

  private _fertilizerRecommendationModel;
  @Input() public set fertilizerRecommendationModel(
    fertilizerRecommendationModel: TimingAndFertilizerSourcesModel
  ) {
    this._fertilizerRecommendationModel = fertilizerRecommendationModel;
  }
  public get fertilizerRecommendationModel() {
    return this._fertilizerRecommendationModel;
  }

  @Output() formSubmit: EventEmitter<void> = new EventEmitter();
  @Output() formValid: EventEmitter<
    OtherCropManagementModel
  > = new EventEmitter();
  public otherCropManagementModel: OtherCropManagementModel;

  private _recommendation;
  @Input() public set recommendationModel(recommendation: RecommendationModel) {
    this._recommendation = recommendation;
    if (recommendation) {
      this.setRecommendation();
    } else {
      this._recommendation = null;
    }
  }

  public get recommendationModel() {
    return this._recommendation;
  }

  public otherCropManagementImages = {
    lettuce: "/assets/other-crop-management/water_lettuce.png",
    oilyFilm: "/assets/other-crop-management/oily_film.jpg",
    zincDeficiency: "/assets/other-crop-management/zinc_def.jpg"
  };

  public setRecommendation() {
    if (this.otherCropManagementForm && this.recommendationModel) {

      const otherCropManagementRecommendation = this.recommendationModel.otherCropManagement;
      const weedControlFormGroup = otherCropManagementRecommendation.weedControl;
      const fieldObservationFormGroup = otherCropManagementRecommendation.zincObservation;

      this.otherCropManagementForm.patchValue({
        applyInsecticide: otherCropManagementRecommendation.applyInsecticide,
        synchronizing: otherCropManagementRecommendation.synchronizing,
        weedControlGroup: {
          preEmergence: weedControlFormGroup.includes(WeedControl.PRE_EMERGENCE),
          postEmergence: weedControlFormGroup.includes(WeedControl.POST_EMERGENCE),
          handWeeding: weedControlFormGroup.includes(WeedControl.HAND_WEEDING),
          waterManagement: weedControlFormGroup.includes(WeedControl.WATER_MANAGEMENT)
        },

      });

      if (fieldObservationFormGroup) {
        this.otherCropManagementForm.patchValue({
          fieldObservationGroup: {
            profuseGrowth: fieldObservationFormGroup.includes(ZincObservation.PROFUSE_GROWTH),
            oilyFilm: fieldObservationFormGroup.includes(ZincObservation.OILY_FILM),
            standingWater: fieldObservationFormGroup.includes(ZincObservation.STANDING_WATER),
            dustyBrownSpots: fieldObservationFormGroup.includes(ZincObservation.BROWN_SPOTS),
            noFieldObservation: fieldObservationFormGroup.includes(ZincObservation.NO_OBSERVATION)
          }
        });
      }
    }
  }

  constructor(
    private alertService: AlertService,
    private checkboxValidatorService: CheckboxValidatorService,
    private modalController: ModalController
  ) {
  }

  private _farmerInfo: FarmerApiModel;
  public setFarmerInfo(value: FarmerApiModel) {
    if (value) {
      this._farmerInfo = value;
    }
  }

  public get farmerInfo(): FarmerApiModel {
    return this._farmerInfo;
  }

  public yesNoValue = YesNo;
  public minimumCheckedRequired = 1;
  public showQuestionSynchronizing = false;
  public showQuestionWeedControl = true;
  public showQuestionWeedControlError = false;
  public showQuestionFieldObservationError = false;
  public qualitySeedsLowerLimit: number;
  public qualitySeedsUpperLimit: number;

  preEmergenceFC: FormControl;
  postEmergenceFC: FormControl;
  handWeedingFC: FormControl;
  waterManagementFC: FormControl;
  profuseGrowthFC: FormControl;
  oilyFilmFC: FormControl;
  standingWaterFC: FormControl;
  dustyBrownSpotsFC: FormControl;
  noFieldObservationFC: FormControl;

  public isCropEstablishmentTransplanting: boolean;
  public isCropEstablishmentSowing: boolean;
  public isCropEstablishmentEmergence:boolean;

  ngOnInit() {
    this.preEmergenceFC = new FormControl(false);
    this.postEmergenceFC = new FormControl(false);
    this.handWeedingFC = new FormControl(false);
    this.waterManagementFC = new FormControl(false);

    this.profuseGrowthFC = new FormControl(false);
    this.oilyFilmFC = new FormControl(false);
    this.standingWaterFC = new FormControl(false);
    this.dustyBrownSpotsFC = new FormControl(false);
    this.noFieldObservationFC = new FormControl(false);

    const weedControlFG = new FormGroup({
      preEmergence: this.preEmergenceFC,
      postEmergence: this.postEmergenceFC,
      handWeeding: this.handWeedingFC,
      waterManagement: this.waterManagementFC,
    }, this.checkboxValidatorService.checkBoxValidator(this.minimumCheckedRequired));

    const fieldObservationFG = new FormGroup({
      profuseGrowth: this.profuseGrowthFC,
      oilyFilm: this.oilyFilmFC,
      standingWater: this.standingWaterFC,
      dustyBrownSpots: this.dustyBrownSpotsFC,
      noFieldObservation: this.noFieldObservationFC,
    });

    if (this.otherCropManagementForm) {
      this.otherCropManagementForm.addControl(
        'applyInsecticide',
        new FormControl(null)
      );
      this.otherCropManagementForm.addControl(
        'synchronizing',
        new FormControl(null)
      );
      this.otherCropManagementForm.addControl(
        'weedControlGroup',
        weedControlFG
      );
      this.otherCropManagementForm.addControl(
        'fieldObservationGroup',
        fieldObservationFG
      );
    } else {
      this.otherCropManagementForm = new FormGroup({
        applyInsecticide: new FormControl(null),
        synchronizing: new FormControl(null),
        weedControlGroup: weedControlFG,
        fieldObservationGroup: fieldObservationFG
      });
    }
  }

  ngOnChanges() {
    if(this.targetYield){
      this.isCropEstablishmentTransplanting = (this.targetYield.establishment === Establishment.MANUAL.toString() || this.targetYield.establishment === Establishment.MECHANICAL.toString())
      this.isCropEstablishmentSowing = (this.targetYield.establishment === Establishment.WET.toString());
      this.isCropEstablishmentEmergence = (this.targetYield.establishment === Establishment.DRY.toString());

    }
  }

  public get cropEstablishmentQuestionLabel() {
    let cropEstablishmentLabel = '';
    if (this.targetYield) {
      if (
        this.targetYield.establishment === Establishment.MANUAL.toString() ||
        this.targetYield.establishment === Establishment.MECHANICAL.toString()
      ) {
        cropEstablishmentLabel = TRANSPLANTING;
      } else if (
        this.targetYield.establishment === Establishment.WET.toString()
      ) {
        cropEstablishmentLabel = SOWING;
      } else if (
        this.targetYield.establishment === Establishment.DRY.toString()
      ) {
        cropEstablishmentLabel = EMERGENCE;
      }
    }
    return cropEstablishmentLabel;
  }
  public get sowingMonth(): string {
    let sowingMonth = '';

    if (this.targetYield) {
      sowingMonth = format(this.targetYield.sowingDate, 'MMMM');
    }
    return sowingMonth;
  }

  public get oneMonthBeforeSowing() {
    let oneMonthBeforeSowingFormatted = '';
    if (this.targetYield) {
      const oneMonthBeforeSowing = sub(this.targetYield.sowingDate, {
        months: 1
      });
      oneMonthBeforeSowingFormatted = format(oneMonthBeforeSowing, 'MMMM');
    }
    return oneMonthBeforeSowingFormatted;
  }

  public get oneMonthAfterSowing() {
    let oneMonthAfterSowingFormatted = '';
    if (this.targetYield) {
      const oneMonthAfterSowing = add(this.targetYield.sowingDate, {
        months: 1
      });
      oneMonthAfterSowingFormatted = format(oneMonthAfterSowing, 'MMMM');
    }
    return oneMonthAfterSowingFormatted;
  }

  public get synchronizingQuestionLabel() {
    let synchronizingQuestionLabel = '';
    if (this.targetYield) {
      if (
        this.targetYield.establishment === Establishment.MANUAL.toString() ||
        this.targetYield.establishment === Establishment.MECHANICAL.toString()
      ) {
        synchronizingQuestionLabel = TRANSPLANTING;
      } else {
        synchronizingQuestionLabel = SOWING;
      }
    }
    return synchronizingQuestionLabel;
  }

  public get showQuestionFieldObservation() {
    let showQuestion = false;
    const fieldObservationGroupControl = this.otherCropManagementForm.controls.fieldObservationGroup;

    if (this.targetYield) {
      const isTransplanted =
        this.targetYield.establishment === Establishment.MANUAL.toString() ||
        this.targetYield.establishment === Establishment.MECHANICAL.toString();
      const cropsPerYear = parseInt(this.targetYield.timesPlantInAYear, 10);
      const isNumberOfCropsOneTwo =
        cropsPerYear === RiceCropPerYear.ONE ||
        cropsPerYear === RiceCropPerYear.TWO;

      if (isTransplanted && isNumberOfCropsOneTwo) {
        showQuestion = true;
        fieldObservationGroupControl.setValidators(this.checkboxValidatorService.checkBoxValidator(this.minimumCheckedRequired));
      } else {
        fieldObservationGroupControl.clearValidators();
      }
    }

    fieldObservationGroupControl.updateValueAndValidity();

    return showQuestion;
  }

  public get showQuestionApplyInsecticide() {
    let showQuestion = false;
    const applyInsecticideControl = this.otherCropManagementForm.controls.applyInsecticide;
    const synchronizingControl = this.otherCropManagementForm.controls.synchronizing;

    if (this.fertilizerRates) {
      const previousCrop =
        this.fertilizerRates.previousCrop !== PreviousCrop.VEGETABLE &&
        this.fertilizerRates.previousCrop !== PreviousCrop.BELL_PEPPER_OR_EGGPLANT &&
        this.fertilizerRates.previousCrop !== PreviousCrop.TOMATO;

      if (previousCrop) {
        showQuestion = true;
        applyInsecticideControl.setValidators(Validators.required);
      } else {
        applyInsecticideControl.clearValidators();
        synchronizingControl.clearValidators();
      }
    } else {
      applyInsecticideControl.clearValidators();
      synchronizingControl.clearValidators();
    }

    applyInsecticideControl.updateValueAndValidity();
    synchronizingControl.updateValueAndValidity();

    return showQuestion;
  }

  public onApplyInsecticideChange(event) {
    const synchronizing = this.otherCropManagementForm.controls.synchronizing;

    if (event.target.value === YesNo.YES) {
      this.showQuestionSynchronizing = true;
      synchronizing.setValidators(Validators.required);
    } else {
      synchronizing.reset();
      synchronizing.clearValidators();
      synchronizing.updateValueAndValidity();
      this.showQuestionSynchronizing = false;
    }

    this.emitFormModel();
  }

  public onNoFieldObservationChange(event) {
    if (event.detail.checked) {
      this.profuseGrowthFC.patchValue(false);
      this.oilyFilmFC.patchValue(false);
      this.standingWaterFC.patchValue(false);
      this.dustyBrownSpotsFC.patchValue(false);
    }
    this.emitFormModel();
  }

  public onFieldObservationChange(event) {
    if (event.detail.checked) {
      this.noFieldObservationFC.patchValue(false);
    }
    this.emitFormModel();
  }

  public onOtherCropManagementSubmit() {
    this.otherCropManagementForm.markAllAsTouched();
    // TODO check this line, causing error
    // this.downloadAsPDF.docDefinition();
    this.emitFormModel();
    this.formSubmit.emit();
  }

  public emitFormModel() {
    if (this.otherCropManagementForm.valid && this.targetYield) {
      this.otherCropManagementModel = this.createOtherCropManagementModel();
      this.formValid.emit(this.otherCropManagementModel);
    }
  }

  private createOtherCropManagementModel() {
    const formValue = this.otherCropManagementForm.value;
    const otherCropManagementModel: OtherCropManagementModel = {
      applyInsecticide: formValue.applyInsecticide,
      synchronizing: formValue.synchronizing,

      preEmergence: formValue.weedControlGroup.preEmergence
        ? YesNo.YES
        : YesNo.NO,
      postEmergence: formValue.weedControlGroup.postEmergence
        ? YesNo.YES
        : YesNo.NO,
      handWeeding: formValue.weedControlGroup.handWeeding
        ? YesNo.YES
        : YesNo.NO,
      waterManagement: formValue.weedControlGroup.waterManagement
        ? YesNo.YES
        : YesNo.NO,

      profuseGrowth: formValue.fieldObservationGroup.profuseGrowth
        ? YesNo.YES
        : YesNo.NO,
      oilyFilm: formValue.fieldObservationGroup.oilyFilm
        ? YesNo.YES
        : YesNo.NO,
      standingWater: formValue.fieldObservationGroup.standingWater
        ? YesNo.YES
        : YesNo.NO,
      dustyBrownSpots: formValue.fieldObservationGroup.dustyBrownSpots
        ? YesNo.YES
        : YesNo.NO,
      noFieldObservation: formValue.fieldObservationGroup.noFieldObservation
        ? YesNo.YES
        : YesNo.NO,

      zincObservation: this.createZincObservationArr(),
      weedControl: this.createWeedControlArr(),
    };
    return otherCropManagementModel;
  }

  private createZincObservationArr() {
    const zincObservation = [];
    const formValue = this.otherCropManagementForm.value;
    if (formValue.fieldObservationGroup.profuseGrowth) {
      zincObservation.push(ZincObservation.PROFUSE_GROWTH);
    }
    if (formValue.fieldObservationGroup.oilyFilm) {
      zincObservation.push(ZincObservation.OILY_FILM);
    }
    if (formValue.fieldObservationGroup.standingWater) {
      zincObservation.push(ZincObservation.STANDING_WATER);
    }
    if (formValue.fieldObservationGroup.dustyBrownSpots) {
      zincObservation.push(ZincObservation.BROWN_SPOTS);
    }
    if (formValue.fieldObservationGroup.noFieldObservation) {
      zincObservation.push(ZincObservation.NO_OBSERVATION);
    }

    return zincObservation;
  }

  private createWeedControlArr() {
    const weedControl = [];
    const formValue = this.otherCropManagementForm.value;
    if (formValue.weedControlGroup.preEmergence) {
      weedControl.push(WeedControl.PRE_EMERGENCE);
    }
    if (formValue.weedControlGroup.postEmergence) {
      weedControl.push(WeedControl.POST_EMERGENCE);
    }
    if (formValue.weedControlGroup.handWeeding) {
      weedControl.push(WeedControl.HAND_WEEDING);
    }
    if (formValue.weedControlGroup.waterManagement) {
      weedControl.push(WeedControl.WATER_MANAGEMENT);
    }

    return weedControl;
  }

  public get isFormDisabled() {
    return this.otherCropManagementForm.disabled || this.recommendationModel;
  }

  public editForm() {
    const formEditModel: EditFormModel = {
      isEditable: true,
      formGroup: this.otherCropManagementForm,
    };

    this.formEdit.emit(formEditModel);
  }
  
  public enableAndUpdateForm() {
    this.otherCropManagementForm.enable();
    this.formUpdate.emit(true);
  }

  @Input() wasTheRecommendationSaved: boolean;

  public async showImageInModal(imagePath: string, elementLabelReference: any) {
    console.log(imagePath, elementLabelReference);
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        "image": {
          description: elementLabelReference.el.textContent,
          path: imagePath
        }
      }
    });

    return await modal.present();
  }
}
