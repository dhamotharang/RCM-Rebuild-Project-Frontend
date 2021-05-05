export interface TargetYieldModel {
    timesPlantInAYear: string;
    establishment: string;
    sowingDate: Date;
    seedlingAge: string;
    varietyType: string
    specifiedVariety: string;
    varietyName: number;
    growthDuration: string;
    kilogram: number;
    noOfSacks: number;
    weightOfSack: number;
    previousVariety: string;
    upcomingSeasonSeedSource: string;
    seedSource: string;
    recentYearsFarmLotDescription: string;
    maxReportedYield: number;
    seedRate: number;
    seedRateKgHa: number;

    // output
    targetYieldSackCount: number;
    targetYieldKgPerSack: number;
    freshWeightOutput: number;
    dryWeightOutput: number;
    previousYield: number;
    varietyNameLabel: string;
    season: number;
    potentialYieldOutput: number;
    normalFreshWeight: number;
    normalDryWeight: number;
    estimatedHarvestMonth: string;
}

