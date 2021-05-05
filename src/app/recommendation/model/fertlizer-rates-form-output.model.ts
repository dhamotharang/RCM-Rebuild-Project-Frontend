import { PreviousCrop } from 'src/app/recommendation/enum/previous-crop.enum';
import { PreviousStraw } from '../enum/previous-straw.enum';
import { NRateModel } from './n-rate.model';
import { OrganicFertilizerRateModel } from './organic-fertilizer-rate.model';
import { KSplitModel } from './k-split.model';

export interface FertlizerRatesFormOutputModel {
    previousCrop: PreviousCrop;
    harvestType: PreviousStraw;
    immediateRiceHarvestSackCount: number;
    immediateRiceHarvestKgPerSack: number;
    previousFreshWeight: number;
    previousDryWeight: number;
    willApplyOrganicFertlizer: boolean;
    organicFertlizerBagCount?: number;
    organicFertlizerKgPerBag?: number;
    organicFertilizerRateConversion: number;

    //output
    nRate: NRateModel;
    kSplit: KSplitModel;
    totalNRate: number;
    totalPRate: number;
    totalKRate: number;
    soilFertility: number;
    organicFertilizer?: OrganicFertilizerRateModel;
}
