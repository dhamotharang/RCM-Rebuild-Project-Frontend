import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TargetYieldModel } from 'src/app/recommendation/model/target-yield.model';
import { FieldInfoRecommendationModel } from 'src/app/recommendation/model/field-info-recommendation.model';
import { Month } from 'src/app/v2/core/enums/month.enum';
import { PreviousStraw } from 'src/app/recommendation/enum/previous-straw.enum';
import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';
import { OrganicFertilizerRateModel } from 'src/app/recommendation/model/organic-fertilizer-rate.model';
import { PreviousCrop } from 'src/app/recommendation/enum/previous-crop.enum';
import { ImmediateHarvestModel } from 'src/app/recommendation/model/immediate-harvest.model';
import { RecommendationModel } from 'src/app/recommendation/model/recommendation-model';
import { NPKRateOutputModel } from 'src/app/recommendation/model/npk-rate-output.model';
import { EditFormModel } from 'src/app/recommendation/model/edit-form.model';

@Component({
  selector: 'app-fertlizer-rates-recommendation-form',
  templateUrl: './fertlizer-rates-recommendation-form.component.html',
  styleUrls: ['./fertlizer-rates-recommendation-form.component.scss'],
})
export class FertlizerRatesRecommendationFormComponent implements OnInit {
  private readonly ABRA_REGION_ID = 1;
  public readonly CROP_VALUE = {
    RICE: PreviousCrop.RICE,
    CORN: PreviousCrop.CORN,
    LEGUME: PreviousCrop.LEGUME,
    VEGETABLE_OR_MELON: PreviousCrop.VEGETABLE,
    BELL_PEPPER_OR_EGGPLANT: PreviousCrop.BELL_PEPPER_OR_EGGPLANT,
    TOMATO: PreviousCrop.TOMATO,
    TOBACCO: PreviousCrop.TOBACCO,
    NO_CROP: PreviousCrop.NO_CROP,
  };

  public readonly HARVEST_TYPE = {
    MANUAL: PreviousStraw.MANUAL,
    REAPER: PreviousStraw.REAPER,
    COMBINE: PreviousStraw.COMBINE,
  };

  public readonly ANSWER = {
    YES: YesNo.YES,
    NO: YesNo.NO,
  };

  private _targetYield;
  @Input() public set targetYield(targetYield: TargetYieldModel) {
    this._targetYield = targetYield;

    if (this.riceCropGrownCount === 3) {
      this.fertilizerRatesForm.get('selectedCrop').setValue(1);
      this.shouldShowCropQuestion = false;
    } else {
      this.shouldShowCropQuestion = true;
    }
  }
  public get targetYield() {
    return this._targetYield;
  }

  private _dialect;
  @Input() public set dialectSelected(dialect: string) {
    this._dialect = dialect;
  }
  public get dialectSelected() {
    return this._dialect;
  }

  @Input() public fieldFormValue: FieldInfoRecommendationModel;
  @Input() public fertilizerRatesForm: FormGroup;

  @Output() formSubmit: EventEmitter<void> = new EventEmitter();
  @Output() formValid: EventEmitter<FormGroup> = new EventEmitter();
  @Output() public formEdit: EventEmitter<EditFormModel> = new EventEmitter();
  @Output() public numberAndWeightOfSacksAnswerChange: EventEmitter<
    ImmediateHarvestModel
  > = new EventEmitter();
  @Input() public previousFreshWeight: number;
  @Input() public previousDryWeight: number;

  @Input() public soilFertility: number;
  @Input() public organicFertilizer: OrganicFertilizerRateModel;
  @Input() public npkRateOutput: NPKRateOutputModel;

  public _recommendation: RecommendationModel;
  @Input() public set recommendationModel(recommendation: RecommendationModel) {
    this._recommendation = recommendation;
    if (recommendation) {
      this.populateForm();
    } else {
      this._recommendation = null;
    }
  }
  public get recommendationModel() {
    return this._recommendation;
  }

