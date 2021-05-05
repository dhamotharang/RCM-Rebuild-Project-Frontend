import { Injectable } from '@angular/core';
import { AlternateIrrigationManagement } from "src/app/recommendation/enum/farming-practice/alternate-irrigation.management.enum";
import { FertilizerDelayManagement } from "src/app/recommendation/enum/farming-practice/fertilizer-delay-management.enum";
import { FiveCmIrrigationDept } from "src/app/recommendation/enum/farming-practice/five-cm-irrigation-dept.enum";
import { IrrigationManagement } from "src/app/recommendation/enum/farming-practice/irrigation-management.enum";
import { PestManagement } from "src/app/recommendation/enum/farming-practice/pest-management.enum";
import { Use21DaysOldSeedlingManagement } from "src/app/recommendation/enum/farming-practice/use-21-days-old-seedling-management.enum";
import { WeedManagement } from "src/app/recommendation/enum/farming-practice/weed-management.enum";
import { ZincApplicationManagement } from "src/app/recommendation/enum/farming-practice/zinc-application-management.enum";
import { QualitySeedManagement } from "src/app/recommendation/enum/farming-practice/quality-seed-management.enum";
import { FarmingPracticesModel, Common, DelayFertilizerModel, QualitySeedsModel } from 'src/app/recommendation/model/translation.model';
import { FarmingRecommendationPracticesOutputModel } from 'src/app/recommendation/model/farming-recommendation-practices-output.model';
import { FertilizerDelay } from 'src/app/recommendation/enum/fertilizer-delay.enum';
import { Establishment } from 'src/app/recommendation/enum/establishment.enum';

@Injectable({
  providedIn: 'root'
})
export class OtherManagementOutputService {

  public widthSize = "89%";

  public zincManagementHeader;
  public zincManagementBody;

  public qualitySeedsHeader;

  public seedlingDaysHeader;
  public seedlingDaysBody;

  public weedManagementHeader;

  public pestManagementHeader;
  public pestManagementBody;

  public waterManagementHeader;

  public alternateIrrigationHeader;
  public alternateIrrigationBody;

  public irrigationManagementHeader;

  public fertilizerDelayHeader;
  public fertilizerDelayBody;

  public daysAfterAcronym;
  public daysAfterLabel;

  public hectareFarmLotLabel: string;

  public setLanguage(
    dialectTranslation: { COMMON: Common; FARMING_PRACTICES: FarmingPracticesModel; },
    activeTilleringHighDisplay: number,
    panicleInitiationLowDay: number,
    panicleInitiationHighDay: number,
    farmingPractices: FarmingRecommendationPracticesOutputModel,
    cropEstablishment: Establishment,
    selectedFarmSize: number) {

    let commonDialect = dialectTranslation.COMMON;

    if (cropEstablishment === Establishment.MANUAL || cropEstablishment === Establishment.MECHANICAL) {
      this.daysAfterAcronym = commonDialect.CROP_ESTABLISHMENT_ACRONYM.TRANSPLANTING;
      this.daysAfterLabel = commonDialect.CROP_ESTABLISHMENT_SHORT_LABEL.TRANSPLANTING;
    } else if (cropEstablishment === Establishment.DRY) {
      this.daysAfterAcronym = commonDialect.CROP_ESTABLISHMENT_ACRONYM.SOWING;
      this.daysAfterLabel = commonDialect.CROP_ESTABLISHMENT_SHORT_LABEL.SOWING;
    } else {
      this.daysAfterAcronym = commonDialect.CROP_ESTABLISHMENT_ACRONYM.EMERGENCE;
      this.daysAfterLabel = commonDialect.CROP_ESTABLISHMENT_SHORT_LABEL.EMERGENCE;
    }

    let farmingPracticesDialect = dialectTranslation.FARMING_PRACTICES;

    this.zincManagementHeader = farmingPracticesDialect.ZINC_MANAGEMENT_HEADER;
    this.zincManagementBody = farmingPracticesDialect.ZINC_MANAGEMENT_BODY;

    this.seedlingDaysHeader = farmingPracticesDialect.SEEDLING_DAYS_HEADER;
    this.seedlingDaysBody = farmingPracticesDialect.SEEDLING_DAYS_BODY;

    this.weedManagementHeader = farmingPracticesDialect.WEED_MANAGEMENT;

    this.pestManagementHeader = farmingPracticesDialect.PEST_MANAGEMENT_HEADER + ' ' + this.daysAfterAcronym;
    this.pestManagementBody = farmingPracticesDialect.PEST_MANAGEMENT_BODY;

    this.waterManagementHeader = farmingPracticesDialect.WATER_MANAGEMENT;

    this.alternateIrrigationHeader = farmingPracticesDialect.ALTERNATE_IRRIGATION_HEADER;
    this.alternateIrrigationBody = farmingPracticesDialect.ALTERNATE_IRRIGATION_BODY;

    this.irrigationManagementHeader = farmingPracticesDialect.IRRIGATION_MANAGEMENT;

    this.fertilizerDelayHeader = farmingPracticesDialect.DELAY_FERTILIZER_HEADER;
    this.fertilizerDelayBody = this.getDelayFertilizerApplicationBody(farmingPractices.fertilizerDelayManagement,
      activeTilleringHighDisplay,
      panicleInitiationLowDay,
      panicleInitiationHighDay,
      farmingPracticesDialect.DELAY_FERTILIZER,
      this.daysAfterLabel);

    this.qualitySeedsHeader = this.getQualitySeedsHeader(
      farmingPracticesDialect.QUALITY_MANAGEMENT, 
      selectedFarmSize, 
      farmingPractices);

    this.hectareFarmLotLabel = farmingPracticesDialect.HECTARE_FARM_LOT;
  }

