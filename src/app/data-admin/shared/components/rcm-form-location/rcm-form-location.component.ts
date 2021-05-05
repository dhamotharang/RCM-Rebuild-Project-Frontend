import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import {
  PhLocationFormModel,
  DropdownModel,
  clearLocation,
} from '../../../../core/models/ph-location-form.model';

import { FormGroup, Validators } from '@angular/forms';
import { BarangayModel } from '../../../../core/models/barangay.model';
import { LocationService } from 'src/app/core/services/location.service';
import { AddressApiModel } from 'src/app/location/models/api';

@Component({
  selector: 'app-rcm-form-location',
  templateUrl: './rcm-form-location.component.html',
  styleUrls: ['./rcm-form-location.component.scss'],
})
export class RcmFormLocationComponent implements OnInit {
  @Input()
  public formGroup: FormGroup;
  @Input()
  public barangayHidden: boolean;
  @Input()
  public disabled: boolean;
  @Input()
  public isFarmerForm = true;
  @Input()
  public useAuthorization: boolean;

  private _address: AddressApiModel;

  public regions = [];
  public provinces = [];
  public municipalities = [];

  public barangays = [];

  @Input()
  public set address(address: AddressApiModel) {
    if (address) {
      this.setAddress(address);
    }

    this._address = address;
  }

  private async setAddress(address: AddressApiModel) {
    if (address.region_id) {
      const model = { ...this.locationFormModel };
      model.selectedRegion = address.region_id.toString();

      if (address.province_id) {
        model.selectedProvince = address.province_id.toString();
        if (address.municipality_id) {
          model.selectedMunicipality = address.municipality_id.toString();
          if (address.barangay_id) {
            model.selectedBarangay = address.barangay_id.toString();
          }
        }
      }

      await(this.locationChange(model));
    }
  }

  public get address() {
    return this._address;
  }

  public locationFormModel: PhLocationFormModel = {};

  @Output()
  public onLocationChange: EventEmitter<PhLocation> = new EventEmitter<
    PhLocation
  >();

  public async locationChange(model: PhLocationFormModel) {
    let phLocationModel = { ...model };
    if (phLocationModel.selectedMunicipality && !this.barangayHidden) {
      const barangays = await this.getBarangay(
        phLocationModel.selectedMunicipality
      );
      if (this.isFarmerForm) {
        this.formGroup.controls.barangay.setValidators(Validators.required);
        this.barangays = [...barangays];
      } else {
        this.formGroup.controls.barangay.setValidators(null);
        this.barangays = [{ label: 'All Barangays', value: '0' }, ...barangays];
      }

      phLocationModel.selectedBarangayLabel = phLocationModel.selectedBarangay ? this.barangays.find((barangay) => barangay.value === phLocationModel.selectedBarangay).label : '';
    } 
    
    if (phLocationModel.selectedProvince) {
      this.municipalities = await this.locationService.queryMunicipality(
        phLocationModel.selectedProvince
      );
      phLocationModel.selectedMunicipalityLabel = phLocationModel.selectedMunicipality ? this.municipalities.find((municipality) => municipality.value === phLocationModel.selectedMunicipality).label : '';
    } 
    
    if (phLocationModel.selectedRegion) {
      this.provinces = await this.locationService.queryProvince(
        phLocationModel.selectedRegion
      );
      phLocationModel.selectedProvinceLabel = phLocationModel.selectedProvince ? this.provinces.find((province) => province.value === phLocationModel.selectedProvince).label : '';
    }

    phLocationModel.selectedRegionLabel = phLocationModel.selectedRegion ? this.regions.find((region) => region.value === phLocationModel.selectedRegion).label : '';

    this.locationFormModel = phLocationModel;

    if (this.barangayHidden) {
      this.onLocationChange.emit({
        barangayId: null,
        municipalId: this.locationFormModel.selectedMunicipality,
        municipalityLabel: this.locationFormModel.selectedMunicipalityLabel,
        provinceId: this.locationFormModel.selectedProvince,
        provinceLabel: this.locationFormModel.selectedProvinceLabel,
        regionId: this.locationFormModel.selectedRegion,
        regionLabel: this.locationFormModel.selectedRegionLabel,
      });
    } else if (this.locationFormModel.selectedBarangay) {
      this.onLocationChange.emit({
        barangayId: this.locationFormModel.selectedBarangay,
        barangayLabel: this.locationFormModel.selectedBarangayLabel,
        municipalId: this.locationFormModel.selectedMunicipality,
        municipalityLabel: this.locationFormModel.selectedMunicipalityLabel,
        provinceId: this.locationFormModel.selectedProvince,
        provinceLabel: this.locationFormModel.selectedProvinceLabel,
        regionId: this.locationFormModel.selectedRegion,
        regionLabel: this.locationFormModel.selectedRegionLabel,
      });
    }
  }