  public populateForm() {
    const fertilizerRatesRecommendation = this.recommendationModel
      .fertilizerRates;
    const willApplyOrganicFertilizerValue = fertilizerRatesRecommendation.willApplyOrganicFertilizer
      ? YesNo.YES
      : YesNo.NO;

    this.fertilizerRatesForm.setValue({
      selectedCrop: fertilizerRatesRecommendation.previousCrop,
      harvestType: fertilizerRatesRecommendation.harvestType,
      willApplyOrganicFertilizer: willApplyOrganicFertilizerValue,
      organicFertlizerBagCount: fertilizerRatesRecommendation.organicBags,
      organicFertlizerKgPerBag: fertilizerRatesRecommendation.organicWeight,
      numberAndWeightOfSacksGroup: {
        immediateHarvestSackCount:
          fertilizerRatesRecommendation.previousYieldSacks,
        immediateHarvestKgPerSack:
          fertilizerRatesRecommendation.previousYieldKg,
      },
    });
    this.previousFreshWeight =
      fertilizerRatesRecommendation.previousYieldConversion;
    this.numberOfFertilizerBagsPerHectare =
      fertilizerRatesRecommendation.organicFertilizerRate;
    this.npkRateOutput.totalNRate = fertilizerRatesRecommendation.totalNRate;
    this.npkRateOutput.totalPRate = fertilizerRatesRecommendation.totalPRate;
    this.npkRateOutput.totalKRate = fertilizerRatesRecommendation.totalKRate;
    this.npkRateOutput.showNPKRate = true;
  }

  constructor() {}

  public noOfSacksControl: FormControl;
  public weightOfSackControl: FormControl;

  ngOnInit() {
    this.noOfSacksControl = new FormControl('', []);
    this.weightOfSackControl = new FormControl('', []);

    const numberAndWeightOfSacksGroup = new FormGroup({
      immediateHarvestSackCount: this.noOfSacksControl,
      immediateHarvestKgPerSack: this.weightOfSackControl,
    });

    if (this.fertilizerRatesForm) {
      this.fertilizerRatesForm.addControl(
        'selectedCrop',
        new FormControl(null, Validators.required)
      );
      this.fertilizerRatesForm.addControl('harvestType', new FormControl(null));
      this.fertilizerRatesForm.addControl(
        'numberAndWeightOfSacksGroup',
        numberAndWeightOfSacksGroup
      );
      this.fertilizerRatesForm.addControl(
        'willApplyOrganicFertilizer',
        new FormControl(null, Validators.required)
      );
      this.fertilizerRatesForm.addControl(
        'organicFertlizerBagCount',
        new FormControl(null)
      );
      this.fertilizerRatesForm.addControl(
        'organicFertlizerKgPerBag',
        new FormControl(null)
      );
    } else {
      this.fertilizerRatesForm = new FormGroup({
        selectedCrop: new FormControl(null, [Validators.required]),
        harvestType: new FormControl(null, []),
        numberAndWeightOfSacksGroup: numberAndWeightOfSacksGroup,
        willApplyOrganicFertilizer: new FormControl(null, [
          Validators.required,
        ]),
        organicFertlizerBagCount: new FormControl(null, []),
        organicFertlizerKgPerBag: new FormControl(null, []),
      });
    }
  }

  public shouldShowCropQuestion: boolean = true;
  public get shouldShowBellPepperOption() {
    return (
      this.riceCropGrownCount === 1 &&
      this.sowingMonthIsBetweenMarchToAugust &&
      this.fieldIsInAbra
    );
  }

  public get shouldShowTomatoOption() {
    return (
      this.riceCropGrownCount === 1 &&
      this.sowingMonthIsBetweenMarchToAugust &&
      this.fieldIsInAbra
    );
  }

  public get shouldShowTobaccoOption() {
    return (
      this.riceCropGrownCount === 1 &&
      this.sowingMonthIsBetweenMarchToAugust &&
      this.fieldIsInAbra
    );
  }

