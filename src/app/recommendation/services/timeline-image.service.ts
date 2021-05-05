import { CustomDialectTranslationPipe } from 'src/app/recommendation/pipe/custom-dialect-translation.pipe';
import { Injectable } from '@angular/core';
import { TargetYieldModel } from '../model/target-yield.model';
import { TimingAndFertilizerSourcesModel } from '../model/timing-and-fertilizer-sources-model';
import { TimelineImageModel } from '../model/timeline-image.model';
import { Establishment } from '../enum/establishment.enum';
import { SeedlingAge } from '../enum/seedling-age.enum';
import { GrowthDuration } from '../enum/growth-duration.enum';
import { GrowthStageImageModel } from '../model/growth-stage-image.model';
import { EARLY_GROWTH_DAYS, MIDDLE_GROWTH_DAYS, LATE_GROWTH_DAYS, EARLY_TRANSPLANTING_GROWTH_DAYS, MIDDLE_TRANSPLANTING_GROWTH_DAYS, LATE_TRANSPLANTING_GROWTH_DAYS } from '../constant/growth-duration-days.constant';
import {
  EARLY_BASE64IMG,
  ACTIVE_TILLERING_BASE64IMG,
  PANICLE_INITIATION_BASE64IMG,
  HEADING_BASE64IMG,
  HARVEST_BASE64IMG
} from 'src/app/recommendation/constant/timeline-images.constant';
import { FarmingRecommendationPracticesOutputModel } from 'src/app/recommendation/model/farming-recommendation-practices-output.model';
import { take, map } from 'rxjs/operators';
import { GrowthStages, Common } from '../model/translation.model';

@Injectable({
  providedIn: 'root'
})
export class TimelineImageService {

  public daysAfterLabel: string;
  public practiceSafeAwdLabel: string;
  public seedBedLabel: string;
  public early: string;
  public activeTillering: string;
  public panicleInitiation: string;
  public heading: string;
  public harvest: string;
  public dialect: string;

  constructor(
    public customDialectTranslationPipe: CustomDialectTranslationPipe,
  ) { }

  public async setDaysAfterLabel(cropEstablishment: Establishment): Promise<void> {
    if (cropEstablishment) {
      return this.customDialectTranslationPipe.transform('COMMON', this.dialect).pipe(take(1),
        map((res: Common) => {
          if (cropEstablishment === Establishment.MANUAL || cropEstablishment === Establishment.MECHANICAL) {
            this.daysAfterLabel = res.CROP_ESTABLISHMENT_SHORT_LABEL.TRANSPLANTING;
          } else if (cropEstablishment === Establishment.WET) {
            this.daysAfterLabel = res.CROP_ESTABLISHMENT_SHORT_LABEL.SOWING;
          } else if (cropEstablishment === Establishment.DRY) {
            this.daysAfterLabel = res.CROP_ESTABLISHMENT_SHORT_LABEL.EMERGENCE;
          }

          this.practiceSafeAwdLabel = res.PRACTICE_SAFE_AWD;
          this.seedBedLabel = res.SEED_BED;
        })
      )
        .toPromise();
    }
    return Promise.resolve();
  }

  public async setGrowthStagesLabel(): Promise<void> {
    return this.customDialectTranslationPipe.transform('TIMING_AND_SPLITTING.GROWTH_STAGES', this.dialect).pipe(take(1),
      map((res: GrowthStages) => {
        this.early = res.EARLY;
        this.activeTillering = res.ACTIVE_TILLERING;
        this.panicleInitiation = res.PANICLE_INITIATION;
        this.heading = res.HEADING;
        this.harvest = res.HARVEST;
      })
    )
      .toPromise();
  }

  public async setLanguage(cropEstablishment: Establishment, dialect: string) {
    this.dialect = dialect;
    await this.setDaysAfterLabel(cropEstablishment);
    await this.setGrowthStagesLabel();
  }

