import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import {
  InitFieldInfoModel,
} from 'src/app/core/models/field-info.model';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldOwner } from 'src/app/v2/core/enums/field-ownership.enum';
import { FormGroup, Validators } from '@angular/forms';
import { FieldInfoRecommendationModel } from 'src/app/recommendation/model/field-info-recommendation.model';
import { TargetYieldModel } from 'src/app/recommendation/model/target-yield.model';
import { FertlizerRatesFormOutputModel } from 'src/app/recommendation/model/fertlizer-rates-form-output.model';
import { OtherCropManagementModel } from 'src/app/recommendation/model/other-crop-management.model';
import { TimingAndFertilizerSourcesModel } from 'src/app/recommendation/model/timing-and-fertilizer-sources-model';
import { FarmerService } from 'src/app/farmer-management/services/farmer.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FertlizerRatesRecommendationFormComponent } from 'src/app/recommendation/components/fertlizer-rates-recommendation-form/fertlizer-rates-recommendation-form.component';
import { FarmLotRecommendationFormComponent } from 'src/app/recommendation/components/farm-lot-recommendation-form/farm-lot-recommendation-form.component';
import { TargetYieldComponent } from 'src/app/recommendation/components/target-yield/target-yield.component';
import { SplittingFertilizerResourcesComponent } from 'src/app/recommendation/components/splitting-fertilizer-resources/splitting-fertilizer-resources.component';
import { OtherCropManagementComponent } from 'src/app/recommendation/components/other-crop-management/other-crop-management.component';
import { SmsNotificationComponent } from 'src/app/recommendation/components/sms-notification/sms-notification.component';
import { FieldRecommendationService } from 'src/app/recommendation/services/field-recommendation.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { FieldRecommendationApiModel } from './model/recommendation-form-models/field-recommendation-api.model';
import { RecommendationModel } from 'src/app/recommendation/model/recommendation-model';
import { DataPotentialYieldService } from 'src/app/recommendation/services/data-potential-yield.service';
import { YieldCalculationValidationService } from 'src/app/recommendation/services/yield-calculation-validation.service';
import { TargetYieldService } from 'src/app/recommendation/services/target-yield.service';

import { VarietyService } from 'src/app/recommendation/services/variety.service';
import { VarietyModel } from 'src/app/recommendation/model/variety.model';
import { VarietyType } from 'src/app/recommendation/enum/variety-type.enum';
import { ImmediateHarvestModel } from 'src/app/recommendation/model/immediate-harvest.model';
import { NRateService } from 'src/app/recommendation/services/computation/n-rate.service';
import { PRateService } from 'src/app/recommendation/services/computation/p-rate.service';
import { KRateService } from 'src/app/recommendation/services/computation/k-rate.service';
import { SoilFertilityService } from 'src/app/recommendation/services/computation/soil-fertility.service';
import { OrganicFertilizerRateModel } from 'src/app/recommendation/model/organic-fertilizer-rate.model';
import { NRateModel } from 'src/app/recommendation/model/n-rate.model';
import { PreviousCrop } from 'src/app/recommendation/enum/previous-crop.enum';
import { OrganicFertilizerInputService } from 'src/app/recommendation/services/computation/organic-fertilizer-input.service';
import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';
import { NPKRateOutputModel } from 'src/app/recommendation/model/npk-rate-output.model';
import { RecommendationAsPdfService } from 'src/app/recommendation/services/recommendation-as-pdf.service';
import { EditFormModel } from 'src/app/recommendation/model/edit-form.model';
import { NSource } from 'src/app/recommendation/enum/n-source.enum';
import { FertilizerInputService } from 'src/app/recommendation/services/computation/fertilizer-input.service';
import { Establishment } from 'src/app/recommendation/enum/establishment.enum';
import { SeedlingAge } from 'src/app/recommendation/enum/seedling-age.enum';
import { GrowthDurationService } from 'src/app/recommendation/services/computation/growth-duration.service';
import {
  CAPITALIZE_DAYS_AFTER_SOWING,
  CAPITALIZE_DAYS_AFTER_EMERGENCE,
  CAPITALIZE_DAYS_AFTER_TRANSPLANTING,
} from 'src/app/recommendation/constant/label-days-after-crop-establishment.constant';
import {
  MIDDLE_SEEDLING_AGE_LABEL,
  EARLY_SEEDLING_AGE_LABEL,
  LATE_SEEDLING_AGE_LABEL,
} from 'src/app/recommendation/constant/seedling-age.constant';
import { FertilizerRateInputModel } from 'src/app/recommendation/model/fertilizer-rate-input.model';
import { SeasonService } from 'src/app/recommendation/services/computation/season.service';
import { Season } from 'src/app/recommendation/enum/season.enum';
import { FarmerYieldModel } from 'src/app/recommendation/model/farmer-yield-model';
import { MatVerticalStepper } from '@angular/material/stepper';
import { SetTargetYieldModel } from 'src/app/recommendation/model/recommendation-answer-models/set-target-yield-model';
import { FarmerMaxReportedYieldModel } from 'src/app/recommendation/model/farmer-max-reported-yield.model';
import { FarmerNormalYieldModel } from 'src/app/recommendation/model/farmer-normal-yield.model';
import {
  SQUARE_METER,
  HECTARE,
} from 'src/app/recommendation/constant/field-unit.constant';
import { FarmingPracticesRecommendationService } from 'src/app/recommendation/services/farming-practices-recommendation.service';
import { FarmingRecommendationPracticesOutputModel } from 'src/app/recommendation/model/farming-recommendation-practices-output.model';
import { PotentialYieldService } from 'src/app/recommendation/services/computation/potential-yield/potential-yield.service';
import { PreviousYieldService } from 'src/app/recommendation/services/computation/previous-yield.service';
import { MinimumSacksService } from 'src/app/recommendation/services/computation/minimum-sacks.service';
import { LocationService } from 'src/app/core/services/location.service';
import { PotentialYieldComputationModel } from 'src/app/recommendation/model/potential-yield-computation-model';
import { decimalPlaceRound } from 'src/app/v2/helpers/round-decimal.helper';
import { MoistureContentInitial } from 'src/app/recommendation/enum/moisture-content-initial.enum';
import { MoistureContentFinal } from 'src/app/recommendation/enum/moisture-content-final.enum';
import { TranslateService } from '@ngx-translate/core';
import { ZincObservation } from 'src/app/recommendation/enum/zinc-observation.enum';
import { WeedControl } from 'src/app/recommendation/enum/weed-control.enum';
import { RecommendationStorageService } from 'src/app/offline-management/services/recommendation-storage.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { Language } from 'src/app/recommendation/enum/language.enum';
import { AlertNotificationService } from 'src/app/v2/core/services/alert-notification.service';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { LocationService as LocationServiceV2 } from 'src/app/location/service/location.service';
import { FieldService } from 'src/app/farm-management/services/field.service';
import { FarmerAndFieldStorageService } from '../offline-management/services/farmer-and-field-storage.service';
import { SmsDialectModel } from 'src/app/recommendation/model/sms-dialect.model';
import { DialectTranslationService } from 'src/app/recommendation/services/dialect-translation.service';
import { Dialect } from 'src/app/recommendation/enum/dialect.enum';
import { PhoneOwner } from 'src/app/farmer-management/enums/phone-owner.enum';


@Component({
  selector: 'app-field-recommendation',
  templateUrl: './recommendation-page.component.html',
  styleUrls: ['./recommendation-page.component.scss'],
})
export class RecommendationPage implements OnInit {
  private _fieldInfo: FarmApiModel;
  private _farmerInfo: FarmerApiModel;
  temporaryReferenceId: string;
  public fieldAddressDisplay: string;
  public farmerNameDisplay: string;
  public farmerMobileNumber: string;
  public phoneOwner: PhoneOwner | '0';
  public fieldInfoRecommendationFormValue;
  public recommendationReferenceId: number;
  public recommendation: RecommendationModel;