  public get sowingMonthIsBetweenMarchToAugust() {
    const sowingDateMonthId = (this.targetYield.sowingDate.getMonth() +
      1) as Month;
    return (
      this.targetYield &&
      (sowingDateMonthId === Month.MARCH ||
        sowingDateMonthId === Month.APRIL ||
        sowingDateMonthId === Month.MAY ||
        sowingDateMonthId === Month.JUNE ||
        sowingDateMonthId === Month.JULY ||
        sowingDateMonthId === Month.AUGUST)
    );
  }

  public get fieldIsInAbra() {
    return (
      this.fieldFormValue &&
      this.fieldFormValue.regionId === this.ABRA_REGION_ID
    );
  }

  public get riceCropGrownCount() {
    if (this.targetYield) {
      return parseInt(this.targetYield.timesPlantInAYear);
    } else {
      return 0;
    }
  }

  public get previousCropIsRice() {
    return (
      parseInt(this.fertilizerRatesForm.get('selectedCrop').value) ===
      this.CROP_VALUE.RICE
    );
  }

  public get shouldShowFertlizerQuantityField() {
    return (
      this.fertilizerRatesForm.get('willApplyOrganicFertilizer').value ===
      this.ANSWER.YES
    );
  }

  public get waterPump() {
    let waterPump = '';
    if (this.fieldFormValue) {
      if (
        this.fieldFormValue.useGasolineDieselOrElectricity === YesNo.YES ||
        this.fieldFormValue.hasAccessToPump === YesNo.YES
      ) {
        waterPump = 'WITH_PUMP';
      } else {
        waterPump = 'NO_PUMP';
      }
    }
    return waterPump;
  }

  public numberOfFertilizerBagsPerHectare: number;

  public getNumberOfFertlizerBagsPerHectare() {
    this.numberOfFertilizerBagsPerHectare = 0;

    if (
      this.fertilizerRatesForm.get('organicFertlizerBagCount').value &&
      this.fertilizerRatesForm.get('organicFertlizerKgPerBag').value
    ) {
      this.numberOfFertilizerBagsPerHectare = Math.round(
        this.fertilizerRatesForm.get('organicFertlizerBagCount').value /
          this.fieldFormValue.selectedFarmSize
      );
    }
  }

  public onSelectedCropChange(ev: CustomEvent) {
    const numberAndWeightOfSacksGroup = this.fertilizerRatesForm.controls
      .numberAndWeightOfSacksGroup;

    if (ev.detail.value === this.CROP_VALUE.RICE) {
      this.fertilizerRatesForm
        .get('harvestType')
        .setValidators([Validators.required]);

      numberAndWeightOfSacksGroup
        .get('immediateHarvestSackCount')
        .setValidators([Validators.required, Validators.min(1)]);

      numberAndWeightOfSacksGroup
        .get('immediateHarvestKgPerSack')
        .setValidators([
          Validators.required,
          Validators.min(25),
          Validators.max(85),
        ]);
    } else {
      this.fertilizerRatesForm.get('harvestType').reset();
      this.fertilizerRatesForm.get('harvestType').clearValidators();
      numberAndWeightOfSacksGroup.reset();
      numberAndWeightOfSacksGroup.clearValidators();
      numberAndWeightOfSacksGroup
        .get('immediateHarvestSackCount')
        .clearValidators();
      numberAndWeightOfSacksGroup
        .get('immediateHarvestKgPerSack')
        .clearValidators();
      numberAndWeightOfSacksGroup
        .get('immediateHarvestSackCount')
        .setErrors(null);
      numberAndWeightOfSacksGroup
        .get('immediateHarvestKgPerSack')
        .setErrors(null);
      this.previousFreshWeight = 0;
      this.previousDryWeight = 0;
    }

    this.fertilizerRatesForm.controls['harvestType'].updateValueAndValidity();
    numberAndWeightOfSacksGroup
      .get('immediateHarvestSackCount')
      .updateValueAndValidity();
    numberAndWeightOfSacksGroup
      .get('immediateHarvestKgPerSack')
      .updateValueAndValidity();
    numberAndWeightOfSacksGroup.updateValueAndValidity();

    this.emitFormModel();
  }