  @Input()
  public useUserAddress: boolean;

  public disableValidation = false;

  constructor(
    public authService: AuthenticationService,
    public locationService: LocationService
  ) {}

  private async getBarangay(muncipalityId): Promise<DropdownModel[]> {
    let res = await this.locationService.queryBarangay(muncipalityId);

    return res;
  }

  public async ngOnInit() {
    const locs = await this.locationService.loadLocationLookups();

    this.regions = locs[0];
    const officeAddress = this.authService.loggedInUser
      ? this.authService.loggedInUser.officeAddress
      : null;
    let model: PhLocationFormModel;
    if (this.address) {
      model = {
        selectedRegion: this.address.region_id ? this.address.region_id.toString() : '0',
        selectedProvince: this.address.province_id ? this.address.province_id.toString() : '0',
        selectedMunicipality: this.address.municipality_id ? this.address.municipality_id.toString() : '0',
        selectedBarangay: this.address.barangay_id ? this.address.barangay_id.toString() : '0',
      };
    } else if (officeAddress && this.useUserAddress) {
      model = {
        selectedRegion: officeAddress.regionId.toString(),
        selectedProvince: officeAddress.provinceId.toString(),
        selectedMunicipality: officeAddress.municipalityId.toString(),
        selectedBarangay: officeAddress.barangayId ? officeAddress.barangayId.toString() : '0',
      };
      await this.locationChange(model);
    } else {
      model = {};

      this.locationFormModel = model;
    }

    if (model.selectedRegion) {
      const provinces = await this.locationService.queryProvince(
        model.selectedRegion
      );
      if (!this.isFarmerForm) {
        this.provinces = [{ label: 'All Provinces', value: '0' }, ...provinces];
      } else {
        this.provinces = provinces;
      }
    }

    if (model.selectedProvince) {
      const municipalities = await this.locationService.queryMunicipality(
        model.selectedProvince
      );
      if (!this.isFarmerForm) {
        this.municipalities = [
          { label: 'All Municipalities', value: '0' },
          ...municipalities,
        ];
      } else {
        this.municipalities = municipalities;
      }
    }

    if (model.selectedMunicipality) {
      const barangays = await this.getBarangay(
        model.selectedMunicipality.toString()
      );
      if (!this.isFarmerForm) {
        this.barangays = [{ label: 'All Barangays', value: '0' }, ...barangays];
      } else {
        this.barangays = barangays;
      }
    }

    this.locationFormModel = model;
  }

  public clear() {
    this.locationFormModel = clearLocation(
      this.locationFormModel,
      this.authService.isAdmin,
      this.authService.isRegionalDataAdmin,
      this.authService.isNational,
      this.authService.isRegional,
      this.authService.isProvincial
    );
  }
}

export interface PhLocation {
  barangayId: string;
  municipalId: string;
  provinceId: string;
  regionId: string;
  regionLabel?: string;
  municipalityLabel?: string;
  barangayLabel?: string;
  provinceLabel?: string;
}