  // form groups
  public fieldInfoRecommendationForm: FormGroup = new FormGroup({});
  // TODO Rename this field
  public setTargetYieldForm: FormGroup = new FormGroup({});
  // TODO Correct spelling
  public fertlizerRatesForm: FormGroup = new FormGroup({});
  public nFertilizerSourceForm: FormGroup = new FormGroup({});
  public otherCropManagementForm: FormGroup = new FormGroup({});
  public smsNotificationForm: FormGroup = new FormGroup({});

  // form outputs
  public fieldInfoRecommendation: FieldInfoRecommendationModel;
  public targetYieldModel: TargetYieldModel;
  // TODO Correct spelling
  public fertlizerRatesModel: FertlizerRatesFormOutputModel;
  public timingSplittingModel: TimingAndFertilizerSourcesModel;
  public otherCropManagementModel: OtherCropManagementModel;
  
  public viewMode: boolean;
  public showLoader = false;
  public isLoading: boolean;

  public allVarieties: VarietyModel[] = null;
  public filteredVarieties: VarietyModel[] = null;
  public previousFreshWeight = 0;
  public previousDryWeight = 0;
  public soilFertility: number;
  public organicFertilizer: OrganicFertilizerRateModel;
  public npkRateOutputModel = {} as NPKRateOutputModel;
  public farmingPracticesModel: FarmingRecommendationPracticesOutputModel;
  public pdfFile: string;
  public referenceId: number | string;
  public isTheRecommendationSaved = false;
  public previousSelectedLanguage: Language;
  public isRecommendationForUpdate: boolean;
  public smsDialectModel: SmsDialectModel;

  public isOffline: boolean;

  constructor(
    private location: Location,
    private fieldService: FieldService,
    private farmerService: FarmerService,
    private route: ActivatedRoute,
    private recommendationService: FieldRecommendationService,
    public alertService: AlertService,
    public dataPotentialYieldService: DataPotentialYieldService,
    public varietyService: VarietyService,
    private yieldCalculationValidationService: YieldCalculationValidationService,
    private targetYieldService: TargetYieldService,
    private nRateService: NRateService,
    private pRateService: PRateService,
    private kRateService: KRateService,
    private soilFertilityService: SoilFertilityService,
    private organicFertilizerInputService: OrganicFertilizerInputService,
    private recommendationPdfService: RecommendationAsPdfService,
    public fertilizerInputService: FertilizerInputService,
    public growthDurationService: GrowthDurationService,
    private seasonService: SeasonService,
    private potentialYieldService: PotentialYieldService,
    private prevYield: PreviousYieldService,
    private minimumSacks: MinimumSacksService,
    private locationService: LocationService,
    private locationServiceV2: LocationServiceV2,
    public farmingPracticeRecommendationService: FarmingPracticesRecommendationService,
    public translateService: TranslateService,
    private recommendationStorageService: RecommendationStorageService,
    private offlineStorageService: OfflineStorageService,
    private alertNotificationService: AlertNotificationService,
    private router: Router,
    private farmerAndFieldStorage: FarmerAndFieldStorageService,
    private dialectTranslationService: DialectTranslationService,
  ) {
    const recommendationSummaryStepIndex = 6;
    const referenceId = this.route.snapshot.paramMap.get('referenceId')

    const urlPath = this.router.routerState.snapshot.url;
    const recommendationUrlUpdate = urlPath.split('/').slice(-1)[0];
    this.isRecommendationForUpdate = recommendationUrlUpdate == "update";

    if (referenceId && !this.isRecommendationForUpdate) {
      this.stepperSelectedIndex = recommendationSummaryStepIndex;
    }
    this.referenceId = referenceId;
  }

  async ngOnInit() {
    this.isOffline = await this.offlineStorageService.getOfflineMode();
    this.isLoading = true;
    this._fieldInfo = InitFieldInfoModel();

    const routeId = this.route.snapshot.paramMap.get('fieldId');
    const fieldId = !isNaN(Number(routeId)) ? parseInt(routeId) : 0;
    const offlineFieldId = routeId;

    let fieldModel: FarmApiModel;
    if(isNaN(Number(routeId))){
      fieldModel = await this.farmerAndFieldStorage.getFieldInfoByOfflineFieldId(offlineFieldId);
      this.setFieldInfo(fieldModel);
      this.setRecommendation();
    }else{
      if(this.isOffline){
        fieldModel = await this.farmerAndFieldStorage.getFieldInfoByFieldId(fieldId);
        this.setFieldInfo(fieldModel);
        if (!this.isRecommendationForUpdate) {
          this.setRecommendation();
        }
      }else{
        this.fieldService
        .getFarmerField(fieldId)
        .pipe(take(1))
        .subscribe(res => {
          this.setFieldInfo(res['fieldModel']);
          if (!this.isRecommendationForUpdate) {
            this.setRecommendation();
          }
        });
      }
    }

    const routeFarmerId = this.route.snapshot.paramMap.get('id');
    const farmerId = !isNaN(Number(routeFarmerId)) ? parseInt(routeFarmerId) : 0;
    const offlineFarmerId = routeFarmerId;
    let farmerModel: FarmerApiModel;

    if(isNaN(Number(routeFarmerId))) {
      farmerModel = await this.farmerAndFieldStorage.getFarmerPageInfoData(offlineFarmerId);
      this.setFarmerInfo(farmerModel);
    } else {
      if(this.isOffline) {
        farmerModel = await this.farmerAndFieldStorage.getFarmerPageInfoData(farmerId);
        this.setFarmerInfo(farmerModel);
      } else {
        this.farmerService.getFarmerById(farmerId)
          .pipe(take(1))
          .subscribe(res => {
            const farmer = this.farmerService.mapModeltoApi(res);
            this.setFarmerInfo(farmer);
          });
      }
    }

    this.allVarieties = await this.varietyService.getVarietyApi().toPromise();
    await this.dataPotentialYieldService.loadPotentialYield();
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.translateService.use('english');
  }

  public numberAndWeightOfSacksAnswerChange(
    immediateHarvestModel: ImmediateHarvestModel
  ) {
    if (immediateHarvestModel) {
      const minReportedYield = 1;

      this.previousFreshWeight = this.targetYieldService.computeReportYield(
        immediateHarvestModel.immediateHarvestSackCount,
        immediateHarvestModel.immediateHarvestKgPerSack,
        immediateHarvestModel.fieldSizeInHectare
      );

      this.previousDryWeight = this.targetYieldService.computeFarmerNormalYield(
        immediateHarvestModel.immediateHarvestSackCount,
        immediateHarvestModel.immediateHarvestKgPerSack,
        immediateHarvestModel.fieldSizeInHectare
      );

      this.updateNoOfSacksWeightOfSackValidation(
        minReportedYield,
        this.previousFreshWeight,
        this.targetYieldModel.maxReportedYield
      );
    }
  }

  public updateNoOfSacksWeightOfSackValidation(
    minReportedYield: number,
    previousFreshWeight: number,
    maxReportedYield: number
  ) {
    const numberAndWeightOfSacksGroup = this.fertlizerRatesForm.controls
      .numberAndWeightOfSacksGroup;

    if (previousFreshWeight) {
      numberAndWeightOfSacksGroup.setValidators(
        this.yieldCalculationValidationService.isYieldValid(
          minReportedYield,
          previousFreshWeight,
          maxReportedYield
        )
      );
    } else {
      numberAndWeightOfSacksGroup.clearValidators();
    }

    numberAndWeightOfSacksGroup.updateValueAndValidity();
  }

