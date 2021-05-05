import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { take } from 'rxjs/operators';
import { UserAccessModel } from 'src/app/login/models/user-access.model';
import { LocationStorageService } from 'src/app/offline-management/services/location-storage.service';
import { FormMode } from '../enum/mode.enum';
import {
  convertBarangayModelToDropdownModel,
  convertMunicipalityModelToDropdownModel,
  convertProvinceModelToDropdownModel,
  convertRegionModelToDropdownModel,
} from '../helper';
import { AddressDataModel } from '../models/address-data.model';
import { LocationFormModel } from '../models/location-form.model';
import { LocationService } from '../service/location.service';

@Component({
  selector: 'app-address-form-control',
  templateUrl: './address-form-control.component.html',
  styleUrls: ['./address-form-control.component.scss'],
})
export class AddressFormControlComponent implements OnInit {
  constructor(
    private locationService: LocationService,
    private offlineLocationStorage: LocationStorageService
  ) {}

  @Input() hideBarangay: boolean;
  @Input()
  public disableValidation: boolean;
  @Input() mode: FormMode;

  /** enables location component to use offline location data */
  @Input() offlineEnabled: boolean;

  private _address: LocationFormModel;
  @Input() set address(value: LocationFormModel) {
    this._address = value;
    if (this.formGroupReady) {
      this.loadAddress();
    }
  }
  get address(): LocationFormModel {
    return this._address;
  }

  private enableDisableFormInputs() {
    if (!this.formGroupReady) {
      return;
    }

    if (this.disabled) {
      this.formGroup.get('region').disable();
      this.formGroup.get('province').disable();
      this.formGroup.get('municipality').disable();
      this.formGroup.get('barangay').disable();
    } else {
      if (this.userAccess) {
        if (this.userAccess.isAdmin || this.userAccess.isNational) {
          this.formGroup.get('region').enable();
        } else {
          this.formGroup.get('region').disable();
        }

        if (
          this.userAccess.isAdmin ||
          this.userAccess.isNational ||
          this.userAccess.isRegionalDataAdmin ||
          this.userAccess.isRegional
        ) {
          this.formGroup.get('province').enable();
        } else {
          this.formGroup.get('province').disable();
        }

        if (
          this.userAccess.isAdmin ||
          this.userAccess.isNational ||
          this.userAccess.isRegionalDataAdmin ||
          this.userAccess.isRegional ||
          this.userAccess.isProvincial
        ) {
          this.formGroup.get('municipality').enable();
        } else {
          this.formGroup.get('municipality').disable();
        }

        
        if (
          this.userAccess.isAdmin ||
          this.userAccess.isNational ||
          this.userAccess.isRegionalDataAdmin ||
          this.userAccess.isRegional ||
          this.userAccess.isProvincial ||
          this.userAccess.isMunicipal
        ) {
          this.formGroup.get('barangay').enable();
        } else {
          this.formGroup.get('barangay').disable();
        }

      } else {
        this.formGroup.get('region').enable();
        this.formGroup.get('province').enable();
        this.formGroup.get('municipality').enable();
        this.formGroup.get('barangay').enable();
      }
    }
  }

  private _disabled: Boolean;

  @Input() set disabled(value) {
    this._disabled = value;
    this.enableDisableFormInputs();
  }

  get disabled() {
    return this._disabled;
  }

  private _userAccess: UserAccessModel;

  @Input() set userAccess(userAccess: UserAccessModel) {
    this._userAccess = userAccess;
    this.enableDisableFormInputs();
  }

  get userAccess(): UserAccessModel {
    return this._userAccess;
  }
  @Input() allBarangayOptionEnabled: boolean;

  @Output() locationChanged = new EventEmitter<LocationFormModel>();

  public locationData = {} as AddressDataModel;

  public formGroupReady = false;
  async ngOnInit() {
    if (this.offlineEnabled) {
      const res = await this.offlineLocationStorage.getRegionData();

      this.locationData = {
        ...this.locationData,
        regions: res.map((region) => convertRegionModelToDropdownModel(region)),
        provinces: [],
        municipalities: [],
        barangays: [],
      };
    } else {
      const res = await this.locationService.getRegionsApi().toPromise();
      this.locationData = {
        ...this.locationData,
        regions: res.map((region) => convertRegionModelToDropdownModel(region)),
        provinces: [],
        municipalities: [],
        barangays: [],
      };
    }

    let validators: ValidatorFn[] = [];
    let brgyValidators: ValidatorFn[] = [];
    if (!this.disableValidation) {
      validators.push(Validators.required);
      if (!this.hideBarangay) {
        brgyValidators.push(Validators.required);
      }
    }

    if (!this.formGroup) {
      this.formGroup = new FormGroup({
        region: new FormControl(null, validators),
        province: new FormControl(null, validators),
        municipality: new FormControl(null, validators),
        barangay: new FormControl(null, brgyValidators),
      });
    } else {
      this.formGroup.addControl('region', new FormControl(null, validators));
      this.formGroup.addControl('province', new FormControl(null, validators));
      this.formGroup.addControl(
        'municipality',
        new FormControl(null, validators)
      );
      this.formGroup.addControl(
        'barangay',
        new FormControl(null, brgyValidators)
      );
    }

    this.formGroupReady = true;

    this.enableDisableFormInputs();
    if (this.address) {
      this.loadAddress();
    }

    if (this.disabled) {
      this.formGroup.get('region').disable();
      this.formGroup.get('province').disable();
      this.formGroup.get('municipality').disable();
      this.formGroup.get('barangay').disable();
    }
  }

