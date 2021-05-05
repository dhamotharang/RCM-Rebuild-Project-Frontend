import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';


export interface OfflineDataModel {
    offlineFarmerData: FarmerApiModel[];
    dateDownloaded: Date;
}