  public async calculateNPKRates(
    fertilizerRateInputModel: FertilizerRateInputModel
  ) {
    if (this.fertlizerRatesForm.valid) {
      const cropCount = parseInt(this.targetYieldModel.timesPlantInAYear, 10);
      const previousCrop = fertilizerRateInputModel.previousCrop;

      const soilFertility = await this.soilFertilityService.computeSoilFertility(
        cropCount,
        this.targetYieldModel.sowingDate,
        previousCrop,
        this.fieldInfoRecommendation.waterSource,
        this.fieldInfoRecommendation.municipalityId
      );

      const fieldSize = this.fieldInfoRecommendation.selectedFarmSize;
      const isOrganicApplied =
        fertilizerRateInputModel.willApplyOrganicFertilizer;
      const organicBagCount = fertilizerRateInputModel.organicBags;
      const organicKgPerBag = fertilizerRateInputModel.organicWeight;
      const dryWeightOutput = this.targetYieldModel.dryWeightOutput;

      let organicFertilizer: OrganicFertilizerRateModel;

      if (isOrganicApplied) {
        organicFertilizer = this.organicFertilizerInputService.calculateNutrientAmountFromAppliedOrganicFertilizer(
          organicBagCount,
          organicKgPerBag,
          fieldSize
        );
      }

      this.organicFertilizer = organicFertilizer;

      const nRateTemp = this.nRateService.computeNRate(
        soilFertility,
        dryWeightOutput, //targetYield
        parseInt(this.targetYieldModel.growthDuration, 10),
        parseInt(this.targetYieldModel.establishment, 10),
        parseInt(this.targetYieldModel.varietyType, 10),
        parseInt(this.targetYieldModel.seedlingAge, 10),
        organicFertilizer
      ) as NRateModel;

      const nRateModel = nRateTemp;
      const nRate = Math.round(
        nRateTemp.nEarly +
          nRateTemp.nActiveTillering +
          nRateTemp.nPanicleInitiation +
          nRateTemp.nHeading
      );

      let averageYield = this.targetYieldModel.previousYield;

      if (
        (cropCount === 1 || cropCount === 3) &&
        (previousCrop === PreviousCrop.RICE ||
          previousCrop === PreviousCrop.NO_CROP)
      ) {
        averageYield = this.getReportedYieldDryWeight();
      }

      const pRateTemp = this.pRateService.calculateTotalP2O5Rate(
        dryWeightOutput,
        this.fieldInfoRecommendation.waterSource,
        soilFertility,
        previousCrop,
        averageYield,
        fertilizerRateInputModel.harvestType,
        organicFertilizer
      );

      const pRate = Math.round(pRateTemp);

      const kRateTemp = this.kRateService.calculateTotalK2ORate(
        dryWeightOutput,
        fertilizerRateInputModel.harvestType,
        previousCrop,
        averageYield,
        this.fieldInfoRecommendation.waterSource,
        parseInt(this.targetYieldModel.timesPlantInAYear, 10),
        this.targetYieldModel.sowingDate,
        soilFertility
      );

      this.soilFertility = soilFertility;
      const kRate = Math.round(kRateTemp);

      const kSplit = this.kRateService.populateKSplitModel(kRate);

      this.npkRateOutputModel = {
        nRateModel: nRateModel,
        totalNRate: nRate,
        totalPRate: pRate,
        totalKRate: kRate,
        kSplit: kSplit,
        showNPKRate: true,
      };
      return this.npkRateOutputModel;
    } else {
      this.npkRateOutputModel.showNPKRate = false;
      return this.npkRateOutputModel;
    }
  }

  private getReportedYieldDryWeight() {
    return this.targetYieldService.computeReportedYieldDryWeight(
      this.targetYieldModel.noOfSacks,
      this.targetYieldModel.weightOfSack,
      this.fieldInfoRecommendation.selectedFarmSize
    );
  }

  private setRecommendation() {
    const referenceId = this.route.snapshot.paramMap.get('referenceId');
    let refId = 0;
    let temporaryRefId = '';
    if (referenceId && referenceId.includes('-')) {
      temporaryRefId = referenceId;
    } else {
      refId = parseInt(
        referenceId,
        10
      );
    }

    this.viewMode = !!referenceId;

    if (referenceId) {
      const routeFieldId = this.route.snapshot.paramMap.get('fieldId');
      const fieldId = this.field.field_id ? this.field.field_id : routeFieldId;

      this.isTheRecommendationSaved = true;
      this.recommendationService
        .viewRecommendation(refId, temporaryRefId, fieldId)
        .subscribe(res => {
          this.recommendation = res;
          this.filteredVarieties = this.allVarieties;
          this.fieldInfoRecommendation = this.initFieldInfoRecommendation();
          this.fieldInfoRecommendationFormValue = this.initFieldInfoRecommendationFormValue();
          this.targetYieldModel = this.initTargetYieldModel();
          this.fertlizerRatesModel = this.initFertilizerRatesModel();
          this.timingSplittingModel = this.recommendation.timingSplitting;
          this.otherCropManagementModel = this.initOtherCropModel();
          this.farmingPracticesModel = this.recommendation.farmingPractices;
          this.pdfFile = this.recommendation.pdfFile;
          this.previousSelectedLanguage = this.recommendation.previousSelectedLanguage;
          this.smsDialectModel = this.initSmsDialectModel();
        });
    }
  }

  private initFieldInfoRecommendation(): FieldInfoRecommendationModel {
    const farmLot = this.recommendation.farmLot;
    let selectFarmSize = 0;
    if (this.field) {
      if (farmLot.isSelectedWholeFarmLotSize === YesNo.YES) {
        selectFarmSize = this.field.field_size_ha;
      } else {
        if (farmLot.specifiedFarmLotSizeUnit === SQUARE_METER.id) {
          selectFarmSize = farmLot.specifiedFarmLotSize / 10000;
        } else if (farmLot.specifiedFarmLotSizeUnit === HECTARE.id) {
          selectFarmSize = farmLot.specifiedFarmLotSize;
        }
      }
    }
    return {
      field_id: this.field.field_id,
      farmerId: this.field.farmer_id,
      farmLotName: farmLot.farmLotName,
      regionId: farmLot.farmLotRegionId,
      region: this.field.address.region,
      provinceId: farmLot.farmLotProvinceId,
      province: this.field.address.province,
      municipalityId: farmLot.farmLotMunicipalityId,
      municipality: this.field.address.municipality,
      barangayId: farmLot.farmLotBarangayId,
      barangay: this.field.address.barangay,
      selectedFarmSize: selectFarmSize,
      daProject: farmLot.daProject,
      specifiedDaProject: farmLot.specifiedDaProject,
      waterSource: farmLot.waterSource,
      useGasolineDieselOrElectricity: farmLot.isUsingPumpPoweredEquipment,
      hasAccessToPump: farmLot.hasPumpSupplyAccess,
      isSelectedWholeFarmLotSize: farmLot.isSelectedWholeFarmLotSize,
      specifiedFarmLotSizeUnit: farmLot.specifiedFarmLotSizeUnit,
      specifiedFarmLotSize: farmLot.specifiedFarmLotSize,
      farmLotAddress: farmLot.farmLotAddress,
    };
  }

  private initFieldInfoRecommendationFormValue() {
    const farmLot = this.recommendation.farmLot;
    return {
      selectedFarmSize: farmLot.specifiedFarmLotSize,
      farmLotName: farmLot.farmLotName,
    };
  }

  private initTargetYieldModel() {
    const targetYield = this.recommendation.setTargetYield;
    this.estimatedHarvestMonth = this.recommendation.setTargetYield.estimatedHarvestMonth;
    this.seedRate = targetYield.seedRateKilogramPerHectare;
    this.farmerYield = this.loadFarmerYield(targetYield);

    return {
      timesPlantInAYear: targetYield.cropsPerYear.toString(),
      establishment: targetYield.cropEstablishment.toString(),
      sowingDate: new Date(targetYield.sowingDate),
      seedlingAge:
        targetYield.seedlingAge !== null
          ? targetYield.seedlingAge.toString()
          : null,
      varietyType: targetYield.varietyType.toString(),
      specifiedVariety:
        targetYield.varietyName === '-99' ? targetYield.varietyName : null,
      varietyName: targetYield.varietyId,
      growthDuration: targetYield.growthDuration.toString(),
      kilogram: targetYield.seedRate,
      noOfSacks: targetYield.typicalYieldSacks,
      weightOfSack: targetYield.typicalYieldKg,
      previousVariety:
        targetYield.previousVarietyType !== null
          ? targetYield.previousVarietyType.toString()
          : null,
      upcomingSeasonSeedSource:
        targetYield.upcomingSeedSource !== null
          ? targetYield.upcomingSeedSource.toString()
          : null,
      seedSource:
        targetYield.previousSeedSource !== null
          ? targetYield.previousSeedSource.toString()
          : null,
      recentYearsFarmLotDescription: targetYield.water.toString(),
      maxReportedYield: targetYield.maxReportedYield,
      seedRate: targetYield.seedRate,
      seedRateKgHa: targetYield.seedRateKilogramPerHectare,

      // output
      targetYieldSackCount: targetYield.targetYieldSackCount,
      targetYieldKgPerSack: targetYield.targetYieldKgPerSack,
      freshWeightOutput: targetYield.freshWeightOutput,
      dryWeightOutput: targetYield.dryWeightOutput,
      previousYield: targetYield.previousYield,
      varietyNameLabel: targetYield.varietyName,
      season: targetYield.season,
      potentialYieldOutput: targetYield.potentialYieldOutput,
      normalFreshWeight: targetYield.normalFreshWeight,
      normalDryWeight: targetYield.normalDryWeight,
      estimatedHarvestMonth: this.estimatedHarvestMonth,
    };
  }