  public getQualitySeedsHeader(
    qualitySeeds: QualitySeedsModel, 
    selectedFarmSize: number, 
    farmingPractices: FarmingRecommendationPracticesOutputModel
  ): string {
    let qualitySeedsHeader = '';
    if (farmingPractices && farmingPractices.qualitySeeds > 0) {
      const space = " ";

      if (farmingPractices.qualitySeeds === 1) {
        qualitySeedsHeader = qualitySeeds.USE_SEED_OLDER_THAN_39_DAYS_1 + space + farmingPractices.qualitySeedsLowerLimit + space + qualitySeeds.USE_SEED_OLDER_THAN_39_DAYS_2 + space + farmingPractices.qualitySeedsUpperLimit + space + qualitySeeds.USE_SEED_OLDER_THAN_39_DAYS_3 + space + selectedFarmSize.toString() + space + this.hectareFarmLotLabel;
      }

      if (farmingPractices.qualitySeeds === 2) {
        qualitySeedsHeader = qualitySeeds.USE_QUALITY_SEEDS_GOOD_SNAIL_CONTROL + space + selectedFarmSize.toString() + space + this.hectareFarmLotLabel;
      }

      if (farmingPractices.qualitySeeds === 3) {
        qualitySeedsHeader = qualitySeeds.USE_QUALITY_SEEDS + space + selectedFarmSize.toString() + space + this.hectareFarmLotLabel;
      }
    }

    return qualitySeedsHeader;
  }

  public getDelayFertilizerApplicationBody(
    fertilizerDelay: number,
    activeTilleringHighDisplay: number,
    panicleInitiationLowDay: number,
    panicleInitiationHighDay: number,
    delayFertilizer: DelayFertilizerModel,
    daysAfterLabel: string
  ): string {

    let recommendationBodyPart1 = '';
    let recommendationBodyPart2 = '';
    const space = " ";

    if (fertilizerDelay === FertilizerDelay.COMBINE_ALL) {
      recommendationBodyPart1 = delayFertilizer.COMBINE_ALL_1 + space + String(activeTilleringHighDisplay) + space + daysAfterLabel + space + delayFertilizer.COMBINE_ALL_2;
    } else if (fertilizerDelay === FertilizerDelay.FOR_ACTIVE_AND_PANICLE) {
      recommendationBodyPart1 = delayFertilizer.FOR_ACTIVE_AND_PANICLE_1 + space + String(activeTilleringHighDisplay) + space + daysAfterLabel + space + delayFertilizer.FOR_ACTIVE_AND_PANICLE_2 + space + String(panicleInitiationLowDay) + space + delayFertilizer.FOR_ACTIVE_AND_PANICLE_3 + space + String(panicleInitiationHighDay) + space + daysAfterLabel;
    } else if (fertilizerDelay === FertilizerDelay.FOR_ACTIVE_TILLERING) {
      recommendationBodyPart1 = delayFertilizer.FOR_ACTIVE_TILLERING_1 + space + String(activeTilleringHighDisplay) + space + daysAfterLabel + delayFertilizer.FOR_ACTIVE_TILLERING_2;
    }

    recommendationBodyPart2 = delayFertilizer.APPLY_FERTILIZER_FOR_PANICLE_INITIATION_1 + space + String(activeTilleringHighDisplay) + space + daysAfterLabel + delayFertilizer.APPLY_FERTILIZER_FOR_PANICLE_INITIATION_2;

    return recommendationBodyPart1 + recommendationBodyPart2;
  }

