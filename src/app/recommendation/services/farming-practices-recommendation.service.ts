import { Injectable } from '@angular/core';
import { PreviousCrop } from '../enum/previous-crop.enum';
import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';
import { Establishment } from 'src/app/recommendation/enum/establishment.enum';
import { WaterSource } from 'src/app/recommendation/enum/water-source.enum';
import { UpcomingSeedSource } from 'src/app/recommendation/enum/upcoming-seed-source.enum';
import { SeedlingAge } from 'src/app/recommendation/enum/seedling-age.enum';
import { Season } from 'src/app/recommendation/enum/season.enum';
import { FarmlotDescription } from 'src/app/recommendation/enum/farmlot-description.enum';
import { SeasonService } from 'src/app/recommendation/services/computation/season.service';
import { RiceCropPerYear } from 'src/app/recommendation/enum/rice-crop-per-year.enum';
import { FertlizerRatesFormOutputModel } from '../model/fertlizer-rates-form-output.model';
import { OtherCropManagementModel } from '../model/other-crop-management.model';
import { FarmingRecommendationPracticesOutputModel } from '../model/farming-recommendation-practices-output.model';
import { TargetYieldModel } from '../model/target-yield.model';
import { FieldInfoRecommendationModel } from '../model/field-info-recommendation.model';
import { TimingAndFertilizerSourcesModel } from '../model/timing-and-fertilizer-sources-model';
import { FertilizerDelay } from 'src/app/recommendation/enum/fertilizer-delay.enum';
import { QualitySeeds } from '../enum/quality-seeds.enum';

@Injectable({
  providedIn: 'root'
})
export class FarmingPracticesRecommendationService {

  constructor(
    private seasonService: SeasonService
  ) { }

  public qualitySeedsLowerLimit: number;
  public qualitySeedsUpperLimit: number;
  public qualitySeedsValue: number;
  public fertilizerDelay: number;


  public shouldDisplaySprayInsecticide(
    previousCrop: PreviousCrop,
    applyInsecticide: YesNo,
    synchronizing: YesNo
  ): boolean {
    return applyInsecticide === YesNo.YES
      && synchronizing === YesNo.YES
      && (previousCrop === PreviousCrop.RICE
        || previousCrop === PreviousCrop.CORN
        || previousCrop === PreviousCrop.LEGUME
        || previousCrop === PreviousCrop.NO_CROP
      );
  }

  public shouldDisplayWeedManagement(
    cropEstablishment: Establishment,
    dryWeightOutput: number,
    waterSource: WaterSource
  ): boolean {
    if (cropEstablishment && waterSource) {

      const MIN_TARGET_YIELD = 3.5;

      return ((cropEstablishment === Establishment.MANUAL
        || cropEstablishment === Establishment.MECHANICAL)
        &&
        (waterSource === WaterSource.IRRIGATED
          ? dryWeightOutput <= MIN_TARGET_YIELD
          : true)
      );
    }

    return false;
  }

  public shouldDisplayControlIrrigation(
    waterSource: WaterSource,
    useGasolineDieselOrElectricity: YesNo
  ): boolean {
    if (waterSource && useGasolineDieselOrElectricity) {

      return (waterSource === WaterSource.IRRIGATED
        && useGasolineDieselOrElectricity === YesNo.YES
      );
    }

    return false;
  }


  public qualitySeedsHelper(
    cropEstablishment: Establishment,
    seedRateKgHa: number,
    sowingDate: Date,
    upcomingSeasonSeedSource: UpcomingSeedSource,
    selectedFarmSize: number
  ) {

    const isSeeding = (cropEstablishment === Establishment.DRY || cropEstablishment === Establishment.WET);
    const seedRateLowValue = 40;
    const seedRateHighValue = 80;
    const today = new Date();
    const sowingDateValue = new Date(sowingDate);
    const validSowingInterviewDate = (today.getTime() < sowingDateValue.getTime());

    const seedRateLowKgHectare = seedRateLowValue * selectedFarmSize;
    const seedRateHighKgHectare = seedRateHighValue * selectedFarmSize;
    let qualitySeedsValue = 0;
    this.qualitySeedsLowerLimit = 0;
    this.qualitySeedsUpperLimit = 0;
    if ((isSeeding && (seedRateKgHa > (seedRateHighKgHectare) || seedRateKgHa < (seedRateLowKgHectare)))
      && upcomingSeasonSeedSource !== 0
      && validSowingInterviewDate
    ) {
      qualitySeedsValue = QualitySeeds.USE_SEED_OLDER_THAN_39_DAYS;
      this.qualitySeedsLowerLimit = Math.round(seedRateLowKgHectare);
      this.qualitySeedsUpperLimit = Math.round(seedRateHighKgHectare);
    }

    if ((isSeeding && (seedRateKgHa <= (seedRateHighKgHectare) && seedRateKgHa > (seedRateLowKgHectare)))
      && upcomingSeasonSeedSource === UpcomingSeedSource.HOME_SAVED_SEED
      && validSowingInterviewDate
    ) {
      qualitySeedsValue = QualitySeeds.USE_QUALITY_SEEDS_GOOD_SNAIL_CONTROL;
    }

    if (!isSeeding
      && upcomingSeasonSeedSource === UpcomingSeedSource.HOME_SAVED_SEED) {
      qualitySeedsValue = QualitySeeds.USE_QUALITY_SEEDS;
    }

    return qualitySeedsValue;
  }