  private loadFarmerYield(targetYield: SetTargetYieldModel): FarmerYieldModel {
    const normal: FarmerNormalYieldModel = {
      freshWeight: targetYield.normalFreshWeight,
      dryWeight: targetYield.normalDryWeight,
    };
    const maxReported: FarmerMaxReportedYieldModel = {
      freshWeight: targetYield.maxReportedYield,
    };

    const farmerYield: FarmerYieldModel = {
      normal: normal,
      maxReported: maxReported,
    };

    return farmerYield;
  }

  private initOtherCropModel() {
    const otherCrop = this.recommendation.otherCropManagement;
    const weedControlArr = otherCrop.weedControl
      .toString()
      .split(',')
      .map(Number);
    const zincObservationArr = otherCrop.zincObservation
      .toString()
      .split(',')
      .map(Number);

    const preEmergenceAns =
      weedControlArr.filter(m => m === WeedControl.PRE_EMERGENCE).length > 0;
    const postEmergenceAns =
      weedControlArr.filter(m => m === WeedControl.POST_EMERGENCE).length > 0;
    const handWeedingAns =
      weedControlArr.filter(m => m === WeedControl.HAND_WEEDING).length > 0;
    const waterManagementAns =
      weedControlArr.filter(m => m === WeedControl.WATER_MANAGEMENT).length > 0;

    const profuseGrowthAns =
      zincObservationArr.filter(m => m === ZincObservation.PROFUSE_GROWTH)
        .length > 0;
    const oilyFilmAns =
      zincObservationArr.filter(m => m === ZincObservation.OILY_FILM).length >
      0;
    const standingWaterAns =
      zincObservationArr.filter(m => m === ZincObservation.STANDING_WATER)
        .length > 0;
    const dustyBrownSpotsAns =
      zincObservationArr.filter(m => m === ZincObservation.BROWN_SPOTS).length >
      0;
    const noFieldObservationAns =
      zincObservationArr.filter(m => m === ZincObservation.NO_OBSERVATION)
        .length > 0;

    return {
      applyInsecticide: otherCrop.applyInsecticide,
      synchronizing: otherCrop.synchronizing,

      preEmergence: preEmergenceAns ? YesNo.YES : YesNo.NO,
      postEmergence: postEmergenceAns ? YesNo.YES : YesNo.NO,
      handWeeding: handWeedingAns ? YesNo.YES : YesNo.NO,
      waterManagement: waterManagementAns ? YesNo.YES : YesNo.NO,

      profuseGrowth: profuseGrowthAns ? YesNo.YES : YesNo.NO,
      oilyFilm: oilyFilmAns ? YesNo.YES : YesNo.NO,
      standingWater: standingWaterAns ? YesNo.YES : YesNo.NO,
      dustyBrownSpots: dustyBrownSpotsAns ? YesNo.YES : YesNo.NO,
      noFieldObservation: noFieldObservationAns ? YesNo.YES : YesNo.NO,

      zincObservation: zincObservationArr,
      weedControl: weedControlArr,
    };
  }

  private initFertilizerRatesModel() {
    const fertilizerRates = this.recommendation.fertilizerRates;

    const nRate = {
      nEarly: fertilizerRates.nRate.nEarly,
      nActiveTillering: fertilizerRates.nRate.nActiveTillering,
      nPanicleInitiation: fertilizerRates.nRate.nPanicleInitiation,
      nHeading: fertilizerRates.nRate.nHeading,
    };

    const kSplit = {
      kEarly: fertilizerRates.kSplit.kEarly,
      kPanicleInitiation: fertilizerRates.kSplit.kPanicleInitiation,
    };

    const organicFertilizer = {
      organicNRate: fertilizerRates.organicFertilizer.organicNRate,
      organicPRate: fertilizerRates.organicFertilizer.organicPRate,
      organicKRate: fertilizerRates.organicFertilizer.organicKRate,
    };

    return {
      previousCrop: fertilizerRates.previousCrop,
      harvestType: fertilizerRates.harvestType,
      immediateRiceHarvestSackCount: fertilizerRates.previousYieldSacks,
      immediateRiceHarvestKgPerSack: fertilizerRates.previousYieldKg,
      previousFreshWeight: fertilizerRates.previousFreshWeight,
      previousDryWeight: fertilizerRates.previousDryWeight,
      willApplyOrganicFertlizer: fertilizerRates.willApplyOrganicFertilizer,
      organicFertlizerBagCount: fertilizerRates.organicBags,
      organicFertlizerKgPerBag: fertilizerRates.organicWeight,
      organicFertilizerRateConversion:
        fertilizerRates.organicFertilizerConversion,

      //output
      nRate: nRate,
      kSplit: kSplit,
      totalNRate: fertilizerRates.totalNRate,
      totalPRate: fertilizerRates.totalPRate,
      totalKRate: fertilizerRates.totalKRate,
      soilFertility: fertilizerRates.soilFertility,
      organicFertilizer: organicFertilizer,
    };
  }

  private initSmsDialectModel() {
    const smsAndDialect = this.recommendation.smsAndDialect;

    return {
      receiveSms: smsAndDialect.receiveSms,
      dialect: smsAndDialect.dialect,
      transplantingWillOccur: smsAndDialect.transplantingWillOccur,
      transplantingOccurLowerDate: smsAndDialect.transplantingOccurLowerDate,
      transplantingOccurUpperDate: smsAndDialect.transplantingOccurUpperDate,
    };
  }

  public get field(): FarmApiModel {
    return this._fieldInfo;
  }

  get fieldOwnerText() {
    return FieldOwner;
  }

  setFieldInfo(value: FarmApiModel) {
    if (value.address) {
      this.fieldAddressDisplay = `${
        value.address.barangay ? value.address.barangay : ''
      } ${value.address.municipality} ${value.address.province} ${
        value.address.region
      }`;
    }
    this._fieldInfo = value;
  }

  setFarmerInfo(value: FarmerApiModel) {
    if (value) {
      this.farmerNameDisplay = `${value.first_name}${value.middle_name ? " " + value.middle_name : ''} ${value.last_name}${value.suffix_name ? " " + value.suffix_name : ''}`;
      this.farmerMobileNumber = value.contact_info.mobile_number;
      this.phoneOwner = value.contact_info.phone_owner;
    }
    this._farmerInfo = value;
  }

  public backClicked() {
    this.location.back();
  }

  public stepperSelectedIndex = 0;
  public selectionChange(event: StepperSelectionEvent) {
    if (event.selectedIndex > event.previouslySelectedIndex) {
      event.previouslySelectedStep.stepControl.disable();
    }
  }

