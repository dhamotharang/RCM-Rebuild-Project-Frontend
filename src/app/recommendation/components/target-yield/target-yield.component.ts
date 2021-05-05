import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  Validators,
  ValidatorFn,
  AbstractControl,
  FormGroup,
  FormControl,
  ValidationErrors,
} from '@angular/forms';

import { MatSelect, MatSelectChange } from '@angular/material/select';

import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VarietyType } from 'src/app/recommendation/enum/variety-type.enum';
import { VarietyModel } from 'src/app/recommendation/model/variety.model';
import { Establishment } from 'src/app/recommendation/enum/establishment.enum';
import { IMunicipality } from 'src/app/recommendation/interface/municipality.interface';
import { TargetYieldModel } from 'src/app/recommendation/model/target-yield.model';
import { FieldInfoRecommendationModel } from 'src/app/recommendation/model/field-info-recommendation.model';
import {
  EARLY_SEEDLING_AGE,
  MIDDLE_SEEDLING_AGE,
  LATE_SEEDLING_AGE,
} from 'src/app/recommendation/constant/seedling-age.constant';
import {
  MAX_ALLOWABLE_SEEDRATE,
  MIN_ALLOWABLE_SEEDRATE,
} from 'src/app/recommendation/constant/target-yield.constant';
import { add, sub, isAfter, isEqual } from 'date-fns';
import { RecommendationModel } from 'src/app/recommendation/model/recommendation-model';
import { RiceCropPerYear } from 'src/app/recommendation/enum/rice-crop-per-year.enum';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Season } from 'src/app/recommendation/enum/season.enum';
import { FarmerYieldModel } from 'src/app/recommendation/model/farmer-yield-model';
import { EditFormModel } from 'src/app/recommendation/model/edit-form.model';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { Language } from 'src/app/recommendation/enum/language.enum';

@Component({
  selector: 'app-target-yield',
  templateUrl: './target-yield.component.html',
  styleUrls: ['./target-yield.component.scss'],
})
export class TargetYieldComponent implements OnInit, OnDestroy {
  @Output() formSubmit: EventEmitter<void> = new EventEmitter();
  @Output() formValid: EventEmitter<FormGroup> = new EventEmitter();
  @Output() formEdit = new EventEmitter<EditFormModel>(false);

  @Input() public targetYieldForm: FormGroup;
  @Input() public fieldInfoRecommendationForm: FormGroup;

  private _defaultSelectedLanguage: Language;
  @Input() public set defaultSelectedLanguage(language: Language) {
    this._defaultSelectedLanguage = language;
  }

  public get defaultSelectedLanguage(): Language {
    return this._defaultSelectedLanguage;
  }
  
  private _targetYieldModel: TargetYieldModel;
  @Input() public set targetYieldModel(targetYieldModel: TargetYieldModel) {
    if(targetYieldModel) {
      this._targetYieldModel = targetYieldModel;
    } else {
      this._targetYieldModel = targetYieldModel;
    }
  }

  public get targetYieldModel(): TargetYieldModel {
    return this._targetYieldModel;
  }

  private _recommendation: RecommendationModel;
  @Input() public set recommendation(recommendation: RecommendationModel) {
    if(recommendation) {
      this._recommendation = recommendation; 
      this.populateForm();
    } else {
      this._recommendation = null;
    }
  }
  public get recommendation() {
    return this._recommendation;
  }

  @Input() fieldInfo: FarmApiModel;
  public reportedYield = 0;
  public maxReportedYield = 0;
  public farmerNormalYield = 0;
  public waterSource = 0;
  public isFormSubmitted = false;
  public minSowingDate;
  public maxSowingDate;

  public previousYield = 0;

  private _fieldInfoRecommendation: FieldInfoRecommendationModel;
  @Input() public set fieldInfoRecommendationFormValue(
    value: FieldInfoRecommendationModel
  ) {
    if (!!value) {
      if(!this.recommendation) {
        this.targetYieldForm.reset();
      }
      this.seedRate = 0;
      this.reportedYield = 0;
      this.maxReportedYield = 0;
      this.farmerNormalYield = 0;
      this.waterSource = value.waterSource;
    } else {
      this.waterSource = 0;
    }
    this._fieldInfoRecommendation = value;
  }

  public get fieldInfoRecommendationFormValue(): FieldInfoRecommendationModel {
    return this._fieldInfoRecommendation;
  }

  private establishmentCurrentValue = 0;

  public dryWeight: number;
  public freshWeight: number;
  public minSacks: number;
  public potentialYieldOutput: number;

  public readonly EARLY_SEEDLING_AGE = EARLY_SEEDLING_AGE.toString();
  public readonly MIDDLE_SEEDLING_AGE = MIDDLE_SEEDLING_AGE.toString();
  public readonly LATE_SEEDLING_AGE = LATE_SEEDLING_AGE.toString();
  public readonly RICE_CROP_PER_YEAR = {
    ONE: RiceCropPerYear.ONE.toString(),
    TWO: RiceCropPerYear.TWO.toString(),
    THREE: RiceCropPerYear.THREE.toString()
  };

  public readonly CROP_ESTABLISHMENT = {
    MANUAL: Establishment.MANUAL.toString(),
    MECHANICAL: Establishment.MECHANICAL.toString(),
    WET: Establishment.WET.toString(),
    DRY: Establishment.DRY.toString()
  };

  municipality: IMunicipality;

  private _varieties: VarietyModel[];
  @Input() public set varieties(varieties: VarietyModel[]) {
    if(varieties) {
      this._varieties = varieties;
      this.filteredVariety.next(varieties);
    } else {
      this._varieties = null;
    }
  }

