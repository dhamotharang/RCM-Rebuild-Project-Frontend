export interface TranslationModel {
    COMMON: Common;
    FARM_LOT: FarmLot;
    TARGET_YIELD: TargetYield;
    FERTILIZER_RATES: FertilizerRates;
    TIMING_AND_SPLITTING: TimingAndSplitting;
    OTHER_CROP_MANAGEMENT: OtherCropManagement;
    RECOMMENDATION_SUMMARY: RecommendationSummary;
    BUTTON: Button;
    NUMBER_AND_WEIGHT_OF_SACK: NumberAndWeightOfSack;
    NUMBER_OF_SACKS: NumberOfSacks;
    WEIGHT_OF_SACK: TargetYieldWeightOfSack;
    PREVIOUS_VARIETY_TYPE: PreviousVarietyType;
    UPCOMING_SEED_SOURCE: PreviousSeedSource;
    PREVIOUS_SEED_SOURCE: PreviousSeedSource;
    WATER: Water;
    INTRO: string;
    OUTPUT: Output;
}

export interface Button {
    GENERATE_RECOMMENDATION: string;
    VIEW_RECOMMENDATION: string;
    DOWNLOAD_AS_PDF: string;
    SAVE: string;
}

export interface Common {
    NAME: string;
    ANSWER: CommonAnswer;
    OTHERS_PLEASE_SPECIFY: string;
    UNIT: Unit;
    AND: string;
    NEXT: string;
    EDIT: string;
    EDIT_FORM: EditForm;
    VALIDATION: CommonValidation;
    LANGUAGE: string;
    MONTH: Month;
    WATER_SOURCE: WaterSource;
    SEED_SOURCE_ANSWER: SeedSourceAnswer;
    VARIETY_TYPE: VarietyType;
    SEEDLING_AGE: CommonSeedlingAge;
    SEEDLING: string;
    NUMBER_OF_SACKS: string;
    WEIGHT_OF_SACK: string;
    FRESH_WEIGHT: string;
    DRY_WEIGHT: string;
    OF: string;
    SACKS_AT: string;
    CROP_ESTABLISHMENT: CropEstablishment;
    TARGET_YIELD: string;
    CROP_ESTABLISHMENT_SHORT_LABEL: CropEstablishmentShortLabel;
    CROP_ESTABLISHMENT_ACRONYM: CropEstablishmentShortLabel;
    PRACTICE_SAFE_AWD: string;
    SEED_BED: string;
}

export interface CommonAnswer {
    NO: string;
    YES: string;
}

export interface CropEstablishment {
    MANUAL: string;
    MECHANICAL: string;
    WET: string;
    DRY: string;
}

export interface CropEstablishmentShortLabel {
    TRANSPLANTING: string;
    SOWING: string;
    EMERGENCE: string;
}

export interface EditForm {
    HEADING: string;
    BODY: string;
    CANCEL_BUTTON: string;
}

export interface Month {
    JANUARY: string;
    FEBRUARY: string;
    MARCH: string;
    APRIL: string;
    MAY: string;
    JUNE: string;
    JULY: string;
    AUGUST: string;
    SEPTEMBER: string;
    OCTOBER: string;
    NOVEMBER: string;
    DECEMBER: string;
}

export interface CommonSeedlingAge {
    EARLY_SEEDLING_AGE: string;
    MIDDLE_SEEDLING_AGE: string;
    LATE_SEEDLING_AGE: string;
}

export interface SeedSourceAnswer {
    PURCHASE_CERTIFIED_SEED: string;
    QUALITY_SEED: string;
    FIRST_HARVEST_SEED: string;
    HOME_SAVED_SEED: string;
}

export interface Unit {
    HECTARES: string;
    HA: string;
    SQUARE_METER: string;
    KG_PER_HECTARE: string;
    TON_PER_HECTARE: string;
    KG_PER_SACK: string;
    BAGS_PER_HECTARE: string;
    HECTARE: string;
    BAG: string;
    BAGS: string;
    KG: string;
}

export interface CommonValidation {
    REQUIRED: string;
    REQUIRED_SECONDARY: string;
}