  resetQuestions(
    formEdit,
    form:
      | FarmLotRecommendationFormComponent
      | TargetYieldComponent
      | FertlizerRatesRecommendationFormComponent
      | SplittingFertilizerResourcesComponent
      | OtherCropManagementComponent
      | SmsNotificationComponent
  ) {
    if (formEdit) {
      if (form instanceof FarmLotRecommendationFormComponent) {
        this.setTargetYieldForm.reset();
        this.fertlizerRatesForm.reset();
        this.nFertilizerSourceForm.reset();
        this.otherCropManagementForm.reset();
        this.smsNotificationForm.reset();

        this.setTargetYieldForm.enable();
        this.fertlizerRatesForm.enable();
        this.nFertilizerSourceForm.enable();
        this.otherCropManagementForm.enable();
        this.smsNotificationForm.enable();
      }

      if (form instanceof TargetYieldComponent) {
        this.fertlizerRatesForm.reset();
        this.nFertilizerSourceForm.reset();
        this.otherCropManagementForm.reset();
        this.smsNotificationForm.reset();

        this.fertlizerRatesForm.enable();
        this.nFertilizerSourceForm.enable();
        this.otherCropManagementForm.enable();
        this.smsNotificationForm.enable();
      }

      if (form instanceof FertlizerRatesRecommendationFormComponent) {
        this.nFertilizerSourceForm.reset();
        this.otherCropManagementForm.reset();
        this.smsNotificationForm.reset();

        this.nFertilizerSourceForm.enable();
        this.otherCropManagementForm.enable();
        this.smsNotificationForm.enable();
      }

      if (form instanceof SplittingFertilizerResourcesComponent) {
        this.otherCropManagementForm.reset();
        this.smsNotificationForm.reset();

        this.otherCropManagementForm.enable();
        this.smsNotificationForm.enable();
      }
      
      if (form instanceof OtherCropManagementComponent) {
        this.smsNotificationForm.reset();

        this.smsNotificationForm.enable();
      }
    }
  }

  public async saveRecommendation(pdfBase64: string) {
    const recommendation: FieldRecommendationApiModel = {
      fieldInfoModel: this.fieldInfoRecommendation,
      targetYieldModel: this.targetYieldModel,
      fertlizerRatesModel: this.fertlizerRatesModel,
      timingSplittingModel: this.timingSplittingModel,
      otherCropManagementModel: this.otherCropManagementModel,
      farmingPracticesModel: this.farmingPracticesModel,
      pdfFile: pdfBase64,
      farmerId: this._farmerInfo && this._farmerInfo.farmer_id ? this._farmerInfo.farmer_id : this._farmerInfo.offline_id,
      previousSelectedLanguage: this.currentSelectedLanguage,
      temporaryRefId: null,
      smsDialectModel: this.smsDialectModel,
      farmLotId: this.fieldInfoRecommendation.field_id,
      sowingDate: this.targetYieldModel.sowingDate.toLocaleDateString()
    };

    const cloneTargetYieldModel: any = Object.assign(
      {},
      recommendation.targetYieldModel
    );
    cloneTargetYieldModel.sowingDate = cloneTargetYieldModel.sowingDate.toLocaleDateString();

    const cloneRecommendation: FieldRecommendationApiModel = JSON.parse(
      JSON.stringify(recommendation)
    );
    cloneRecommendation.targetYieldModel.sowingDate =
      cloneTargetYieldModel.sowingDate;

    if (this.isOffline) {
      if (this.isRecommendationForUpdate) {
        this.temporaryReferenceId = this.referenceId as string;
        cloneRecommendation.temporaryRefId = this.temporaryReferenceId;
        cloneRecommendation.pdfFile = await this.recommendationPdfService.getBase64String(
          cloneRecommendation.temporaryRefId
        );

        this.isTheRecommendationSaved = await this.recommendationStorageService.update(cloneRecommendation)
      } else {
        const fieldId = cloneRecommendation.fieldInfoModel.field_id ? cloneRecommendation.fieldInfoModel.field_id : cloneRecommendation.fieldInfoModel.offlineFieldId;
        this.temporaryReferenceId = await this.recommendationStorageService.createTemporaryReferenceId(fieldId);
        cloneRecommendation.temporaryRefId = this.temporaryReferenceId;
        cloneRecommendation.pdfFile = await this.recommendationPdfService.getBase64String(
          cloneRecommendation.temporaryRefId
        );
        cloneRecommendation.farmLotId = fieldId;
        this.isTheRecommendationSaved = await this.recommendationStorageService.storeRecommendation(
          cloneRecommendation
        );
      }
      
      this.recommendationTransactionMessage(this.isTheRecommendationSaved, false);
    } else if (this.isRecommendationForUpdate) {
      const refId = parseInt(this.referenceId as string);
      cloneRecommendation.refId = refId;
      this.recommendationService
        .updateRecommendation(cloneRecommendation)
        .subscribe(
          async data => {
            if (data) {
              this.recommendationReferenceId = refId;
              await this.updateRecommendationPdf();
            }
            this.isTheRecommendationSaved = true;
            this.recommendationTransactionMessage(this.isTheRecommendationSaved, true);
          },
          err => {
            this.recommendationTransactionMessage(false, true);
          }
        );
    } else {
      this.recommendationService
        .saveRecommendation(cloneRecommendation)
        .subscribe(
          async data => {
            if (data) {
              this.recommendationReferenceId = (data as any).ref;
              await this.updateRecommendationPdf();
            }
            this.isTheRecommendationSaved = true;
            this.recommendationTransactionMessage(this.isTheRecommendationSaved, false);
          },
          err => {
            this.recommendationTransactionMessage(false, false);
          }
        );
    }
  }

  private async updateRecommendationPdf() {
    const pdfBlob = await this.recommendationPdfService.getBase64String(
      this.recommendationReferenceId
    );
    this.recommendationService
      .updatePdfRecommendation(
        this.recommendationReferenceId,
        pdfBlob
      )
      .subscribe();
  }

  public async recommendationTransactionMessage(
    isRecommendationSaveSuccessful: boolean,
    isRecommendationForUpdate: boolean
  ) {

    const successMessage = isRecommendationForUpdate ? 'UPDATE_SUCCESS_MESSAGE' : 'SAVE_SUCCESS_MESSAGE';
    const failMessage = isRecommendationForUpdate ? 'UPDATE_FAIL_MESSAGE' : 'SAVE_FAIL_MESSAGE';

    const translatedSuccessMessage = await this.translateService
      .get('RECOMMENDATION_ALERT_MESSAGES.' + successMessage)
      .toPromise();
    const translatedFailMessage = await this.translateService
      .get('RECOMMENDATION_ALERT_MESSAGES.' + failMessage)
      .toPromise();
    const responseMessage = isRecommendationSaveSuccessful ? translatedSuccessMessage : translatedFailMessage;

    this.alertNotificationService.showAlert(
      responseMessage,
      'Farm Lot Recommendation',
    );
  }

  public getVarietiesByType(
    allVarieties: VarietyModel[],
    selectedVarietyType: VarietyType
  ) {
    const allVarietiesLabel = allVarieties.map(variety => {
      if (variety.label.includes('null')) {
        variety.label = variety.label.replace('null', ' ');
      }
      return variety
    })
    return allVarietiesLabel.filter(variety => {
      const varietyType = variety.filterByAnswerValue;

      if (selectedVarietyType === VarietyType.INBRED) {
        return (
          varietyType === VarietyType.INBRED ||
          varietyType === VarietyType.OTHER
        );
      }

      if (selectedVarietyType === VarietyType.HYBRID) {
        return (
          varietyType === VarietyType.HYBRID ||
          varietyType === VarietyType.OTHER
        );
      }
    });
  }

  public onOtherCropManagementFormValid(formModel: OtherCropManagementModel) {
    if (!this.recommendation) {
      this.otherCropManagementModel = formModel;
      this.farmingPracticesModel = this.farmingPracticeRecommendationService.getFarmingPracticesRecommendation(
        this.fieldInfoRecommendation,
        this.targetYieldModel,
        this.fertlizerRatesModel,
        this.timingSplittingModel,
        this.otherCropManagementModel
      );
    }
  }

  public onSmsAndDialectFormValid(formModel: SmsDialectModel){
    if (!this.recommendation) {
      this.smsDialectModel = formModel;
    }
  }

