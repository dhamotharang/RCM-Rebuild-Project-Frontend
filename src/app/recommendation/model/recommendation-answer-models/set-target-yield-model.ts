import { RiceCropPerYear } from '../../enum/rice-crop-per-year.enum';
import { Establishment } from '../../enum/establishment.enum';
import { Season } from '../../enum/season.enum';

export interface SetTargetYieldModel {
    cropsPerYear: RiceCropPerYear;
    cropEstablishment: Establishment;
    sowingDate: Date;
    seedlingAge: number;
    seedRate: number;
    varietyType: number
    varietyName: string;
    growthDuration: number;
    typicalYieldSacks: number;
    typicalYieldKg: number;
    previousVarietyType: number;
    upcomingSeedSource: number;
    previousSeedSource: number;
    water: number;
    
    sowingMonth: number;
    sowingDay: number;
    maxReportedYield: number;
    targetYieldSackCount: number;
    targetYieldKgPerSack: number;
    freshWeightOutput: number;
    dryWeightOutput: number;
    previousYield: number;
    seedRateKilogramPerHectare: number;
    season: Season,
    potentialYieldOutput: number;
    normalFreshWeight: number;
    normalDryWeight: number;
    varietyId: number;
    estimatedHarvestMonth: string;
}
