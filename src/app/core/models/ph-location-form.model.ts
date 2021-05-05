/** @deprecated */
export interface DropdownModel {
  label: string;
  value: string;
}

/** @deprecated */
export interface PhLocationFormModel {
  selectedRegion?: string;
  selectedProvince?: string;
  selectedMunicipality?: string;
  selectedBarangay?: string;    
  selectedRegionLabel?: string;
  selectedProvinceLabel?: string;
  selectedMunicipalityLabel?: string;
  selectedBarangayLabel?: string;
}
/** @deprecated */
export function clearLocation(locationModel: PhLocationFormModel, isDataAdminRole: boolean, isRegionalDataAdminRole: boolean, isNationalRole: boolean, isRegionalRole: boolean, isProvincialRole: boolean): PhLocationFormModel {
  let model = {...locationModel};
  if (isDataAdminRole || isNationalRole) {
    model.selectedBarangay = null;
    model.selectedMunicipality = null;
    model.selectedProvince = null;
    model.selectedRegion = null;
    model.selectedBarangayLabel = null;
    model.selectedMunicipalityLabel = null;
    model.selectedProvinceLabel = null;
    model.selectedRegionLabel = null;
  } else if (isRegionalDataAdminRole || isRegionalRole) {
    model.selectedBarangay = null;
    model.selectedProvince = null;
    model.selectedMunicipality = null;
    model.selectedBarangayLabel = null;
    model.selectedProvinceLabel = null;
    model.selectedMunicipalityLabel = null;
  } else if (isProvincialRole) {
    model.selectedBarangay = null;
    model.selectedMunicipality = null;
    model.selectedBarangayLabel = null;
    model.selectedMunicipalityLabel = null;
  }
  return model;
}

/** @deprecated */
export class PhLocationBase {
}