  private async loadAddress() {
    const provinces = await this.locationService
      .getRegionProvinces(this.address.regionId)
      .toPromise();
    const municipalities = await this.locationService
      .getProvinceMunicipalities(this.address.provinceId)
      .toPromise();
    const barangays = await this.locationService
      .getMunicipalityBarangays(this.address.municipalityId)
      .toPromise();

    this.locationData = {
      ...this.locationData,
      provinces: provinces.map((province) =>
        convertProvinceModelToDropdownModel(province)
      ),
      municipalities: municipalities.map((municipality) =>
        convertMunicipalityModelToDropdownModel(municipality)
      ),
      barangays: barangays.map((barangay) =>
        convertBarangayModelToDropdownModel(barangay)
      ),
    };

    setTimeout(() => {
      this.formGroup.patchValue({
        region: this.address.regionId,
        province: this.address.provinceId,
        municipality: this.address.municipalityId,
        barangay: this.address.barangayId,
      });
    });
    this.locationValuesChanged();
  }
  @Input() formGroup: FormGroup;

  public onRegionChanged(regionId: number) {
    if (regionId > 0) {
      if (this.offlineEnabled) {
        this.offlineLocationStorage
          .getProvinceDataByRegion(regionId)
          .then((res) => {
            this.locationData = {
              ...this.locationData,
              provinces: res.map((province) =>
                convertProvinceModelToDropdownModel(province)
              ),
              municipalities: [],
              barangays: [],
            };
          });
      } else {
        this.locationService
          .getRegionProvinces(regionId)
          .pipe(take(1))
          .subscribe((res) => {
            this.locationData = {
              ...this.locationData,
              provinces: res.map((province) =>
                convertProvinceModelToDropdownModel(province)
              ),
              municipalities: [],
              barangays: [],
            };
          });
      }
    }

    this.locationValuesChanged();
  }

  public onProvinceChange(provinceId: number) {
    if (provinceId > 0) {
      if (this.offlineEnabled) {
        this.offlineLocationStorage
          .getMunicipalitiesByProvince(provinceId)
          .then((res) => {
            this.locationData = {
              ...this.locationData,
              municipalities: res.map((municipality) => ({
                label: municipality.label,
                value: Number.parseInt(municipality.value),
              })),
              barangays: [],
            };
          });
      } else {
        this.locationService
          .getProvinceMunicipalities(provinceId)
          .pipe(take(1))
          .subscribe((res) => {
            this.locationData = {
              ...this.locationData,
              municipalities: res.map((municipality) =>
                convertMunicipalityModelToDropdownModel(municipality)
              ),
              barangays: [],
            };
          });
      }
    }
    this.locationValuesChanged();
  }

  public onMunicipalityChange(municipalityId) {
    if (!this.hideBarangay && municipalityId > 0) {
      if (this.offlineEnabled) {
        this.offlineLocationStorage
          .getBarangayByMunicipality(municipalityId)
          .then((res) => {
            this.locationData = {
              ...this.locationData,
              barangays: res.map((barangay) => ({
                label: barangay.label,
                value: Number.parseInt(barangay.value),
              })),
            };
          });
      } else {
        this.locationService
          .getMunicipalityBarangays(municipalityId)
          .pipe(take(1))
          .subscribe((res) => {
            this.locationData = {
              ...this.locationData,
              barangays: res.map((barangay) =>
                convertBarangayModelToDropdownModel(barangay)
              ),
            };
          });
      }
    }
    this.locationValuesChanged();
  }

  public onBarangayChange(barangayId) {
    this.locationValuesChanged();
  }

  private handleBarangayData(res) {
    this.locationData = {
      ...this.locationData,
      barangays: res.map((barangay) =>
        convertBarangayModelToDropdownModel(barangay)
      ),
    };
  }

  public locationValuesChanged() {
    const regionId = this.formGroup.get('region').value;
    const provinceId = this.formGroup.get('province').value;
    const municipalityId = this.formGroup.get('municipality').value;
    const barangayId = this.formGroup.get('barangay').value;

    let region = '';
    let province = '';
    let municipality = '';
    let barangay = '';

    if (
      this.locationData.regions &&
      this.locationData.regions.find((r) => r.value === regionId)
    ) {
      region = this.locationData.regions.find(
        (region) => region.value === regionId
      ).label;
    }

    if (
      this.locationData.provinces &&
      this.locationData.provinces.find((p) => p.value === provinceId)
    ) {
      province = this.locationData.provinces.find(
        (province) => province.value === provinceId
      ).label;
    }

    if (
      this.locationData.municipalities &&
      this.locationData.municipalities.find((m) => m.value === municipalityId)
    ) {
      municipality = this.locationData.municipalities.find(
        (municipality) => municipality.value === municipalityId
      ).label;
    }

    if (
      this.locationData.barangays &&
      this.locationData.barangays.find((b) => b.value === barangayId)
    ) {
      barangay = this.locationData.barangays.find(
        (barangay) => barangay.value === barangayId
      ).label;
    }

    const location = {
      regionId: regionId,
      provinceId: provinceId,
      municipalityId: municipalityId,
      barangayId: barangayId,

      regionName: region,
      provinceName: province,
      municipalityName: municipality,
      barangayName: barangay,
    };
    this.locationChanged.emit(location);
  }

  public clear() {
    this.formGroup.get('barangay').reset();
    this.formGroup.get('municipality').reset();
    this.formGroup.get('province').reset();
    this.formGroup.get('region').reset();
  }
}