  public async editForm(
    editFormModel: EditFormModel,
    form:
      | FarmLotRecommendationFormComponent
      | TargetYieldComponent
      | FertlizerRatesRecommendationFormComponent
      | SplittingFertilizerResourcesComponent
      | OtherCropManagementComponent
      | SmsNotificationComponent
  ) {
    const editFormHeadingTranslation = await this.translateService
      .get('COMMON.EDIT_FORM.HEADING')
      .toPromise();
    const editFormBodyTranslation = await this.translateService
      .get('COMMON.EDIT_FORM.BODY')
      .toPromise();
    const editFormCancelButtonTranslation = await this.translateService
      .get('COMMON.EDIT_FORM.CANCEL_BUTTON')
      .toPromise();

    this.alertService.alert(
      editFormHeadingTranslation,
      editFormBodyTranslation,
      editFormCancelButtonTranslation,
      'Ok',
      this.enableAndUpdateForm.bind(this, editFormModel, form)
    );
  }

  public enableAndUpdateForm(
    editFormModel: EditFormModel,
    form:
      | FarmLotRecommendationFormComponent
      | TargetYieldComponent
      | FertlizerRatesRecommendationFormComponent
      | SplittingFertilizerResourcesComponent
      | OtherCropManagementComponent
      | SmsNotificationComponent
  ) {
    editFormModel.formGroup.enable();
    this.resetQuestions(editFormModel.isEditable, form);
  }

  public async calculateFertilizerInput(nSource: string) {
    const growthDuration = parseInt(this.targetYieldModel.growthDuration, 0);
    let seedlingAge = parseInt(this.targetYieldModel.seedlingAge, 0);
    const cropEstablishment = parseInt(this.targetYieldModel.establishment, 0);
    const threeSplits = this.fertlizerRatesModel.nRate.nActiveTillering > 0;

    this.timingSplittingModel = await this.fertilizerInputService.compute(
      this.fertlizerRatesModel.totalPRate,
      this.fertlizerRatesModel.totalKRate,
      this.fertlizerRatesModel.nRate.nEarly, // N Early
      this.fertlizerRatesModel.nRate.nActiveTillering, // N Active Tillering
      this.fertlizerRatesModel.nRate.nPanicleInitiation, // N Panicle Initiation
      this.fertlizerRatesModel.nRate.nHeading, // N Heading
      nSource === NSource.AMMOSUL,
      this.fieldInfoRecommendation.selectedFarmSize,
      this.targetYieldModel.dryWeightOutput,
      parseInt(this.targetYieldModel.varietyType, 0)
    );

    if (
      cropEstablishment === Establishment.MANUAL &&
      growthDuration === 1 &&
      seedlingAge === SeedlingAge.LATE_SEEDLING_AGE
    ) {
      this.timingSplittingModel.show21DaysSeedling = true;
      this.timingSplittingModel.ATDaysColSize = 2;

      const growthDuration21DaysRecommendationModel = await this.growthDurationService.computeGD(
        cropEstablishment,
        growthDuration,
        seedlingAge,
        threeSplits, //activeTillering 3 splits
        this.fieldInfoRecommendation.waterSource
      );
      this.timingSplittingModel.twentyOneDaysSeedling = growthDuration21DaysRecommendationModel;
      seedlingAge = SeedlingAge.MIDDLE_SEEDLING_AGE;
    } else {
      this.timingSplittingModel.show21DaysSeedling = false;
      this.timingSplittingModel.ATDaysColSize = 4;
    }

    const growthDurationRecommendationModel = await this.growthDurationService.computeGD(
      cropEstablishment,
      growthDuration,
      seedlingAge,
      threeSplits, //activeTillering 3 splits
      this.fieldInfoRecommendation.waterSource
    );

    this.timingSplittingModel.growthDuration = growthDurationRecommendationModel;

    this.timingSplittingModel.showEarlyFert =
      this.timingSplittingModel.growthStages[0].fertilizerSources[0]
        .fertilizerAmount > 0;
    this.timingSplittingModel.showMOPFert = this.isMOPFertDisplayed();
    this.timingSplittingModel.fertTitleColSize = this.getFertTitleColSize();
    this.timingSplittingModel.ureaAmmosul = this.getUreaAmmosul();
    this.timingSplittingModel.fertColSize = this.getFertColSize();
    this.timingSplittingModel.pRate = this.fertlizerRatesModel.totalPRate;
    this.timingSplittingModel.showHeading = this.shouldShowHeading();
    this.timingSplittingModel.nSource = parseInt(
      this.nFertilizerSourceForm.value.nSource,
      0
    );
    this.timingSplittingModel.daysAfterLabel = this.daysAfterLabel;
    this.timingSplittingModel.seedlingAgeOutputTableLabel = this.seedlingAgeOutputTableLabel;
    this.timingSplittingModel.showOutput = true;
  }

  private get seedlingAgeOutputTableLabel(): string {
    let seedlingAgeLabel = '';
    let seedlingText = ' seedling';

    if (this.targetYieldModel) {
      if (this.timingSplittingModel.show21DaysSeedling) {
        seedlingAgeLabel = MIDDLE_SEEDLING_AGE_LABEL;
      } else {
        if (
          this.targetYieldModel.establishment ===
            Establishment.MANUAL.toString() ||
          this.targetYieldModel.establishment ===
            Establishment.MECHANICAL.toString()
        ) {
          if (
            this.targetYieldModel.seedlingAge ===
            SeedlingAge.EARLY_SEEDLING_AGE.toString()
          ) {
            seedlingAgeLabel = EARLY_SEEDLING_AGE_LABEL;
          } else if (
            this.targetYieldModel.seedlingAge ===
            SeedlingAge.MIDDLE_SEEDLING_AGE.toString()
          ) {
            seedlingAgeLabel = MIDDLE_SEEDLING_AGE_LABEL;
          } else if (
            this.targetYieldModel.seedlingAge ===
            SeedlingAge.LATE_SEEDLING_AGE.toString()
          ) {
            seedlingAgeLabel = LATE_SEEDLING_AGE_LABEL;
          }
        } else {
          return seedlingAgeLabel;
        }
      }
    }

    return `${seedlingAgeLabel}${seedlingText}`;
  }

  private get daysAfterLabel(): string {
    const cropEstablishment = parseInt(this.targetYieldModel.establishment, 0);
    let daysAfterLabel = '';

    if (cropEstablishment == Establishment.WET) {
      daysAfterLabel = CAPITALIZE_DAYS_AFTER_SOWING;
    } else if (cropEstablishment == Establishment.DRY) {
      daysAfterLabel = CAPITALIZE_DAYS_AFTER_EMERGENCE;
    } else {
      daysAfterLabel = CAPITALIZE_DAYS_AFTER_TRANSPLANTING;
    }

    return daysAfterLabel;
  }

  private shouldShowHeading(): boolean {
    const varietyType = parseInt(this.targetYieldModel.varietyType, 0);

    const shouldShowHeading =
      varietyType === VarietyType.HYBRID &&
      this.targetYieldModel.dryWeightOutput >= 7.5 &&
      this.fertlizerRatesModel.nRate.nActiveTillering > 0;

    return shouldShowHeading;
  }

  private getUreaAmmosul(): string {
    const isNSourceAmmosul =
      this.nFertilizerSourceForm.value.nSource === NSource.AMMOSUL;
    return isNSourceAmmosul ? 'Ammosul (21-0-0)' : 'Urea (46-0-0)';
  }

  private getFertColSize(): number {
    return this.fertlizerRatesModel.totalPRate > 0 && this.isMOPFertDisplayed()
      ? 1.33
      : 2;
  }

  private getFertTitleColSize(): number {
    return this.fertlizerRatesModel.totalPRate > 0 && this.isMOPFertDisplayed()
      ? 4
      : 6;
  }

  private isMOPFertDisplayed(): boolean {
    const panicleInitiationFertilizer2 =
      this.fertlizerRatesModel.totalPRate === 0
        ? 0
        : this.timingSplittingModel.growthStages[2].fertilizerSources[1]
            .fertilizerAmount > 0
        ? this.timingSplittingModel.growthStages[2].fertilizerSources[1]
            .fertilizerAmount
        : 0;

    let earlyFertilizer2 = 0;
    if (
      this.fertlizerRatesModel.totalPRate === 0 &&
      !!this.timingSplittingModel.growthStages[0].fertilizerSources[2]
    ) {
      earlyFertilizer2 = this.timingSplittingModel.growthStages[0]
        .fertilizerSources[2].fertilizerAmount;
    }

    return panicleInitiationFertilizer2 > 0 || earlyFertilizer2 > 0;
  }