  public shouldDisplayTwentyOneDays(
    cropEstablishment: Establishment,
    seedlingAge: SeedlingAge,
    growthDuration: number
  ): boolean {
    if (cropEstablishment && seedlingAge && growthDuration) {

      const ONE_HUNDRED_ONE_TO_ONE_HUNDRED_TEN_DAYS = 1;

      return ((cropEstablishment === Establishment.MANUAL
        || cropEstablishment === Establishment.MECHANICAL)
        && growthDuration === ONE_HUNDRED_ONE_TO_ONE_HUNDRED_TEN_DAYS
        && seedlingAge === SeedlingAge.LATE_SEEDLING_AGE
      );
    }

    return false;
  }

  public shouldDisplayWaterManagement(
    sowingDate: Date,
    cropEstablishment: Establishment,
    recentYearsFarmLotDescription: FarmlotDescription
  ): boolean {
    if (sowingDate && cropEstablishment && recentYearsFarmLotDescription) {

      const sowingMonth = this.seasonService.computeSeason(sowingDate);

      return ((cropEstablishment == Establishment.MANUAL
        || cropEstablishment == Establishment.MECHANICAL)
        && sowingMonth == Season.DRY
        && recentYearsFarmLotDescription == FarmlotDescription.SUBMERGENCE
      );
    }

    return false;
  }

  public shouldDisplayZincDeficient(
    cropEstablishment: Establishment,
    timesPlantInAYear: RiceCropPerYear,
    profuseGrowth: boolean,
    oilyFilm: boolean,
    dustyBrownSpots: boolean,
    standingWater: boolean
  ): boolean {

    let observeStatus = (profuseGrowth
      || oilyFilm
      || dustyBrownSpots
      || standingWater);

    return ((cropEstablishment == Establishment.MANUAL
      || cropEstablishment == Establishment.MECHANICAL)
      && timesPlantInAYear != RiceCropPerYear.THREE
      && observeStatus
    );
  }

  public shouldDisplayIrrigateAtFlowering(
    waterSource: WaterSource,
    hasAccessToPump: YesNo
  ): boolean {

    return (waterSource === WaterSource.RAINFED
      && hasAccessToPump === YesNo.YES
    );
  }

  public delayFertilizerApplicationHelper(
    waterSource: WaterSource,
    activeTilleringHighDay: number,
    recentYearsFarmLotDescription: FarmlotDescription
  ) {

    let isDelayFertilizerApplicationToDisplay = false;
    if (waterSource && activeTilleringHighDay && recentYearsFarmLotDescription) {

      if (waterSource == WaterSource.RAINFED
        && recentYearsFarmLotDescription > FarmlotDescription.ADEQUATE
        && activeTilleringHighDay != null
      ) {
        isDelayFertilizerApplicationToDisplay = true;
      }
    }
    return isDelayFertilizerApplicationToDisplay;
  }

  public getFertilizerDelay(
    isDelayFertilizerApplicationDisplayed: boolean,
    activeTilleringLowDay: number,
    panicleInitiationHighDay: number,
  ) {
    const shortDaysDuration = 17;
    const mediumDaysDuration = 24;
    const daysDifference = (panicleInitiationHighDay - activeTilleringLowDay);
    let fertilizerDelay = 0;

    if (isDelayFertilizerApplicationDisplayed) {
      if (daysDifference < shortDaysDuration) {
        fertilizerDelay = FertilizerDelay.COMBINE_ALL;
      } else if (daysDifference >= shortDaysDuration && daysDifference < mediumDaysDuration) {
        fertilizerDelay = FertilizerDelay.FOR_ACTIVE_AND_PANICLE;
      } else {
        fertilizerDelay = FertilizerDelay.FOR_ACTIVE_TILLERING;
      }
    }

    return fertilizerDelay;
  }

