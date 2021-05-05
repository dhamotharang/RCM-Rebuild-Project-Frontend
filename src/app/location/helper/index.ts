import { DropdownModel } from 'src/app/v2/core/models/dropdown.model'
import { BarangayModel, MunicipalityModel, ProvinceModel, RegionModel } from '../models';

export const convertRegionModelToDropdownModel = (regionModel: RegionModel) => ({label: regionModel.label, value: regionModel.id} as DropdownModel);
export const convertProvinceModelToDropdownModel = (provinceModel: ProvinceModel) => ({label: provinceModel.label, value: provinceModel.id} as DropdownModel);
export const convertMunicipalityModelToDropdownModel = (municipalityModel: MunicipalityModel) => ({label: municipalityModel.label, value: municipalityModel.id} as DropdownModel);
export const convertBarangayModelToDropdownModel = (barangayModel: BarangayModel) => ({label: barangayModel.label, value: barangayModel.id});