  public generateTimelineImage(
    targetYieldModel: TargetYieldModel,
    fertilizerRecommendationModel: TimingAndFertilizerSourcesModel,
    farmingPractices: FarmingRecommendationPracticesOutputModel
  ) {
    const hasSeedbedCondition = targetYieldModel.establishment === Establishment.MANUAL.toString() ||
      targetYieldModel.establishment === Establishment.MECHANICAL.toString();
    const use21DayOldSeedlingAgeCondition = targetYieldModel.growthDuration === GrowthDuration.EARLY_GROWTH.toString() &&
      hasSeedbedCondition &&
      targetYieldModel.seedlingAge === SeedlingAge.LATE_SEEDLING_AGE.toString();


    const growthStagesModel = this.generateGrowthStagesModel(fertilizerRecommendationModel);
    const maxGrowthDays = this.getMaxDays(targetYieldModel);

    const timelineImage: TimelineImageModel = {
      growthStages: growthStagesModel,
      growthDuration: parseInt(targetYieldModel.growthDuration, 10),
      hasSeedbed: hasSeedbedCondition,
      use21DayOldSeedlingAge: use21DayOldSeedlingAgeCondition,
      showPracticeSafeAwd: farmingPractices.isControlIrrigationDisplayed,
      showKeepFloodedBelow5cm: farmingPractices.isWaterManagementDisplayed,
      daysAfterLabel: this.daysAfterLabel,
      practiceSafeAwdLabel: this.practiceSafeAwdLabel,
      maxDays: maxGrowthDays,
      showHandWeed: farmingPractices.isWeedManagementDisplayed,
      seedBedLabel: this.seedBedLabel
    };
    return timelineImage;
  }

  public getMaxDays(targetYield: TargetYieldModel) {
    let maxDays = 0;
    const cropEstablishment = parseInt(targetYield.establishment, 10);
    const growthDuration = parseInt(targetYield.growthDuration, 10);
    if (cropEstablishment === Establishment.MANUAL || cropEstablishment === Establishment.MECHANICAL) {
      if (growthDuration === GrowthDuration.EARLY_GROWTH) {
        maxDays = EARLY_TRANSPLANTING_GROWTH_DAYS;
      } else if (growthDuration === GrowthDuration.MIDDLE_GROWTH) {
        maxDays = MIDDLE_TRANSPLANTING_GROWTH_DAYS;
      } else if (growthDuration === GrowthDuration.LATE_GROWTH) {
        maxDays = LATE_TRANSPLANTING_GROWTH_DAYS;
      }
    } else {
      if (growthDuration === GrowthDuration.EARLY_GROWTH) {
        maxDays = EARLY_GROWTH_DAYS;
      } else if (growthDuration === GrowthDuration.MIDDLE_GROWTH) {
        maxDays = MIDDLE_GROWTH_DAYS;
      } else if (growthDuration === GrowthDuration.LATE_GROWTH) {
        maxDays = LATE_GROWTH_DAYS;
      }
    }

    return maxDays;
  }

  public generateGrowthStagesModel(fertilizerRecommendationModel: TimingAndFertilizerSourcesModel) {
    const growthDuration = fertilizerRecommendationModel.growthDuration;
    const growthStages: GrowthStageImageModel[] = [
      {
        stageName: 'early',
        stageNameLabel: this.early,
        dayStart: growthDuration.earlyLow === 'Basal' ? 0 : 0,
        dayEnd: growthDuration.earlyHigh,
        image: EARLY_BASE64IMG

      },
      {
        stageName: 'active-tillering',
        stageNameLabel: this.activeTillering,
        dayStart: growthDuration.activeTilleringLow,
        dayEnd: growthDuration.activeTilleringHigh,
        image: ACTIVE_TILLERING_BASE64IMG
      },
      {
        stageName: 'panicle-initiation',
        stageNameLabel: this.panicleInitiation,
        dayStart: growthDuration.panicleInitiationLow,
        dayEnd: growthDuration.panicleInitiationHigh,
        image: PANICLE_INITIATION_BASE64IMG
      },
      {
        stageName: 'heading',
        stageNameLabel: this.heading,
        dayStart: growthDuration.headingLow,
        dayEnd: growthDuration.headingHigh,
        image: HEADING_BASE64IMG
      },
      {
        stageName: 'harvest',
        stageNameLabel: this.harvest,
        dayStart: growthDuration.harvestLow,
        dayEnd: growthDuration.harvestHigh,
        image: HARVEST_BASE64IMG
      },
    ];

    return growthStages;
  }
}
