import { PreviousCrop } from 'src/app/recommendation/enum/previous-crop.enum';
import { PreviousStraw } from 'src/app/recommendation/enum/previous-straw.enum';

export interface FertilizerRateInputModel {
    previousCrop: PreviousCrop;
    harvestType: PreviousStraw;
    willApplyOrganicFertilizer: boolean;
    organicBags: number;
    organicWeight: number;
}
