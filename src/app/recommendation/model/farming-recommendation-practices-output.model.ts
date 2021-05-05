export interface FarmingRecommendationPracticesOutputModel {
    isSprayInsecticideDisplayed?: number;
    isWeedManagementDisplayed?: number;
    isControlIrrigationDisplayed?: number;
    isQualitySeedsDisplayed?: number;
    isTwentyOneDaysDisplayed?: number;
    isWaterManagementDisplayed?: number;
    isZincDeficientDisplayed?: number;
    isIrrigateAtFloweringDisplayed?: number;
    isDelayFertilizerApplicationDisplayed?: number;

    qualitySeeds?: number;
    qualitySeedsUpperLimit?: number;
    qualitySeedsLowerLimit?: number;

    fertilizerDelayManagement?: number;

}
