import { KSplitModel } from '../k-split.model';
import { NRateModel } from '../n-rate.model';
import { OrganicFertilizerRateModel } from '../organic-fertilizer-rate.model';

export interface FertilizerRatesModel {
 
    previousCrop: number;
    harvestType: number;
    previousYieldSacks: number;
    previousYieldKg: number;
    previousFreshWeight: number;
    previousDryWeight: number;
    previousYieldConversion: number;
    willApplyOrganicFertilizer: boolean;
    organicBags: number;
    organicWeight: number;
    nRate: NRateModel;
    kSplit: KSplitModel;
    totalNRate: number;
    totalPRate: number;
    totalKRate: number;
    soilFertility: number;
    organicFertilizer: OrganicFertilizerRateModel;
    organicFertilizerConversion: number;
    organicFertilizerRate: number;
}