export interface VarietyType {
    INBRED: string;
    HYBRID: string;
}

export interface WaterSource {
    LABEL: string;
    IRRIGATED: string;
    RAINFED: string;
}

export interface FarmLot {
    FARM_LOT_SIZE: string;
    FARM_LOT_DETAILS: string;
    USE_WHOLE_FARM_LOT_SIZE: string;
    SELECT_FARM_LOT_SIZE: string;
    DA_PROGRAM_QUESTION: string;
    PLEASE_SPECIFY_PROGRAM_OR_PROJECT: string;
    FARM_DESCRIPTION_IN_UPCOMING_SEASON_QUESTION: string;
    DO_YOU_USE_PUMP_QUESTION: string;
    DO_YOU_HAVE_ACCESS_TO_PUMP_QUESTION: string;
    INPUT_SIZE: string;
}

export interface FertilizerRates {
    RICE_CROP: RiceCrop;
    HARVEST_TYPE: HarvestType;
    NUMBER_AND_WEIGHT_OF_SACKS_GROUP: NumberAndWeightOfSacksGroup;
    NUMBER_OF_SACKS: FertilizerRatesNumberOfSacks;
    WEIGHT_OF_SACK: FertilizerRatesWeightOfSack;
    WILL_APPLY_ORGANIC_FERTILIZER: WillApplyOrganicFertilizer;
    ORGANIC_FERTILIZER_BAG_COUNT: OrganicFertilizerBagCount;
    TOTAL_NUMBER_OF_BAGS: PreviousSeedSource;
    TYPICAL_WEIGHT_OF_BAG: PreviousSeedSource;
    INTRO: string;
    OUTPUT_SUMMARY_INTRO: FertilizerRatesOutputSummaryIntro;
    OUTPUT_SUMMARY: string;
}

export interface HarvestType {
    QUESTION: string;
    ANSWER: HarvestTypeAnswer;
}

export interface HarvestTypeAnswer {
    MANUAL_HARVEST: string;
    REAPER: string;
    COMBINE_HARVEST: string;
}

export interface NumberAndWeightOfSacksGroup {
    QUESTION: string;
    VALIDATION: NumberAndWeightOfSacksGroupValidation;
}

export interface NumberAndWeightOfSacksGroupValidation {
    MIN: string;
    MAX: string;
}

export interface FertilizerRatesNumberOfSacks {
    QUESTION: string;
    VALIDATION: PurpleVALIDATION;
}

export interface PurpleVALIDATION {
    MIN: string;
}

export interface OrganicFertilizerBagCount {
    QUESTION: string;
    VALIDATION: OrganicFertilizerBagCountValidation;
}

export interface OrganicFertilizerBagCountValidation {
    MIN_AND_MAX: string;
}

export interface FertilizerRatesOutputSummaryIntro {
    TARGET_YIELD_FRESH_WEIGHT: string;
    TARGET_YIELD_AT_14_MOISTURE: string;
    RICE_CROP_PER_YEAR: string;
}

export interface RiceCrop {
    QUESTION: string;
    ANSWER: RiceCropAnswer;
}

export interface RiceCropAnswer {
    RICE: string;
    CORN: string;
    LEGUME: string;
    VEGETABLE_OR_MELON: string;
    BELL_PEPPER_OR_EGGPLANT: string;
    TOMATO: string;
    TOBACCO: string;
    NO_CROP: string;
}

export interface PreviousSeedSource {
    QUESTION: string;
}

export interface FertilizerRatesWeightOfSack {
    VALIDATION: OrganicFertilizerBagCountValidation;
}

export interface WillApplyOrganicFertilizer {
    QUESTION: string;
    ANSWER: CommonAnswer;
}

export interface NumberAndWeightOfSack {
    QUESTION: string;
    NOTE: string;
    VALIDATION: NumberAndWeightOfSacksGroupValidation;
    WARNING: string;
}

export interface NumberOfSacks {
    VALIDATION: FluffyVALIDATION;
}

