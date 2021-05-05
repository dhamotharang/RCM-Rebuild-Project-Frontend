import { FertilizerModel } from './fertilizer-model';

export interface GrowthStageFertilizerRecommendationModel {
    growthStageName: string;
    fertilizerSources: FertilizerModel[];
}
export function InitGrowthStageFertilizerRecommendationModel(): GrowthStageFertilizerRecommendationModel[] {
    return [
        {
            growthStageName: 'Early',
            fertilizerSources: [],
        },
        {
            growthStageName: 'Active Tillering',
            fertilizerSources: [],
        },
        {
            growthStageName: 'Panicle Initiation',
            fertilizerSources: [],
        },
        {
            growthStageName: 'Heading',
            fertilizerSources: [],
        }
    ];
};