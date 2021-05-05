import { FarmerDownloadApiModel } from './farmer-download-api.model';

export interface FarmerDownloadListResultApiModel {
    farmers: FarmerDownloadApiModel[];
    totalResultCount: number;
}