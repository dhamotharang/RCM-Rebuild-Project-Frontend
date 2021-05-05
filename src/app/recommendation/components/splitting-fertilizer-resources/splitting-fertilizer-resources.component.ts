import { Language } from 'src/app/recommendation/enum/language.enum';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TimingAndFertilizerSourcesModel } from 'src/app/recommendation/model/timing-and-fertilizer-sources-model';
import { TargetYieldModel } from 'src/app/recommendation/model/target-yield.model';
import { FieldInfoRecommendationModel } from 'src/app/recommendation/model/field-info-recommendation.model';
import { Establishment } from 'src/app/recommendation/enum/establishment.enum';
import { WaterSource } from 'src/app/recommendation/enum/water-source.enum';
import { VarietyType } from 'src/app/recommendation/enum/variety-type.enum';
import { SeedlingAge } from 'src/app/recommendation/enum/seedling-age.enum';
import { RecommendationModel } from 'src/app/recommendation/model/recommendation-model';
import { EditFormModel } from 'src/app/recommendation/model/edit-form.model';
import { GrowthDuration } from 'src/app/recommendation/enum/growth-duration.enum';
import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';

@Component({
  selector: 'app-splitting-fertilizer-resources',
  templateUrl: './splitting-fertilizer-resources.component.html',
  styleUrls: ['./splitting-fertilizer-resources.component.scss'],
})
export class SplittingFertilizerResourcesComponent implements OnInit {
  @Output() formSubmit: EventEmitter<void> = new EventEmitter();
  @Output() formValid: EventEmitter<any> = new EventEmitter();
  @Output() public formEdit: EventEmitter<EditFormModel> = new EventEmitter();

  public showOutput: boolean;
  public showMOPFert: boolean;
  public fertColSize: number;
  public fertTitleColSize: number;
  public showEarlyFert = false;
  public show21DaysSeedling = false;
  public ATDaysColSize = 4;

  private _defaultSelectedLanguage: Language;
  @Input() public set defaultSelectedLanguage(language: Language) {
    this._defaultSelectedLanguage = language;
  }

  public get defaultSelectedLanguage(): Language {
    return this._defaultSelectedLanguage;
  }

  @Input() nFertilizerSourceForm: FormGroup;

  private _targetYield;
  @Input() public set targetYield(targetYield: TargetYieldModel) {
    this._targetYield = targetYield;
  }
  public get targetYield() {
    return this._targetYield;
  }

  public get seedlingAgeLabel() {
    let seedlingAgeLabel = '';
    if (this.targetYield) {
      if (
        this.targetYield.seedlingAge ===
        SeedlingAge.EARLY_SEEDLING_AGE.toString()
      ) {
        seedlingAgeLabel = 'EARLY_SEEDLING_AGE';
      } else if (
        this.targetYield.seedlingAge ===
        SeedlingAge.MIDDLE_SEEDLING_AGE.toString()
      ) {
        seedlingAgeLabel = 'MIDDLE_SEEDLING_AGE';
      } else if (
        this.targetYield.seedlingAge ===
        SeedlingAge.LATE_SEEDLING_AGE.toString()
      ) {
        seedlingAgeLabel = 'LATE_SEEDLING_AGE';
      }
    }
    return seedlingAgeLabel;
  }

  public get cropEstablishmentLabel() {
    let cropEstablishmentLabel = '';
    if (this.targetYield) {
      if (this.targetYield.establishment === Establishment.MANUAL.toString()) {
        cropEstablishmentLabel = 'MANUAL';
      } else if (
        this.targetYield.establishment === Establishment.MECHANICAL.toString()
      ) {
        cropEstablishmentLabel = 'MECHANICAL';
      } else if (
        this.targetYield.establishment === Establishment.DRY.toString()
      ) {
        cropEstablishmentLabel = 'DRY';
      } else if (
        this.targetYield.establishment === Establishment.WET.toString()
      ) {
        cropEstablishmentLabel = 'WET';
      }
    }
    return cropEstablishmentLabel;
  }

  public get showTransplanting() {
    let showTransplanting = false;
    if (this.targetYield) {
      if (
        this.targetYield.establishment === Establishment.MANUAL.toString() ||
        this.targetYield.establishment === Establishment.MECHANICAL.toString()
      ) {
        showTransplanting = true;
      }
    }
    return showTransplanting;
  }

