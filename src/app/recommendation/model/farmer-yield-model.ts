import { FarmerNormalYieldModel } from './farmer-normal-yield.model';
import { FarmerMaxReportedYieldModel } from './farmer-max-reported-yield.model';

export interface FarmerYieldModel {
    normal: FarmerNormalYieldModel,
    maxReported: FarmerMaxReportedYieldModel
}
