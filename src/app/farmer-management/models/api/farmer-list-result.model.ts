import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';

export interface FarmerListResultApiModel {
    farmers:FarmerApiModel[];
    totalResultCount: number;
}