  public get varieties(): VarietyModel[] {
    return this._varieties;
  }

  
  @Input() public estimatedHarvestMonth: string;
  @Input() public seedRate: number;
  @Input() public season: Season;

  private _farmerYield: FarmerYieldModel;
  @Input() public set farmerYield(farmerYield: FarmerYieldModel) {
    this._farmerYield = farmerYield;
    if(farmerYield) {
      this.maxReportedYield = farmerYield.maxReported.freshWeight;
      this.reportedYield = farmerYield.normal.freshWeight;
      this.farmerNormalYield = farmerYield.normal.dryWeight;
    }
  }
  public get farmerYield() {
    return this._farmerYield;
  }

  @Output() cropEstablishmentSelected = new EventEmitter<Establishment>();
  @Output() sowingDateSelected = new EventEmitter<Date>();
  @Output() varietyNameSelected = new EventEmitter<number>();
  @Output() growthDurationSelected = new EventEmitter<number>();
  @Output() seedRateKgChanged = new EventEmitter<number>();
  @Output() noOfSacksAndWeightOfSackChanged = new EventEmitter<void>();

  constructor() {
    this.maxSowingDate = this.computeMaxSowingDate();
    this.minSowingDate = this.computeMinSowingDate();
    this.varietyNameFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterVarieties();
      });
  }

  public varietyNameFilterCtrl: FormControl = new FormControl();
  public filteredVariety: ReplaySubject<VarietyModel[]> = new ReplaySubject<
    VarietyModel[]
  >(1);
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  public noOfSacksControl: FormControl;
  public weightOfSackControl: FormControl;

  ngOnInit() {

    this.noOfSacksControl = new FormControl('', []);
    this.weightOfSackControl = new FormControl('', []);

    const numberAndWeightOfSacksGroup = new FormGroup({
      noOfSacks: this.noOfSacksControl,
      weightOfSack: this.weightOfSackControl
    });

    if (this.targetYieldForm) {
      this.targetYieldForm.addControl(
        'timesPlantInAYear',
        new FormControl('', [Validators.required])
      );
      this.targetYieldForm.addControl(
        'establishment',
        new FormControl('', [Validators.required])
      );
      this.targetYieldForm.addControl('sowingDate', new FormControl('', []));
      this.targetYieldForm.addControl('seedlingAge', new FormControl('', []));
      this.targetYieldForm.addControl('varietyType', new FormControl('', []));
      this.targetYieldForm.addControl(
        'specifiedVariety',
        new FormControl('', [])
      );
      this.targetYieldForm.addControl('varietyName', new FormControl('', []));
      this.targetYieldForm.addControl(
        'growthDuration',
        new FormControl('', [])
      );
      this.targetYieldForm.addControl('kilogram', new FormControl('', []));
      this.targetYieldForm.addControl(
        'numberAndWeightOfSacksGroup', 
        numberAndWeightOfSacksGroup
      );
      this.targetYieldForm.addControl(
        'previousVariety',
        new FormControl('', [])
      );
      this.targetYieldForm.addControl(
        'upcomingSeasonSeedSource',
        new FormControl('', [])
      );
      this.targetYieldForm.addControl('seedSource', new FormControl('', []));
      this.targetYieldForm.addControl(
        'recentYearsFarmLotDescription',
        new FormControl('', [])
      );
    } else {
      this.targetYieldForm = new FormGroup({
        timesPlantInAYear: new FormControl('', [Validators.required]),
        establishment: new FormControl('', [Validators.required]),
        sowingDate: new FormControl('', []),
        seedlingAge: new FormControl('', []),
        varietyType: new FormControl('', []),
        specifiedVariety: new FormControl('', []),
        varietyName: new FormControl('', []),
        growthDuration: new FormControl('', []),
        kilogram: new FormControl('', []),
        numberAndWeightOfSacksGroup: numberAndWeightOfSacksGroup,
        previousVariety: new FormControl('', []),
        upcomingSeasonSeedSource: new FormControl('', []),
        seedSource: new FormControl('', []),
        recentYearsFarmLotDescription: new FormControl('', []),
      });
    }
  }

  private populateForm(): void {
    
    const targetYield = this.recommendation.setTargetYield;

    this.targetYieldForm.setValue({
      'establishment': targetYield.cropEstablishment ? targetYield.cropEstablishment.toString() : null,
      'growthDuration': targetYield.growthDuration ? targetYield.growthDuration.toString() : null,
      'kilogram': targetYield.seedRate ? targetYield.seedRate : null,
      'numberAndWeightOfSacksGroup': {noOfSacks: targetYield.typicalYieldSacks ? targetYield.typicalYieldSacks : null, weightOfSack: targetYield.typicalYieldKg ? targetYield.typicalYieldKg : null},
      'previousVariety': targetYield.previousVarietyType ? targetYield.previousVarietyType.toString() : null,
      'recentYearsFarmLotDescription': targetYield.water ? targetYield.water.toString() : null,
      'seedSource': targetYield.previousSeedSource ? targetYield.previousSeedSource.toString() : null,
      'seedlingAge': targetYield.seedlingAge ? targetYield.seedlingAge.toString() : null,
      'sowingDate': new Date(targetYield.sowingDate) ? new Date(targetYield.sowingDate): null,
      'specifiedVariety': targetYield.varietyName ? targetYield.varietyName : null,
      'timesPlantInAYear': targetYield.cropsPerYear ? targetYield.cropsPerYear.toString() : null,
      'upcomingSeasonSeedSource': targetYield.upcomingSeedSource ? targetYield.upcomingSeedSource.toString() : null,
      'varietyName': targetYield.varietyId ? targetYield.varietyId : null,
      'varietyType': targetYield.varietyType ? targetYield.varietyType.toString() : null
    }); 
  }

  protected filterVarieties() {
    if (!this.varieties) {
      return;
    }
    // get the search keyword
    let search = this.varietyNameFilterCtrl.value;
    if (!search) {
      this.filteredVariety.next(this.varieties);
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the variety
    this.filteredVariety.next(
      this.varieties.filter((v) => v.label.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public get getFarmLotName() {
    return this.fieldInfo && this.fieldInfo.field_name
      ? this.fieldInfo.field_name
      : '';
  }

  public get getFieldSizeHectare() {
    return this.fieldInfoRecommendationFormValue
      ? this.fieldInfoRecommendationFormValue.selectedFarmSize
      : 0;
  }

  public selectEstablishment(event: CustomEvent) {
    /*  
    Dependent to Establishment
    -Sowing Date

    Dependent to Sowing Date
    -Variety Type
    
    Dependent to Variety Type
    -Variety Name

    Dependent to Variety Name
    -Specified Variety

    Dependent to Specified Variety
    -Growth Duration
    */
    const cropEstablishmentId = parseInt((event.target as HTMLInputElement).value);
    this.cropEstablishmentSelected.emit(cropEstablishmentId);

    this.establishmentCurrentValue = parseInt((event.target as HTMLInputElement).value);
    this.resetSowingDate();
    this.setSowingDateValidation(event);

    this.resetSeedlingAge();
    this.setSeedlingAgeValidation();
    this.setSeedlingAgeDefaultValue();

    this.resetVarietyType();
    this.resetVarietyName();
    this.resetSpecifiedVariety();
    this.resetGrowthDuration();

    /* Dependent to sowing date
    6, 7, 8a, 8b, 9, 10
    */

    //question #6
    this.resetKilogram();

    //question #7
    this.resetNoAndWeightOfSacks();

    //question #8a, #8b, 9
    this.resetPreviousVariety();
    this.resetUpcomingSeasonSeedSource();
    this.resetSeedSource();

    //question #10
    this.resetRecentYearsFarmLotDescription();

    
  }

  public selectSowingDate(event: MatDatepickerInputEvent<Date>): void {
    const sowingDate = event.value;
    this.sowingDateSelected.emit(sowingDate);

    this.resetVarietyType();
    this.setVarietyTypeValidation();

    this.resetVarietyName();
    this.resetSpecifiedVariety();
    this.resetGrowthDuration();

    this.resetKilogram();
    this.setKilogramValidation();

    //question #7
    this.resetNoAndWeightOfSacks();

    //question #8a, #8b, 9
    this.resetPreviousVariety();
    this.resetUpcomingSeasonSeedSource();
    this.resetSeedSource();

    //question #10
    this.resetRecentYearsFarmLotDescription();
    this.setRecentYearsFarmLotDescriptionValidation();

    

    this.checkFormValidity()
  }

  public selectSeedlingAge() {
    this.targetYieldForm.controls.sowingDate.updateValueAndValidity();

    
    this.checkFormValidity()
  }

  @Output() public varietyTypeChanged = new EventEmitter<VarietyType>();
  public selectVarietyType(event: any) {
    this.resetVarietyName();
    this.setVarietyNameValidation(event);

    this.resetSpecifiedVariety();
    this.resetGrowthDuration();

    //question #7
    this.resetNoAndWeightOfSacks();

    //question #8a
    this.resetPreviousVariety();
    this.setPreviousVarietyValidation(event);

    //question #8b
    this.resetUpcomingSeasonSeedSource();
    this.setUpcomingSeasonValidation(event);

    //question #9
    this.resetSeedSource();

    

    const selectedVarietyType = parseInt(event.target.value);
    this.varietyTypeChanged.emit(selectedVarietyType);

    this.checkFormValidity();
  }

  public selectVarietyName(event: MatSelectChange) {
    const varietyId = event.value;
    this.varietyNameSelected.emit(varietyId);

    this.resetSeedSource();
    this.setSeedSourceValidation();

    //question #7
    this.resetNoAndWeightOfSacks();

    this.resetSpecifiedVariety();
    this.setSpecifiedVarietyValidation(event);

    this.resetGrowthDuration();
    this.setGrowthDurationValidation(event);

    

    this.checkFormValidity()
  }

  public selectGrowthDuration(event: CustomEvent) {
  
    const growthDurationId = parseInt((event.target as HTMLInputElement).value);
    this.growthDurationSelected.emit(growthDurationId);

    this.resetSeedSource();
    this.setSeedSourceValidation();

    //question #7
    this.resetNoAndWeightOfSacks();

    this.checkFormValidity();
  }

  public onSeedRateKgChanged() {
    if (this.targetYieldForm.controls.kilogram.value) {
      const seedRateKg = this.targetYieldForm.controls.kilogram.value;
      this.seedRateKgChanged.emit(seedRateKg);
    }

    
    this.checkFormValidity()
  }

  public onNoOfSacksAndWeightOfSackChange(event: any = false) {
    this.noOfSacksAndWeightOfSackChanged.emit();
    this.setSeedSourceValidation(event);

    
    this.checkFormValidity()
  }

  public getVarietyType() {
    if (this.targetYieldForm.controls.varietyType.value) {
      let varietyType = parseInt(
        this.targetYieldForm.controls.varietyType.value
      );

      if (varietyType === VarietyType.OTHER) {
        return 'Other';
      } else {
        return varietyType === VarietyType.INBRED ? 'Inbred' : 'Hybrid';
      }
    }
  }


  public get isTransplanting(): boolean {

    if (this.targetYieldForm.controls.establishment.value) {
      const establishment = +this.targetYieldForm.controls.establishment.value;

      if (
        establishment === Establishment.WET ||
        establishment === Establishment.DRY
      ) {
        return false;
      }

      if (
        establishment === Establishment.MANUAL ||
        establishment === Establishment.MECHANICAL
      ) {
        return true;
      }
    }
  }

  public get isVarietyNameNotInTheList() {
    const notInTheList = VarietyType.NOT_IN_THE_LIST;
    return this.targetYieldForm.controls.varietyName.value === notInTheList;
  }

  public get isEstablishmentManual() {
    return (
      parseInt(this.targetYieldForm.controls.establishment.value) ===
      Establishment.MANUAL
    );
  }

  public get isEstablishmentMechanical() {
    return (
      parseInt(this.targetYieldForm.controls.establishment.value) ===
      Establishment.MECHANICAL
    );
  }

  public get isEstablishmentWet() {
    return (
      parseInt(this.targetYieldForm.controls.establishment.value) ===
      Establishment.WET
    );
  }

  public get isEstablishmentDry() {
    return (
      parseInt(this.targetYieldForm.controls.establishment.value) ===
      Establishment.DRY
    );
  }

  public get isVarietyTypeInbred() {
    return (
      parseInt(this.targetYieldForm.controls.varietyType.value) ===
      VarietyType.INBRED
    );
  }

  public get isVarietyTypeHybrid() {
    return (
      parseInt(this.targetYieldForm.controls.varietyType.value) ===
      VarietyType.HYBRID
    );
  }

  public submit() {
    this.isFormSubmitted = true;
    this.applyValidation();
    this.checkFormValidity()
    this.formSubmit.emit();
  }

  public shouldDisplayTargetYieldOutput: boolean = false;
  public checkFormValidity() {
    if (this.targetYieldForm.valid && !this.recommendation) {
      this.formValid.emit(this.targetYieldForm);
      this.shouldDisplayTargetYieldOutput = true;
    } else {
      this.shouldDisplayTargetYieldOutput = false;
    }
  }

  private applyValidation() {
    this.setSowingDateValidation();
    this.setSeedlingAgeValidation();

    this.setVarietyTypeValidation();
    this.setRecentYearsFarmLotDescriptionValidation();

    this.setVarietyNameValidation();
    this.setUpcomingSeasonValidation();
    this.setSeedSourceValidation();
    this.setPreviousVarietyValidation();
    this.setKilogramValidation();
    this.setSpecifiedVarietyValidation();
    this.setGrowthDurationValidation();
  }

  /* Required answer in sowing date question
  Only when crop establishment question is answered */
  private setSowingDateValidation(event: any = false) {
    const establishment = this.targetYieldForm.controls.establishment;
    const sowingDate = this.targetYieldForm.controls.sowingDate;

    if (event) {
      const establishment = event.target.value;
      if (establishment) {
        sowingDate.setValidators([
          Validators.required,
          this.sowingDateValidator.bind(this),
          this.seedlingAgeValidator.bind(this),
        ]);
        sowingDate.updateValueAndValidity();
      }
    } else {
      if (establishment.value) {
        sowingDate.setValidators([
          Validators.required,
          this.sowingDateValidator.bind(this),
          this.seedlingAgeValidator.bind(this),
        ]);
        sowingDate.updateValueAndValidity();
      }
    }
  }

  /* Required answer in seedling age question
  Only when crop establishment is MANUAL */
  private setSeedlingAgeValidation() {
    let seedlingAge = this.targetYieldForm.controls.seedlingAge;
    if (this.establishmentCurrentValue === Establishment.MANUAL) {
      seedlingAge.setValidators(Validators.required);
      seedlingAge.updateValueAndValidity();
    }
  }

  private setVarietyTypeValidation() {
    let varietyType = this.targetYieldForm.controls.varietyType;
    let sowingDate = this.targetYieldForm.controls.sowingDate;
    if (sowingDate.value) {
      varietyType.setValidators(Validators.required);
    } else {
      varietyType.clearValidators();
    }
    varietyType.updateValueAndValidity();
  }

  private setRecentYearsFarmLotDescriptionValidation() {
    let recentYearsFarmLotDescription = this.targetYieldForm.controls
      .recentYearsFarmLotDescription;
    let sowingDate = this.targetYieldForm.controls.sowingDate;
    if (sowingDate.value) {
      recentYearsFarmLotDescription.setValidators(Validators.required);
    } else {
      recentYearsFarmLotDescription.clearValidators();
    }
    recentYearsFarmLotDescription.updateValueAndValidity();
  }

  private setVarietyNameValidation(event: any = false) {
    let varietyType = this.targetYieldForm.controls.varietyType;
    let sowingDate = this.targetYieldForm.controls.sowingDate;
    let varietyName = this.targetYieldForm.controls.varietyName;

    if (event) {
      if (event.target.value && sowingDate.value) {
        if (parseInt(event.target.value) === VarietyType.INBRED) {
          varietyName.setValidators(Validators.required);
        }

        if (parseInt(event.target.value) === VarietyType.HYBRID) {
          varietyName.setValidators(Validators.required);
        }
      } else {
        varietyName.clearValidators();
      }
    } else {
      if (varietyType.value && sowingDate.value) {
        if (parseInt(varietyType.value) === VarietyType.INBRED) {
          varietyName.setValidators(Validators.required);
        }

        if (parseInt(varietyType.value) === VarietyType.HYBRID) {
          varietyName.setValidators(Validators.required);
        }
      } else {
        varietyName.clearValidators();
      }
    }
    varietyName.updateValueAndValidity();
  }

  private setUpcomingSeasonValidation(event: any = false) {
    let varietyType = this.targetYieldForm.controls.varietyType;
    let sowingDate = this.targetYieldForm.controls.sowingDate;
    let upcomingSeasonSeedSource = this.targetYieldForm.controls
      .upcomingSeasonSeedSource;

    if (event) {
      if (event.target.value && sowingDate.value) {
        if (parseInt(event.target.value) === VarietyType.INBRED) {
          upcomingSeasonSeedSource.setValidators(Validators.required);
        }
      } else {
        upcomingSeasonSeedSource.clearValidators();
      }
    } else {
      if (varietyType.value && sowingDate.value) {
        if (parseInt(varietyType.value) === VarietyType.INBRED) {
          upcomingSeasonSeedSource.setValidators(Validators.required);
        }
      } else {
        upcomingSeasonSeedSource.clearValidators();
      }
    }
    upcomingSeasonSeedSource.updateValueAndValidity();
  }

  private setSeedSourceValidation(event: any = false) {
    let varietyType = this.targetYieldForm.controls.varietyType;
    let seedSource = this.targetYieldForm.controls.seedSource;
    let noOfSacks = this.targetYieldForm.value.numberAndWeightOfSacksGroup.noOfSacks;

    if (event) {
      if (
        varietyType.value &&
        this.estimatedHarvestMonth &&
        event.target.value
      ) {
        if (parseInt(varietyType.value) === VarietyType.INBRED) {
          seedSource.setValidators(Validators.required);
        }
      } else {
        seedSource.clearValidators();
      }
    } else {
      if (varietyType.value && this.estimatedHarvestMonth && noOfSacks) {
        if (parseInt(varietyType.value) === VarietyType.INBRED) {
          seedSource.setValidators(Validators.required);
        }
      } else {
        seedSource.clearValidators();
      }
    }

    seedSource.updateValueAndValidity();
  }

  private setPreviousVarietyValidation(event: any = false) {
    let varietyType = this.targetYieldForm.controls.varietyType;
    let sowingDate = this.targetYieldForm.controls.sowingDate;
    let previousVariety = this.targetYieldForm.controls.previousVariety;

    if (event) {
      if (event.target.value && sowingDate.value) {
        if (parseInt(event.target.value) === VarietyType.HYBRID) {
          previousVariety.setValidators(Validators.required);
        }
      } else {
        previousVariety.clearValidators();
      }
    } else {
      if (varietyType.value && sowingDate.value) {
        if (parseInt(varietyType.value) === VarietyType.HYBRID) {
          previousVariety.setValidators(Validators.required);
        }
      } else {
        previousVariety.clearValidators();
      }
    }
    previousVariety.updateValueAndValidity();
  }

  private setKilogramValidation() {
    let sowingDate = this.targetYieldForm.controls.sowingDate;
    let kilogram = this.targetYieldForm.controls.kilogram;

    if (
      (this.establishmentCurrentValue === Establishment.WET &&
        sowingDate.value) ||
      (this.establishmentCurrentValue === Establishment.DRY && sowingDate.value)
    ) {
      kilogram.setValidators([
        Validators.required,
        this.seedRateMaxValidator(this.getFieldSizeHectare).bind(this),
        this.seedRateMinValidator(this.getFieldSizeHectare).bind(this),
      ]);
    } else {
      kilogram.clearValidators();
    }
    kilogram.updateValueAndValidity();
  }

  private setSpecifiedVarietyValidation(event: any = false) {
    let specifiedVariety = this.targetYieldForm.controls.specifiedVariety;
    const notInTheList = VarietyType.NOT_IN_THE_LIST;

    if (event) {
      if (parseInt(event.value) === notInTheList) {
        specifiedVariety.setValidators(Validators.required);
      } else {
        specifiedVariety.clearValidators();
      }
    } else {
      if (this.isVarietyNameNotInTheList) {
        specifiedVariety.setValidators(Validators.required);
      } else {
        specifiedVariety.clearValidators();
      }
    }

    specifiedVariety.updateValueAndValidity();
  }

  private setGrowthDurationValidation(event: any = false) {
    let growthDuration = this.targetYieldForm.controls.growthDuration;
    const notInTheList = VarietyType.NOT_IN_THE_LIST;

    if (event) {
      if (parseInt(event.value) === notInTheList) {
        growthDuration.setValidators(Validators.required);
      } else {
        growthDuration.clearValidators();
      }
    } else {
      if (this.isVarietyNameNotInTheList) {
        growthDuration.setValidators(Validators.required);
      } else {
        growthDuration.clearValidators();
      }
    }

    growthDuration.updateValueAndValidity();
  }

  private resetSowingDate() {
    if(!this.recommendation) {
      let sowingDate = this.targetYieldForm.controls.sowingDate;
      sowingDate.reset();
      sowingDate.clearValidators();
      sowingDate.updateValueAndValidity();
    }
  }

  private resetSeedlingAge() {
    if(!this.recommendation) {
      let seedlingAge = this.targetYieldForm.controls.seedlingAge;
      seedlingAge.reset();
      seedlingAge.clearValidators();
      seedlingAge.updateValueAndValidity();
    }
  }

  private resetRecentYearsFarmLotDescription() {
    if(!this.recommendation) {
      let recentYearsFarmLotDescription = this.targetYieldForm.controls
        .recentYearsFarmLotDescription;
      recentYearsFarmLotDescription.reset();
      recentYearsFarmLotDescription.clearValidators();
      recentYearsFarmLotDescription.updateValueAndValidity();
    }
  }

  private resetVarietyType() {
    if(!this.recommendation) {
      let varietyType = this.targetYieldForm.controls.varietyType;
      varietyType.reset();
      varietyType.clearValidators();
      varietyType.updateValueAndValidity();
    }
  }

  private resetKilogram() {
    if(!this.recommendation) {
      let kilogram = this.targetYieldForm.controls.kilogram;
      kilogram.reset();
      kilogram.clearValidators();
      kilogram.updateValueAndValidity();
      this.seedRate = 0;
    }
  }

  private resetVarietyName() {
    if(!this.recommendation) {
      let varietyName = this.targetYieldForm.controls.varietyName;
      varietyName.reset();
      varietyName.clearValidators();
      varietyName.updateValueAndValidity();
    }
  }

  private resetNoAndWeightOfSacks() {
    if(!this.recommendation) {
      let noAndWeightOfSacks = this.targetYieldForm.controls.numberAndWeightOfSacksGroup;
      noAndWeightOfSacks.reset();
      noAndWeightOfSacks.clearValidators();
      noAndWeightOfSacks.updateValueAndValidity();
    }
  }

  private resetUpcomingSeasonSeedSource() {
    if(!this.recommendation) {
      let upcomingSeasonSeedSource = this.targetYieldForm.controls
        .upcomingSeasonSeedSource;
      upcomingSeasonSeedSource.reset();
      upcomingSeasonSeedSource.clearValidators();
      upcomingSeasonSeedSource.updateValueAndValidity();
    }
  }

  private resetSeedSource() {
    if(!this.recommendation) {
      let seedSource = this.targetYieldForm.controls.seedSource;
      seedSource.reset();
      seedSource.clearValidators();
      seedSource.updateValueAndValidity();
    }
  }

  private resetPreviousVariety() {
    if(!this.recommendation) {
      let previousVariety = this.targetYieldForm.controls.previousVariety;
      previousVariety.reset();
      previousVariety.clearValidators();
      previousVariety.updateValueAndValidity();
    }
  }

  private resetSpecifiedVariety() {
    if(!this.recommendation) {
      let specifiedVariety = this.targetYieldForm.controls.specifiedVariety;
      specifiedVariety.reset();
      specifiedVariety.clearValidators();
      specifiedVariety.updateValueAndValidity();
    }
  }

  private resetGrowthDuration() {
    if(!this.recommendation) {
      let growthDuration = this.targetYieldForm.controls.growthDuration;
      growthDuration.reset();
      growthDuration.clearValidators();
      growthDuration.updateValueAndValidity();
    }
  }

  public get isQuestionOneHasError() {
    let timesPlantInAYear = this.targetYieldForm.controls.timesPlantInAYear;
    return (
      (this.isFormSubmitted && timesPlantInAYear.status === 'INVALID') ||
      (timesPlantInAYear.touched && timesPlantInAYear.status === 'INVALID')
    );
  }

  public get isQuestionTwoHasError() {
    let establishment = this.targetYieldForm.controls.establishment;
    return (
      (this.isFormSubmitted && establishment.status === 'INVALID') ||
      (establishment.touched && establishment.status === 'INVALID')
    );
  }

  public get isQuestionThreeHasError() {
    let sowingDate = this.targetYieldForm.controls.sowingDate;

    if (sowingDate.errors !== null) {
      return (
        (this.isFormSubmitted && sowingDate.errors.required) ||
        (sowingDate.touched && sowingDate.errors.required)
      );
    } else {
      return false;
    }
  }

  public get isQuestionThreeAHasError() {
    let sowingDate = this.targetYieldForm.controls.sowingDate;

    if (sowingDate.errors !== null) {
      return (
        (this.isFormSubmitted && sowingDate.errors.allowedSowingDate) ||
        (sowingDate.touched && sowingDate.errors.allowedSowingDate)
      );
    } else {
      return false;
    }
  }

  public get isQuestionThreeBHasError() {
    let sowingDate = this.targetYieldForm.controls.sowingDate;

    if (sowingDate.errors !== null) {
      return (
        (this.isFormSubmitted && sowingDate.errors.earliestSowingDate) ||
        (sowingDate.touched && sowingDate.errors.earliestSowingDate)
      );
    } else {
      return false;
    }
  }

  public get isQuestionFourHasError() {
    let seedlingAge = this.targetYieldForm.controls.seedlingAge;

    if (seedlingAge.errors !== null) {
      return (
        (this.isFormSubmitted && seedlingAge.errors.required) ||
        (seedlingAge.touched && seedlingAge.errors.required)
      );
    } else {
      return false;
    }
  }

  public get isQuestionFiveAHasError() {
    let varietyName = this.targetYieldForm.controls.varietyName;
    return (
      (this.isFormSubmitted && varietyName.status === 'INVALID') ||
      (varietyName.touched && varietyName.status === 'INVALID')
    );
  }

  public get isQuestionFiveHasError() {
    let varietyType = this.targetYieldForm.controls.varietyType;
    return (
      (this.isFormSubmitted && varietyType.status === 'INVALID') ||
      (varietyType.touched && varietyType.status === 'INVALID')
    );
  }

  public get isQuestionSixHasError() {
    let kilogram = this.targetYieldForm.controls.kilogram;

    if (kilogram.errors !== null) {
      return (
        (this.isFormSubmitted && kilogram.errors.required) ||
        (kilogram.touched && kilogram.errors.required)
      );
    } else {
      return false;
    }
  }

  public get isQuestionSixHasMaxError() {
    let kilogram = this.targetYieldForm.controls.kilogram;

    if (kilogram.errors !== null) {
      return (
        (this.isFormSubmitted && kilogram.errors.seedRateMax) ||
        (kilogram.touched && kilogram.errors.seedRateMax)
      );
    } else {
      return false;
    }
  }

  public get isQuestionSixHasMinError() {
    let kilogram = this.targetYieldForm.controls.kilogram;
    if (kilogram.errors !== null) {
      return (
        (this.isFormSubmitted && kilogram.errors.seedRateMin) ||
        (kilogram.touched && kilogram.errors.seedRateMin)
      );
    } else {
      return false;
    }
  }

  public seedRateMaxValidator(fieldSizeHectare): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let invalid = control.value / fieldSizeHectare > MAX_ALLOWABLE_SEEDRATE;
      let seedRateKilogramHasValue =
        control.value !== null && control.value !== undefined;

      return invalid && seedRateKilogramHasValue ? { seedRateMax: true } : null;
    };
  }

  public seedRateMinValidator(fieldSizeHectare): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let invalid = control.value / fieldSizeHectare < MIN_ALLOWABLE_SEEDRATE;
      let seedRateKilogramHasValue =
        control.value !== null && control.value !== undefined;

      return invalid && seedRateKilogramHasValue ? { seedRateMin: true } : null;
    };
  }

  public reportedYieldMaxValidator(
    reportedYield,
    maxReportedYield
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return reportedYield > maxReportedYield &&
        control.value >= 25 &&
        control.value <= 85
        ? { reportedYieldMax: true }
        : null;
    };
  }

  public reportedYieldMinValidator(reportedYield): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return reportedYield < 1 && control.value >= 25 && control.value <= 85
        ? { reportedYieldMin: true }
        : null;
    };
  }

  public get isNumberOfSacksHasValue() {
    let noOfSacks = this.targetYieldForm.controls.numberAndWeightOfSacksGroup.get('noOfSacks');
    if (noOfSacks.errors !== null) {
      return (
        (this.isFormSubmitted && noOfSacks.errors.required) ||
        (noOfSacks.touched && noOfSacks.errors.required)
      );
    } else {
      return false;
    }
  }

  public get isNumberOfSacksValid() {
    let noOfSacks = this.targetYieldForm.controls.numberAndWeightOfSacksGroup.get('noOfSacks');
    if (noOfSacks.errors !== null) {
      return (
        (this.isFormSubmitted && noOfSacks.errors.min) ||
        (noOfSacks.touched && noOfSacks.errors.min)
      );
    } else {
      return false;
    }
  }

  //weight of sack required
  public get isWeightOfSackHasValue() {
    let weightOfSack = this.targetYieldForm.controls.numberAndWeightOfSacksGroup.get('weightOfSack');
    if (weightOfSack.errors !== null) {
      return (
        (this.isFormSubmitted && weightOfSack.errors.required) ||
        (weightOfSack.touched && weightOfSack.errors.required)
      );
    } else {
      return false;
    }
  }

  //weight of sack < 25
  public get isWeightOfSacksMinValid() {
    let weightOfSack = this.targetYieldForm.controls.numberAndWeightOfSacksGroup.get('weightOfSack');
    if (weightOfSack.errors !== null) {
      return (
        (this.isFormSubmitted && weightOfSack.errors.min) ||
        (weightOfSack.touched && weightOfSack.errors.min)
      );
    } else {
      return false;
    }
  }

  //weight of sack > 85
  public get isWeightOfSacksMaxValid() {
    let weightOfSack = this.targetYieldForm.controls.numberAndWeightOfSacksGroup.get('weightOfSack');

    if (weightOfSack.errors !== null) {
      return (
        (this.isFormSubmitted && weightOfSack.errors.max) ||
        (weightOfSack.touched && weightOfSack.errors.max)
      );
    } else {
      return false;
    }
  }

  public get isReportedYieldMinHasError() {
    let numberAndWeightOfSacksGroup = this.targetYieldForm.controls.numberAndWeightOfSacksGroup;
    if (numberAndWeightOfSacksGroup.errors !== null) {
      return (
        (this.isFormSubmitted && numberAndWeightOfSacksGroup.errors.reportedYieldMin) ||
        (numberAndWeightOfSacksGroup.touched && numberAndWeightOfSacksGroup.errors.reportedYieldMin)
      );
    } else {
      return false;
    }
  }

  public get isReportedYieldMaxHasError() {
    let numberAndWeightOfSacksGroup = this.targetYieldForm.controls.numberAndWeightOfSacksGroup;
    if (numberAndWeightOfSacksGroup.errors !== null) {
      return (
        (this.isFormSubmitted && numberAndWeightOfSacksGroup.errors.reportedYieldMax) ||
        (numberAndWeightOfSacksGroup.touched && numberAndWeightOfSacksGroup.errors.reportedYieldMax)
      );
    } else {
      return false;
    }
  }

  public get isQuestionEightAHasError() {
    let previousVariety = this.targetYieldForm.controls.previousVariety;
    return (
      (this.isFormSubmitted && previousVariety.status === 'INVALID') ||
      (previousVariety.touched && previousVariety.status === 'INVALID')
    );
  }

  public get isQuestionEightBHasError() {
    let upcomingSeasonSeedSource = this.targetYieldForm.controls
      .upcomingSeasonSeedSource;
    return (
      (this.isFormSubmitted && upcomingSeasonSeedSource.status === 'INVALID') ||
      (upcomingSeasonSeedSource.touched &&
        upcomingSeasonSeedSource.status === 'INVALID')
    );
  }

  public get isQuestionNineHasError() {
    let seedSource = this.targetYieldForm.controls.seedSource;
    return (
      (this.isFormSubmitted && seedSource.status === 'INVALID') ||
      (seedSource.touched && seedSource.status === 'INVALID')
    );
  }

  public get isQuestionTenHasError() {
    let recentYearsFarmLotDescription = this.targetYieldForm.controls
      .recentYearsFarmLotDescription;
    return (
      (this.isFormSubmitted &&
        recentYearsFarmLotDescription.status === 'INVALID') ||
      (recentYearsFarmLotDescription.touched &&
        recentYearsFarmLotDescription.status === 'INVALID')
    );
  }

  public get isSpecifiedVarietyHasError() {
    let specifiedVariety = this.targetYieldForm.controls.specifiedVariety;
    return (
      (this.isFormSubmitted && specifiedVariety.status === 'INVALID') ||
      (specifiedVariety.touched && specifiedVariety.status === 'INVALID')
    );
  }

  public get isGrowthDurationHasError() {
    let growthDuration = this.targetYieldForm.controls.growthDuration;
    return (
      (this.isFormSubmitted && growthDuration.status === 'INVALID') ||
      (growthDuration.touched && growthDuration.status === 'INVALID')
    );
  }

  private computeMaxSowingDate(): Date {
    const maxSowingDate = add(new Date(), {
      months: 4
    });
    return maxSowingDate;
  }

  private computeMinSowingDate(): Date {
    const minSowingDate = sub(new Date(), {
      months: 1
    });
    return minSowingDate;
  }

  public sowingDateValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    let selectedSowingDate = control.value;
    let isValid = false;
    let days: number;

    if (this.isCropEstablishmentWet || this.isCropEstablishmentDry) {
      days = 8;
    }

    if (this.isCropEstablishmentMechanical) {
      days = 16;
    }

    if (
      this.isCropEstablishmentMechanical ||
      this.isCropEstablishmentWet ||
      this.isCropEstablishmentDry
    ) {
      if (!!control.value) {

        const today = this.getCurrentDate();

        const allowedSowingDate = sub(today, {
          days: days
        });
        const isSelectedSowingDateEqualToAllowedSowingDate = isEqual(selectedSowingDate, allowedSowingDate);
        const isSelectedSowingDateAfterAllowedSowingDate = isAfter(selectedSowingDate, allowedSowingDate);
        isValid = (isSelectedSowingDateEqualToAllowedSowingDate || isSelectedSowingDateAfterAllowedSowingDate);
       
      } else {
        isValid = true;
      }
    }

    if (this.isCropEstablishmentManual) {
      isValid = true;
    }

    return isValid ? null : { allowedSowingDate: true };
  }

  public seedlingAgeValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    let selectedSowingDate = control.value;
    let seedlingAge = parseInt(this.targetYieldForm.controls.seedlingAge.value);
    let days: number;
    let isValid = false;

    if (this.isCropEstablishmentManual) {
      if (!!seedlingAge && !!selectedSowingDate) {
        switch (seedlingAge) {
          case EARLY_SEEDLING_AGE:
            days = 10;
            break;
          case MIDDLE_SEEDLING_AGE:
            days = 15;
            break;
          case LATE_SEEDLING_AGE:
            days = 23;
            break;
        }
        days += 5;

        const earliestSowingDate = add(selectedSowingDate, {
          days: days
        });

        const today = this.getCurrentDate();

        isValid = isAfter(earliestSowingDate, today);
      } else {
        isValid = true;
      }
    }

    if (
      this.isCropEstablishmentMechanical ||
      this.isCropEstablishmentWet ||
      this.isCropEstablishmentDry
    ) {
      isValid = true;
    }
    return isValid ? null : { earliestSowingDate: true };
  }

  private getCurrentDate(): Date {
    const currentDate = new Date();
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    return currentDate;
  }

  private get isCropEstablishmentManual() {
    return this.establishmentCurrentValue === Establishment.MANUAL;
  }

  private get isCropEstablishmentMechanical() {
    return this.establishmentCurrentValue === Establishment.MECHANICAL;
  }

  private get isCropEstablishmentWet() {
    return this.establishmentCurrentValue === Establishment.WET;
  }

  private get isCropEstablishmentDry() {
    return this.establishmentCurrentValue === Establishment.DRY;
  }

  public onRecentYearsFarmLotDescriptionChange() {
    
    this.checkFormValidity()
  }

  public onTimesPlantInAYearChange() {
    
    this.checkFormValidity()
  }

  public onSeedSourceChange() {
    
    this.checkFormValidity()
  }

  public onUpcomingSeasonSeedSourceChange() {
    
    this.checkFormValidity()
  }

  public onPreviousVarietyChange() {
    
    this.checkFormValidity()
  }

  public onSpecifiedVariety() {
    
    this.checkFormValidity()
  }

  public get isFormDisabled() {
    return this.targetYieldForm.disabled || this.recommendation;
  }

  private setSeedlingAgeDefaultValue() {
    let seedlingAge = this.targetYieldForm.controls.seedlingAge;

    if (this.isCropEstablishmentMechanical) {
      seedlingAge.setValue(EARLY_SEEDLING_AGE.toString());
    }
  }

  public editForm() {
    const formEditModel: EditFormModel = {
      isEditable: true,
      formGroup: this.targetYieldForm
    };

    this.formEdit.emit(formEditModel);
  }

  @Input() wasTheRecommendationSaved: boolean;
}