  public get varietyTypeLabel() {
    let varietyTypeLabel = '';
    if (this.targetYield) {
      if (parseInt(this.targetYield.varietyType, 0) === VarietyType.INBRED) {
        varietyTypeLabel = 'INBRED';
      } else {
        varietyTypeLabel = 'HYBRID';
      }
    }
    return varietyTypeLabel;
  }

  public get varietyGrowthDurationLabel() {
    let varietyGrowthDurationLabel = '';

    if (this.targetYield) {
      const growthDuration = parseInt(this.targetYield.growthDuration, 0);

      if (growthDuration === GrowthDuration.EARLY_GROWTH) {
        varietyGrowthDurationLabel = 'EARLY_GROWTH_DURATION';
      } else if (growthDuration === GrowthDuration.MIDDLE_GROWTH) {
        varietyGrowthDurationLabel = 'MIDDLE_GROWTH_DURATION';
      } else {
        varietyGrowthDurationLabel = 'LATE_GROWTH_DURATION';
      }
    }
    return varietyGrowthDurationLabel;
  }

  private _farmLotInfo;
  @Input() public set farmLotInfo(farmLotInfo: FieldInfoRecommendationModel) {
    this._farmLotInfo = farmLotInfo;
  }
  public get farmLotInfo() {
    return this._farmLotInfo;
  }

  public get waterSourceLabel() {
    let waterSourceLabel = '';
    if (this.farmLotInfo) {
      if (this.farmLotInfo.waterSource === WaterSource.IRRIGATED) {
        waterSourceLabel = 'IRRIGATED';
      } else {
        waterSourceLabel = 'RAINFED';
      }
    }
    return waterSourceLabel;
  }

  public get waterPump() {
    let waterPump = '';
    if (this.farmLotInfo) {
      if (
        this.farmLotInfo.useGasolineDieselOrElectricity === YesNo.YES ||
        this.farmLotInfo.hasAccessToPump === YesNo.YES
      ) {
        waterPump = 'WITH_PUMP';
      } else {
        waterPump = 'NO_PUMP';
      }
    }
    return waterPump;
  }

  private _recommendationModel;
  @Input() public set recommendationModel(recommendationModel: RecommendationModel) {
    if (recommendationModel) {
      this._recommendationModel = recommendationModel;
      if (recommendationModel) {
        this.populateForm();
      } else {
        this._recommendationModel = null;
      }
    }
  };
  public get recommendationModel() {
    return this._recommendationModel;
  }

  @Output() calculateFertilizerInput: EventEmitter<any> = new EventEmitter();

  private _timingSplittingModel;
  @Input() public set timingSplittingModel(timingSplittingModel: TimingAndFertilizerSourcesModel) {
    if (timingSplittingModel) {
      this._timingSplittingModel = timingSplittingModel;
    }
  }
  public get timingSplittingModel() {
    return this._timingSplittingModel;
  }

  constructor() { }

  ngOnInit() {
    if (this.nFertilizerSourceForm) {
      this.nFertilizerSourceForm.addControl(
        'nSource',
        new FormControl(null, Validators.required)
      );
    } else {
      this.nFertilizerSourceForm = new FormGroup({
        nSource: new FormControl(null, Validators.required),
      });
    }
  }

  private populateForm() {
    this.nFertilizerSourceForm.controls.nSource.setValue(this.recommendationModel.timingSplitting.nSource.toString());
  }

  public onSplittingFertilizerRecommendationFormSubmit() {
    this.nFertilizerSourceForm.markAllAsTouched();
    this.formSubmit.emit();
  }

  public get nSourceControl() {
    return this.nFertilizerSourceForm.get('nSource');
  }

  public onSourceChange() {
    if (this.nFertilizerSourceForm.valid) {
      this.calculateFertilizerInput.emit(this.nFertilizerSourceForm.get('nSource').value);
    }
  }

  public get isFormDisabled() {
    return this.nFertilizerSourceForm.disabled || this.recommendationModel;
  }

  public editForm() {
    const formEditModel: EditFormModel = {
      isEditable: true,
      formGroup: this.nFertilizerSourceForm
    };

    this.formEdit.emit(formEditModel);

  }

  @Input() wasTheRecommendationSaved: boolean;
}
