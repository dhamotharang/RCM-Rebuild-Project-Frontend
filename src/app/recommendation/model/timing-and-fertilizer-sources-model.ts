import { GrowthStageFertilizerRecommendationModel } from './growth-stage-fertilizer-recommendation-model';
import { GrowthDuration } from './growth-duration';
import { FertilizerName } from '../enum/fertilizer-name.enum';

export interface TimingAndFertilizerSourcesModel {
    growthStages: GrowthStageFertilizerRecommendationModel[];
    growthDuration: GrowthDuration;
    twentyOneDaysSeedling?: GrowthDuration;
    nSource?: number;
    fertilizerName?: FertilizerName;

    ATDaysColSize?: number;
    show21DaysSeedling?: boolean;
    fertTitleColSize?: number;
    showEarlyFert?: boolean;
    showMOPFert?: boolean;
    ureaAmmosul?: string;
    fertColSize?: number;
    pRate?: number;
    showHeading?: boolean;
    daysAfterLabel?: string;
    seedlingAgeOutputTableLabel?: string;
    showOutput?: boolean;
}