  public seedRate: number;
  public onSeedRateKgChanged(seedRateKg: number) {
    const fieldSizeHectare = this.fieldInfoRecommendation.selectedFarmSize;
    this.seedRate = this.targetYieldService.computeSeedRate(
      seedRateKg,
      fieldSizeHectare
    );
  }

  private sowingDate: Date;
  public onSowingDateSelected(sowingDate: Date): void {
    this.sowingDate = sowingDate;
    this.resetYieldInfo();
    this.resetEstimatedHarvestMonth();
  }

  public estimatedHarvestMonth: string;
  public onVarietyNameSelected(varietyId: number) {
    this.resetYieldInfo();
    const growthDuration = this.findVarietyIdGrowthDuration(
      varietyId,
      this.allVarieties
    );
    if (!this.recommendation) {
      this.estimatedHarvestMonth = this.targetYieldService.estimateHarvestMonth(
        this.sowingDate,
        growthDuration,
        this.cropEstablishment
      );
    }
    this.updateNoOfSacksWeightOfSackValidationTwo();
  }

  private findVarietyIdGrowthDuration(
    varietyId: number,
    allVarieties: VarietyModel[]
  ): number {
    if (!!allVarieties) {
      const foundVariety = allVarieties.find(
        variety => variety.value === varietyId
      );
      return foundVariety !== undefined ? foundVariety.growthDuration : 0;
    } else {
      return 0;
    }
  }

  public onGrowthDurationSelected(growthDuration: number) {
    if (!this.recommendation) {
      this.estimatedHarvestMonth = this.targetYieldService.estimateHarvestMonth(
        this.sowingDate,
        growthDuration,
        this.cropEstablishment
      );
      this.updateNoOfSacksWeightOfSackValidationTwo();
    }
  }

  public farmerYield: FarmerYieldModel;
  public onNoOfSacksAndWeightChanged() {
    const noOfSacks = this.setTargetYieldForm.value.numberAndWeightOfSacksGroup
      .noOfSacks;
    const weightOfSack = this.setTargetYieldForm.value
      .numberAndWeightOfSacksGroup.weightOfSack;
    const fieldSizeHectare = this.fieldInfoRecommendation.selectedFarmSize;
    const normal = {
      freshWeight: this.targetYieldService.computeReportYield(
        noOfSacks,
        weightOfSack,
        fieldSizeHectare
      ),
      dryWeight: this.targetYieldService.computeFarmerNormalYield(
        noOfSacks,
        weightOfSack,
        fieldSizeHectare
      ),
    };
    const sowingDate = this.setTargetYieldForm.controls.sowingDate.value;
    this.season = this.seasonService.computeSeason(sowingDate);
    const waterSource = this.fieldInfoRecommendation.waterSource;
    const varietyType = parseInt(
      this.setTargetYieldForm.controls.varietyType.value
    );
    const maxReported = {
      freshWeight: this.targetYieldService.computeMaxReportYield(
        this.season,
        waterSource,
        varietyType
      ),
    };
    this.farmerYield = {
      normal: normal,
      maxReported: maxReported,
    };

    this.updateNoOfSacksWeightOfSackValidationTwo(event);
  }

  public season: Season;

  public onVarietyTypeChanged(
    allVarieties: VarietyModel[],
    selectedVarietyType: VarietyType
  ) {
    this.filteredVarieties = this.getVarietiesByType(
      allVarieties,
      selectedVarietyType
    );
    this.updateNoOfSacksWeightOfSackValidationTwo(event);

    this.resetYieldInfo();
    this.resetEstimatedHarvestMonth();
  }

  private resetEstimatedHarvestMonth() {
    if (!this.recommendation) {
      this.estimatedHarvestMonth = '';
    }
  }

  private cropEstablishment: Establishment;
  public onCropEstablishmentSelected(cropEstablishment: Establishment) {
    this.cropEstablishment = cropEstablishment;
    this.resetYieldInfo();
    this.resetEstimatedHarvestMonth();
  }

  private resetYieldInfo() {
    if (!this.recommendation) {
      const normal = {
        freshWeight: 0,
        dryWeight: 0,
      };

      const maxReported = {
        freshWeight: 0,
      };

      this.farmerYield = {
        normal: normal,
        maxReported: maxReported,
      };
    }
  }

  private updateNoOfSacksWeightOfSackValidationTwo(event: any = false) {
    if (!this.recommendation) {
      const numberAndWeightOfSacksGroup = this.setTargetYieldForm.controls
        .numberAndWeightOfSacksGroup;
      const noOfSacks = numberAndWeightOfSacksGroup.get('noOfSacks');
      const weightOfSack = numberAndWeightOfSacksGroup.get('weightOfSack');

      let varietyTypeValue = event
        ? event.target.value
        : this.setTargetYieldForm.controls.varietyType.value;

      let requiredVariables =
        this.fieldInfoRecommendation.selectedFarmSize &&
        this.fieldInfoRecommendation.farmLotName &&
        this.estimatedHarvestMonth &&
        varietyTypeValue &&
        this.setTargetYieldForm.controls.sowingDate.value &&
        this.fieldInfoRecommendation.waterSource;

      if (requiredVariables) {
        noOfSacks.setValidators([Validators.required, Validators.min(1)]);

        weightOfSack.setValidators([
          Validators.required,
          Validators.min(25),
          Validators.max(85),
        ]);

        const minReportedYield = 1;

        if (
          !!this.farmerYield.normal.freshWeight &&
          !!this.farmerYield.maxReported.freshWeight
        ) {
          numberAndWeightOfSacksGroup.setValidators(
            this.yieldCalculationValidationService.isYieldValid(
              minReportedYield,
              this.farmerYield.normal.freshWeight,
              this.farmerYield.maxReported.freshWeight
            )
          );
        } else {
          numberAndWeightOfSacksGroup.clearValidators();
        }
      }
      numberAndWeightOfSacksGroup.updateValueAndValidity();
    }
  }

  public onFormSubmitTargetYield(stepper: MatVerticalStepper) {
    stepper.next();
    this.updateNoOfSacksWeightOfSackValidationTwo();
  }

  public async onSetTargetYieldFormValid(targetYieldForm: FormGroup) {
    this.locationServiceV2.getRegionProvinces(this.fieldInfoRecommendation.regionId)
      .pipe(take(1))
      .subscribe(async res => {
        const provinceData = res.find(
          province =>
            province.id === this.fieldInfoRecommendation.provinceId
        );
        let varietyGrowthDuration = this.findVarietyIdGrowthDuration(
          targetYieldForm.controls.varietyName.value,
          this.allVarieties
        );
        varietyGrowthDuration =
          varietyGrowthDuration === 0
            ? parseInt(targetYieldForm.value.growthDuration)
            : varietyGrowthDuration;
    
        const previousYield = this.prevYield.computePreviousYield(
          this.fieldInfoRecommendation.waterSource,
          this.setTargetYieldForm.controls.sowingDate.value,
          varietyGrowthDuration,
          parseInt(this.setTargetYieldForm.controls.establishment.value),
          parseInt(this.setTargetYieldForm.controls.timesPlantInAYear.value),
          provinceData
        );
    
        const farmerNormalYield = this.farmerYield.normal.dryWeight;
        const targetYieldFormValues = targetYieldForm.value;
    
        const municipalities = await this.locationService.getMunicipalities();
        const municipalityData = municipalities.find(
          municipality =>
            municipality.value === this.fieldInfoRecommendation.municipalityId
        );
        
        const potentialYieldComputationModel = await this.computePotentialYield(
          previousYield,
          farmerNormalYield,
          this.fieldInfoRecommendation,
          targetYieldFormValues,
          varietyGrowthDuration,
          municipalityData.runId
        );
    
        this.targetYieldModel = this.createTargetYieldModel(
          potentialYieldComputationModel,
          targetYieldForm,
          this.farmerYield,
          varietyGrowthDuration
        );
      })
  }

