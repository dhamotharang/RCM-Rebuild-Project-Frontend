import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';

/** @deprecated use model inside OfflineManagementModule */
export interface OfflineDataModel {
    offlineFarmerData: FarmerApiModel[];
    dateDownloaded: Date;
}