export interface FluffyVALIDATION {
    REQUIRED: string;
    MIN: string;
}

export interface OtherCropManagement {
    INSECTICIDE_APPLICATION: PreviousSeedSource;
    SYNCRONIZATION: PreviousSeedSource;
    WEED_CONTROL: WeedControl;
    OBSERVATION: Observation;
}

export interface Observation {
    QUESTION: string;
    ANSWER: ObservationAnswer;
}

export interface ObservationAnswer {
    PROFUSE_GROWTH: string;
    AN_OILY_FILM: string;
    STANDING_WATER: string;
    DUSTY_BROWN_SPOTS: string;
    NONE: string;
}

export interface WeedControl {
    QUESTION: string;
    ANSWER: WeedControlAnswer;
}

export interface WeedControlAnswer {
    PRE_EMERGENCE: string;
    POST_EMERGENCE: string;
    HAND_WEEDING: string;
    WATER_MANAGEMENT: string;
}

export interface Output {
    THE_TARGET_YIELD_FOR_YOUR: string;
    HECTARE: string;
    FARM_LOT_IS: string;
    SACKS_AT: string;
    TON_PER_HA_FRESH_WEIGHT: string;
    TON_PER_HA_DRY_WEIGHT: string;
}

export interface PreviousVarietyType {
    QUESTION: string;
    VALIDATION: PreviousVarietyTypeValidation;
}

export interface PreviousVarietyTypeValidation {
    REQUIRED: string;
}

export interface RecommendationSummary {
    FARM_LOT_NAME: string;
    FARM_LOT_LOCATION: string;
    FARMER_NAME: string;
    DATE_GENERATED: string;
    WATER_REGIME: string;
    CROP_ESTABLISHMENT: string;
    VARIETY: string;
    SOWING_DATE: string;
    NOTE: string;
    WITH_PUMP: string;
    NO_PUMP: string;
}

export interface TargetYield {
    CROPS_PER_YEAR: CropsPerYear;
    CROP_ESTABLISHMENT: PreviousSeedSource;
    SOWING_DATE: SowingDate;
    SEEDLING_AGE: TargetYieldSeedlingAge;
    SEED_RATE: SeedRate;
    VARIETY_TYPE: PreviousVarietyType;
    VARIETY_NAME: VarietyName;
    SPECIFIED_VARIETY_NAME: PreviousVarietyType;
    GROWTH_DURATION: GrowthDuration;
    NUMBER_AND_WEIGHT_OF_SACK: NumberAndWeightOfSack;
    NUMBER_OF_SACKS: NumberOfSacks;
    WEIGHT_OF_SACK: TargetYieldWeightOfSack;
    PREVIOUS_VARIETY_TYPE: PreviousVarietyType;
    UPCOMING_SEED_SOURCE: PreviousSeedSource;
    PREVIOUS_SEED_SOURCE: PreviousSeedSource;
    WATER: Water;
    INTRO: string;
    OUTPUT: TargetYieldOutput;
    VALIDATION: PreviousVarietyTypeValidation;
}

export interface CropsPerYear {
    QUESTION: string;
    ANSWER: CropsPerYearAnswer;
}

export interface CropsPerYearAnswer {
    ONE: string;
    TWO: string;
    THREE: string;
}

export interface GrowthDuration {
    QUESTION: string;
    ANSWER: GrowthDurationAnswer;
    VALIDATION: PreviousVarietyTypeValidation;
}

export interface GrowthDurationAnswer {
    TRANSPLANTING: Ing;
    SEEDING: Ing;
}

export interface Ing {
    EARLY_GROWTH_DURATION: string;
    MIDDLE_GROWTH_DURATION: string;
    LATE_GROWTH_DURATION: string;
}

export interface TargetYieldOutput {
    THE_TARGET_YIELD_FOR_YOUR: string;
    FARM_LOT_IS: string;
    MOISTURE_CONTENT_14: string;
}

export interface TargetYieldSeedlingAge {
    QUESTION: string;
    VALIDATION: SeedlingAgeValidation;
}

export interface SeedlingAgeValidation {
    ONE: string;
}