  public onHarvestTypeChange(ev: CustomEvent) {
    this.emitFormModel();
  }

  public onWillApplyOrganicFertilizerAnswerChange(ev: CustomEvent) {
    if (ev.detail.value === this.ANSWER.YES) {
      const maxFertilizerBagsPerHectare =
        this.fieldFormValue.selectedFarmSize * 50;
      const minFertilizerBagsPerHectare = 1;
      this.fertilizerRatesForm
        .get('organicFertlizerBagCount')
        .setValidators([
          Validators.required,
          Validators.min(minFertilizerBagsPerHectare),
          Validators.max(maxFertilizerBagsPerHectare),
        ]);

      const minFertlizerKgPerBag = 10;
      const maxFertlizerKgPerBag = 70;
      this.fertilizerRatesForm
        .get('organicFertlizerKgPerBag')
        .setValidators([
          Validators.required,
          Validators.min(minFertlizerKgPerBag),
          Validators.max(maxFertlizerKgPerBag),
        ]);
    } else {
      this.fertilizerRatesForm
        .get('organicFertlizerBagCount')
        .clearValidators();
      this.fertilizerRatesForm.get('organicFertlizerBagCount').reset();
      this.fertilizerRatesForm
        .get('organicFertlizerKgPerBag')
        .clearValidators();
      this.fertilizerRatesForm.get('organicFertlizerKgPerBag').reset();
    }

    this.numberOfFertilizerBagsPerHectare = 0;

    this.fertilizerRatesForm.controls[
      'organicFertlizerBagCount'
    ].updateValueAndValidity();
    this.fertilizerRatesForm.controls[
      'organicFertlizerKgPerBag'
    ].updateValueAndValidity();

    this.emitFormModel();
  }

  public onOrganicFertlizerBagCountAnswerChange(ev: CustomEvent) {
    this.getNumberOfFertlizerBagsPerHectare();
    this.emitFormModel();
  }

  public onOrganicFertlizerKgPerBagAnswerChange(ev: CustomEvent) {
    this.getNumberOfFertlizerBagsPerHectare();
    this.emitFormModel();
  }

  public onNumberAndWeightOfSacksAnswerChange(ev: CustomEvent) {
    const numberAndWeightOfSacksGroup = this.fertilizerRatesForm.value
      .numberAndWeightOfSacksGroup;
    const immediateHarvestSackCount =
      numberAndWeightOfSacksGroup.immediateHarvestSackCount;
    const immediateHarvestKgPerSack =
      numberAndWeightOfSacksGroup.immediateHarvestKgPerSack;

    const immediateHarvestModel: ImmediateHarvestModel = {
      immediateHarvestSackCount: immediateHarvestSackCount,
      immediateHarvestKgPerSack: immediateHarvestKgPerSack,
      fieldSizeInHectare: this.fieldFormValue.selectedFarmSize,
    };
    this.numberAndWeightOfSacksAnswerChange.emit(immediateHarvestModel);

    this.emitFormModel();
  }

  public onFormSubmit() {
    this.fertilizerRatesForm.markAllAsTouched();
    this.emitFormModel();
    this.formSubmit.emit();
  }

  public emitFormModel() {
    if (this.fertilizerRatesForm.valid && !this.recommendationModel) {
      this.formValid.emit(this.fertilizerRatesForm);
    } else {
      if (this.fertilizerRatesForm.enabled) {
        this.npkRateOutput.showNPKRate = false;
      }
    }
  }

  public get isFormDisabled() {
    return this.fertilizerRatesForm.disabled || this.recommendationModel;
  }

  public editForm() {
    const formEditModel: EditFormModel = {
      isEditable: true,
      formGroup: this.fertilizerRatesForm,
    };

    this.formEdit.emit(formEditModel);
  }

  @Input() wasTheRecommendationSaved: boolean;
}
