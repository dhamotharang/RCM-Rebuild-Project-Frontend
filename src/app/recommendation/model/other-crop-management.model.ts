import { YesNo } from '../../v2/core/enums/yes-no.enum';
import { FarmingRecommendationPracticesOutputModel } from './farming-recommendation-practices-output.model';
export interface OtherCropManagementModel {
    applyInsecticide: YesNo;
    synchronizing: YesNo;

    preEmergence: YesNo;
    postEmergence: YesNo;
    handWeeding: YesNo;
    waterManagement: YesNo;

    profuseGrowth: YesNo
    oilyFilm: YesNo;
    standingWater: YesNo;
    dustyBrownSpots: YesNo;
    noFieldObservation: YesNo;

    zincObservation: Array<number>;
    weedControl: Array<number>;
}