  public buildOtherManagementOutputContent(
    isDisplayed: number,
    image: string,
    headerContent: string,
    bodyContent: string
  ) {

    let content;
    if (isDisplayed) {

      let textContent = "";
      if (headerContent && bodyContent) {
        textContent = (headerContent + "\n" + bodyContent + "\n");
      } else {
        textContent = (headerContent + "\n\n");
      }

      const imageWidthHeight = 25;

      let imageContent = {};
      if (image) {
        imageContent = { image: image, width: imageWidthHeight, height: imageWidthHeight };
      } else {
        imageContent = { text: image, width: imageWidthHeight, height: imageWidthHeight };
      }

      content = {
        widths: ['*', 'auto'],
        columns: [
          imageContent,
          {
            margin: [10, 0, 0, 0],
            text: textContent,
            fontSize: 9.5,
          }
        ],
        margin: [0, 0, 0, 8]
      };
    } else {
      content = "";
    }

    return content;
  }

  public zincApplication(
    isZincDeficientDisplayed: number,
  ) {
    return this.buildOtherManagementOutputContent(
      isZincDeficientDisplayed,
      ZincApplicationManagement.BASE64IMG,
      this.zincManagementHeader,
      this.zincManagementBody
    );
  }

  public qualitySeeds(
    isQualitySeedsDisplayed: number,
  ) {
    return this.buildOtherManagementOutputContent(
      isQualitySeedsDisplayed,
      QualitySeedManagement.BASE64IMG,
      this.qualitySeedsHeader,
      ''
    );
  }

  public use21DaysSeeds(
    isTwentyOneDaysDisplayed: number,
  ) {
    return this.buildOtherManagementOutputContent(
      isTwentyOneDaysDisplayed,
      Use21DaysOldSeedlingManagement.BASE64IMG,
      this.seedlingDaysHeader,
      this.seedlingDaysBody
    );
  }

  public handWeeding(
    isWeedManagementDisplayed: number,
  ) {
    return this.buildOtherManagementOutputContent(
      isWeedManagementDisplayed,
      WeedManagement.BASE64IMG,
      this.weedManagementHeader,
      ''
    );
  }

  public insecticideApplication(
    isSprayInsecticideDisplayed: number,
  ) {
    return this.buildOtherManagementOutputContent(
      isSprayInsecticideDisplayed,
      PestManagement.BASE64IMG,
      this.pestManagementHeader,
      this.pestManagementBody
    );
  }

  public keepFloodedWater(
    isWaterManagementDisplayed: number,
  ) {
    return this.buildOtherManagementOutputContent(
      isWaterManagementDisplayed,
      FiveCmIrrigationDept.BASE64IMG,
      this.waterManagementHeader,
      ''
    );
  }

  public irrigationPump(
    isControlIrrigationDisplayed: number,
  ) {
    return this.buildOtherManagementOutputContent(
      isControlIrrigationDisplayed,
      AlternateIrrigationManagement.BASE64IMG,
      this.alternateIrrigationHeader,
      this.alternateIrrigationBody
    );
  }

  public irrigateAtFlowering(
    isIrrigateAtFloweringDisplayed: number,
  ) {
    return this.buildOtherManagementOutputContent(
      isIrrigateAtFloweringDisplayed,
      IrrigationManagement.BASE64IMG,
      this.irrigationManagementHeader,
      ''
    );
  }

  public fertilizerApplicationDelay(
    isDelayFertilizerApplicationDisplayed: number,
  ) {
    return this.buildOtherManagementOutputContent(
      isDelayFertilizerApplicationDisplayed,
      FertilizerDelayManagement.BASE64IMG,
      this.fertilizerDelayHeader,
      this.fertilizerDelayBody
    );
  }

  constructor() { }
}