  public getFarmingPracticesRecommendation(
    fieldRecommendation: FieldInfoRecommendationModel,
    targetYield: TargetYieldModel,
    fertilizerRates: FertlizerRatesFormOutputModel,
    timingSplittingAndFertSources: TimingAndFertilizerSourcesModel,
    otherCropManagement: OtherCropManagementModel) {
    const notDisplayed = 0;
    const cropEstablishment: Establishment = parseInt(targetYield.establishment);
    const isSprayInsecticideDisplayed = this.shouldDisplaySprayInsecticide(
      fertilizerRates.previousCrop,
      otherCropManagement.applyInsecticide,
      otherCropManagement.synchronizing
    );

    const isWeedManagementDisplayed = this.shouldDisplayWeedManagement(
      cropEstablishment,
      targetYield.dryWeightOutput,
      fieldRecommendation.waterSource
    );

    const isControlIrrigationDisplayed = this.shouldDisplayControlIrrigation(
      fieldRecommendation.waterSource,
      fieldRecommendation.useGasolineDieselOrElectricity
    );

    const qualitySeedsValue = this.qualitySeedsHelper(
      cropEstablishment,
      targetYield.seedRateKgHa,
      targetYield.sowingDate,
      parseInt(targetYield.upcomingSeasonSeedSource, 10),
      fieldRecommendation.selectedFarmSize
    );

    const isTwentyOneDaysDisplayed = this.shouldDisplayTwentyOneDays(
      parseInt(targetYield.establishment, 10),
      parseInt(targetYield.seedlingAge, 10),
      parseInt(targetYield.growthDuration, 10)
    );

    const isWaterManagementDisplayed = this.shouldDisplayWaterManagement(
      targetYield.sowingDate,
      parseInt(targetYield.establishment, 10),
      parseInt(targetYield.recentYearsFarmLotDescription, 10)
    );

    const isZincDeficientDisplayed = this.shouldDisplayZincDeficient(
      parseInt(targetYield.establishment, 10),
      parseInt(targetYield.timesPlantInAYear, 10),
      otherCropManagement.profuseGrowth === YesNo.YES,
      otherCropManagement.oilyFilm === YesNo.YES,
      otherCropManagement.dustyBrownSpots === YesNo.YES,
      otherCropManagement.standingWater === YesNo.YES,
    );

    const isIrrigateAtFloweringDisplayed = this.shouldDisplayIrrigateAtFlowering(
      fieldRecommendation.waterSource,
      fieldRecommendation.hasAccessToPump
    );

    const isDelayFertilizerApplicationDisplayed = this.delayFertilizerApplicationHelper(
      fieldRecommendation.waterSource,
      timingSplittingAndFertSources.growthDuration.activeTilleringHigh,
      parseInt(targetYield.recentYearsFarmLotDescription, 10)
    );

    const growthDuration = timingSplittingAndFertSources.growthDuration;

    const farmingPracticesOutput: FarmingRecommendationPracticesOutputModel = {
      isSprayInsecticideDisplayed: isSprayInsecticideDisplayed ? YesNo.YES : notDisplayed,
      isWeedManagementDisplayed: isWeedManagementDisplayed ? YesNo.YES : notDisplayed,
      isControlIrrigationDisplayed: isControlIrrigationDisplayed ? YesNo.YES : notDisplayed,
      isQualitySeedsDisplayed: qualitySeedsValue > 0 ? qualitySeedsValue : notDisplayed,
      isTwentyOneDaysDisplayed: isTwentyOneDaysDisplayed ? YesNo.YES : notDisplayed,
      isWaterManagementDisplayed: isWaterManagementDisplayed ? YesNo.YES : notDisplayed,
      isZincDeficientDisplayed: isZincDeficientDisplayed ? YesNo.YES : notDisplayed,
      isIrrigateAtFloweringDisplayed: isIrrigateAtFloweringDisplayed ? YesNo.YES : notDisplayed,
      isDelayFertilizerApplicationDisplayed: isDelayFertilizerApplicationDisplayed ? YesNo.YES : notDisplayed,

      qualitySeeds: qualitySeedsValue,
      qualitySeedsLowerLimit: this.qualitySeedsLowerLimit,
      qualitySeedsUpperLimit: this.qualitySeedsUpperLimit,
      fertilizerDelayManagement: this.getFertilizerDelay(
        isDelayFertilizerApplicationDisplayed,
        growthDuration.activeTilleringLow,
        growthDuration.panicleInitiationHigh,
      )

    };
    return farmingPracticesOutput;
  }

}
