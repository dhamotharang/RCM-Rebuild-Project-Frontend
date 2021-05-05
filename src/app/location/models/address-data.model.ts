import { DropdownModel } from 'src/app/v2/core/models/dropdown.model';

export interface AddressDataModel {
    regions: DropdownModel[];
    provinces: DropdownModel[];
    municipalities: DropdownModel[];
    barangays: DropdownModel[];
}