export interface SeedRate {
    QUESTION: string;
    VALIDATION: SeedRateValidation;
    PLACEHOLDER: string;
}

export interface SeedRateValidation {
    REQUIRED: string;
    MIN: string;
    MAX: string;
}

export interface SowingDate {
    QUESTION: Question;
    VALIDATION: SowingDateValidation;
}

export interface Question {
    TRANSPLANTING: string;
    SEEDING: string;
}

export interface SowingDateValidation {
    REQUIRED: Question;
    INTERVIEW_NOT_MORE_THAN_EIGHT_DAYS_AFTER_SOWING_DATE: string;
}

export interface VarietyName {
    QUESTION: string;
    VALIDATION: PreviousVarietyTypeValidation;
    SEARCH: string;
    NO_VARIETY_FOUND: string;
}

export interface Water {
    QUESTION: string;
    ANSWER: WaterAnswer;
}

export interface WaterAnswer {
    ADEQUATE_WATER: string;
    SUBMERGENCE_STRESS: string;
    SHORTAGE_OF_WATER: string;
}

export interface TargetYieldWeightOfSack {
    VALIDATION: SeedRateValidation;
}

export interface TimingAndSplitting {
    INTRO: string;
    OUTPUT_SUMMARY_INTRO: TimingAndSplittingOutputSummaryIntro;
    NSOURCE: PreviousSeedSource;
    GROWTH_STAGES: GrowthStages;
    SEEDLING_AGE_OUTPUT_TABLE_LABEL: string;
    FERTILIZER_AMOUNT_FOR_SELECTED_FARM_SIZE: string;
    TABLE_HEADING: string;
}

export interface GrowthStages {
    LABEL: string;
    EARLY: string;
    ACTIVE_TILLERING: string;
    PANICLE_INITIATION: string;
    HEADING: string;
    HARVEST: string;
}

export interface TimingAndSplittingOutputSummaryIntro {
    CROP_ESTABLISHMENT_METHOD: string;
    SOWING_DATE_IN_SEEDBED: string;
    SOWIND_DATE_IN_FARM_LOT: string;
    APPROXIMATE_SEEDLING_AGE: string;
    VARIETY_TYPE: string;
}

export interface FarmingPracticesModel {
    PEST_MANAGEMENT_HEADER: string;
    PEST_MANAGEMENT_BODY: string;
    WEED_MANAGEMENT: string;
    ALTERNATE_IRRIGATION_HEADER: string;
    ALTERNATE_IRRIGATION_BODY: string;
    QUALITY_MANAGEMENT: QualitySeedsModel;
    SEEDLING_DAYS_HEADER: string;
    SEEDLING_DAYS_BODY: string;
    WATER_MANAGEMENT: string;
    ZINC_MANAGEMENT_HEADER: string;
    ZINC_MANAGEMENT_BODY: string;
    IRRIGATION_MANAGEMENT: string;
    DELAY_FERTILIZER_HEADER: string;
    DELAY_FERTILIZER: DelayFertilizerModel;
    HECTARE_FARM_LOT: string;
}

export interface QualitySeedsModel {
    USE_SEED_OLDER_THAN_39_DAYS_1: string;
    USE_SEED_OLDER_THAN_39_DAYS_2: string;
    USE_SEED_OLDER_THAN_39_DAYS_3: string;
    USE_QUALITY_SEEDS_GOOD_SNAIL_CONTROL: string;
    USE_QUALITY_SEEDS: string;
}

export interface DelayFertilizerModel {
    COMBINE_ALL_1: string;
    COMBINE_ALL_2: string;
    FOR_ACTIVE_AND_PANICLE_1: string;
    FOR_ACTIVE_AND_PANICLE_2: string;
    FOR_ACTIVE_AND_PANICLE_3: string;
    FOR_ACTIVE_TILLERING_1: string;
    FOR_ACTIVE_TILLERING_2: string;
    APPLY_FERTILIZER_FOR_PANICLE_INITIATION_1: string;
    APPLY_FERTILIZER_FOR_PANICLE_INITIATION_2: string;
}
