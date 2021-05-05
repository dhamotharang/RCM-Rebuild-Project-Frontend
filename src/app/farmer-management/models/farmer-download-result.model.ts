import { FarmerDownloadModel } from './farmer-download.model';

export interface FarmerDownloadListResultModel {
  farmers: FarmerDownloadModel[];
  totalResultCount: number;
}
