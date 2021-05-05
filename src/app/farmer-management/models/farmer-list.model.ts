import { FarmerModel } from './farmer.model';

export interface FarmerListModel {
    farmers: FarmerModel[];
    totalResultCount: number;
}