  public async computePotentialYield(
    previousYield: number,
    farmerNormalYield: number,
    fieldInfoRecommendation: FieldInfoRecommendationModel,
    targetYieldFormValues: any,
    varietyGrowthDuration: number,
    municipalityRunId: number
  ): Promise<PotentialYieldComputationModel> {
    // form values (set target yield form values)
    // fieldFormValues (fieldSize, location, etc.)
    // this.potentialYield.computePotentialYield(setTargetYieldInputs, fieldInputs)
    this.potentialYieldService.computePotentialYield(
      fieldInfoRecommendation.regionId,
      municipalityRunId,
      varietyGrowthDuration,
      targetYieldFormValues.sowingDate,
      parseInt(targetYieldFormValues.varietyType),
      parseInt(targetYieldFormValues.seedSource),
      parseInt(targetYieldFormValues.upcomingSeasonSeedSource),
      parseInt(targetYieldFormValues.recentYearsFarmLotDescription),
      farmerNormalYield,
      fieldInfoRecommendation.waterSource,
      previousYield,
      targetYieldFormValues.previousVariety
    );

    const targetYield = this.potentialYieldService.targetYield;
    const dryWeight = decimalPlaceRound(targetYield, 1);
    const freshWeight = decimalPlaceRound(
      targetYield / (MoistureContentInitial.value / MoistureContentFinal.value),
      1
    );
    const potentialYieldOutput = decimalPlaceRound(
      this.potentialYieldService.potentialYieldOutput,
      1
    );

    this.minimumSacks.setMinimumSacks(
      dryWeight,
      fieldInfoRecommendation.selectedFarmSize,
      targetYieldFormValues.numberAndWeightOfSacksGroup.weightOfSack
    );
    const minSacks = this.minimumSacks.getMinimumSacks();

    const potentialYieldComputationModel: PotentialYieldComputationModel = {
      dryWeight: dryWeight,
      freshWeight: freshWeight,
      previousYield: previousYield,
      potentialYieldOutput: potentialYieldOutput,
      minSacks: minSacks,
    };

    return potentialYieldComputationModel;
  }

  private createTargetYieldModel(
    potentialYieldComputationModel: PotentialYieldComputationModel,
    setTargetYieldForm: FormGroup,
    farmerYield: FarmerYieldModel,
    varietyGrowthDuration: number
  ) {
    const varietyNameSelected = setTargetYieldForm.value.varietyName;
    const targetYieldModel: TargetYieldModel = {
      ...setTargetYieldForm.value,
      maxReportedYield: farmerYield.maxReported.freshWeight,
      targetYieldSackCount: potentialYieldComputationModel.minSacks,
      targetYieldKgPerSack: parseInt(
        setTargetYieldForm.value.numberAndWeightOfSacksGroup.weightOfSack
      ),
      freshWeightOutput: potentialYieldComputationModel.freshWeight,
      dryWeightOutput: potentialYieldComputationModel.dryWeight,
      previousYield: potentialYieldComputationModel.previousYield,
      varietyNameLabel: this.getVarietyNameLabel(varietyNameSelected),
      growthDuration: varietyGrowthDuration.toString(),
      seedRate: setTargetYieldForm.value.kilogram,
      seedRateKgHa: this.seedRate ? this.seedRate : null,
      season: this.season,
      potentialYieldOutput: potentialYieldComputationModel.potentialYieldOutput,
      normalFreshWeight: decimalPlaceRound(farmerYield.normal.freshWeight, 1),
      normalDryWeight: decimalPlaceRound(farmerYield.normal.dryWeight, 1),
      noOfSacks: setTargetYieldForm.value.numberAndWeightOfSacksGroup.noOfSacks,
      weightOfSack:
        setTargetYieldForm.value.numberAndWeightOfSacksGroup.weightOfSack,
      estimatedHarvestMonth: this.estimatedHarvestMonth,
    };

    return targetYieldModel;
  }

  private getVarietyNameLabel(value: number) {
    const notInTheList = VarietyType.NOT_IN_THE_LIST;
    if (!!this.allVarieties) {
      if (value === notInTheList) {
        return this.setTargetYieldForm.value.specifiedVariety;
      } else {
        const variety = this.allVarieties.find(v => v.value === value);
        return variety !== undefined ? variety.label : '';
      }
    } else {
      return '';
    }
  }

  public readonly ENGLISH = Language.ENGLISH;
  public readonly FILIPINO = Language.FILIPINO;
  public onLanguageChange(event: CustomEvent): void {
    const dropDownValue = (event.target as HTMLInputElement).value;
    const language = parseInt(dropDownValue, 10);
    this.translateQuestionnaire(language);
    this.currentSelectedLanguage = language;
  }

  public defaultSelectedLanguage = Language.ENGLISH;
  private currentSelectedLanguage = this.defaultSelectedLanguage;

  public get dialectEquivalent() {
    return this.dialectTranslationService.dialectSelection(this.currentSelectedLanguage == Language.ENGLISH ? Dialect.ENGLISH : Dialect.TAGALOG);
  }

  private translateQuestionnaire(language: Language) {
    switch (language) {
      case Language.ENGLISH:
        this.translateService.use('english');
        break;
      case Language.FILIPINO:
        this.translateService.use('filipino');
        break;
    }
  }
  public async onFertilizerRatesFormValid(fertilizerRatesForm: FormGroup) {
    const previousCrop = parseInt(
      fertilizerRatesForm.get('selectedCrop').value,
      10
    );
    const isOrganicApplied =
      fertilizerRatesForm.get('willApplyOrganicFertilizer').value === YesNo.YES;
    const organicBagCount = fertilizerRatesForm.get('organicFertlizerBagCount')
      .value;
    const organicKgPerBag = fertilizerRatesForm.get('organicFertlizerKgPerBag')
      .value;
    const harvestType = parseInt(
      fertilizerRatesForm.get('harvestType').value,
      10
    );
    const numberAndWeightOfSacksGroup =
      fertilizerRatesForm.value.numberAndWeightOfSacksGroup;
    const immediateHarvestSackCount =
      numberAndWeightOfSacksGroup.immediateHarvestSackCount;
    const immediateHarvestKgPerSack =
      numberAndWeightOfSacksGroup.immediateHarvestKgPerSack;

    let npkRateOutput: NPKRateOutputModel;
    if (fertilizerRatesForm.enabled) {
      const fertilizerRatesFormValues: FertilizerRateInputModel = {
        previousCrop: previousCrop,
        willApplyOrganicFertilizer: isOrganicApplied,
        organicBags: organicBagCount,
        organicWeight: organicKgPerBag,
        harvestType: harvestType,
      };
      npkRateOutput = await this.calculateNPKRates(fertilizerRatesFormValues);
    }

    this.fertlizerRatesModel = {
      previousCrop: previousCrop,
      harvestType: harvestType,
      immediateRiceHarvestSackCount: immediateHarvestSackCount,
      immediateRiceHarvestKgPerSack: immediateHarvestKgPerSack,
      previousFreshWeight: this.previousFreshWeight,
      previousDryWeight: this.previousDryWeight,
      willApplyOrganicFertlizer: isOrganicApplied,
      organicFertlizerBagCount: organicBagCount,
      organicFertlizerKgPerBag: organicKgPerBag,
      nRate: npkRateOutput.nRateModel,
      kSplit: npkRateOutput.kSplit,
      totalNRate: npkRateOutput.totalNRate,
      totalPRate: npkRateOutput.totalPRate,
      totalKRate: npkRateOutput.totalKRate,
      soilFertility: this.soilFertility,
      organicFertilizer: this.organicFertilizer,
      organicFertilizerRateConversion: this.getNumberOfFertlizerBagsPerHectare(
        organicBagCount,
        organicKgPerBag,
        this.fieldInfoRecommendation.selectedFarmSize
      ),
    };
  }

  public getNumberOfFertlizerBagsPerHectare(
    organicFertilizerBagCount: number,
    organicFertilizerKgPerBag: number,
    selectedFarmSize: number
  ) {
    let numberOfFertilizerBagsPerHectare = 0;

    if (organicFertilizerBagCount && organicFertilizerKgPerBag) {
      numberOfFertilizerBagsPerHectare = Math.round(
        organicFertilizerBagCount / selectedFarmSize
      );
    }

    return numberOfFertilizerBagsPerHectare;
  }
}
