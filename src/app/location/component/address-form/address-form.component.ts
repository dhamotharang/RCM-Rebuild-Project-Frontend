import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DropdownModel } from 'src/app/v2/core/models/dropdown.model';
import { FormMode } from '../../enum/mode.enum';
import { AddressDataModel } from '../../models/address-data.model';
import { LocationFormModel } from '../../models/location-form.model';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit {
  private _locationFormModel: LocationFormModel;
  private _data: AddressDataModel = {} as AddressDataModel;

  public barangays: DropdownModel[] = [];

  @Input() public set data(value: AddressDataModel) {
    if (this.barangayControl) {
      if (!value.barangays || value.barangays.length === 0) {
        if (this.allBarangayOptionEnabled) {
          this.barangays = [{ value: -1, label: 'All Barangays' }];
        } else {
          this.barangays = [];
        }
      } else {
        if (this.allBarangayOptionEnabled) {
          this.barangays = [
            { value: -1, label: 'All Barangays' },
            ...value.barangays,
          ];
        } else {
          this.barangays = value.barangays;
        }
      }
    }

    this._data = value;
    // this.enableDisableForm();
  }

  public get data() {
    return this._data;
  }

  @Input() allBarangayOptionEnabled: boolean;
  @Input() mode: FormMode;

  public get actualMode() {
    return this.mode ? this.mode : FormMode.material;
  }

  public formMode = FormMode;

  @Input()
  public disableValidation: boolean;

  public get locationFormModel(): LocationFormModel {
    return this._locationFormModel;
  }

  private _disabled: boolean;

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
  }


  public get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  public barangayHidden: boolean = false;

  private _regionDisabled: boolean;
  private _provinceDisabled: boolean;
  private _municipalityDisabled: boolean;
  private _barangayDisabled: boolean;

  @Input()
  public set regionDisabled(value: boolean) {
    this._regionDisabled = value;
  }

  public get regionDisabled(): boolean {
    return this._regionDisabled;
  }

  @Input()
  public set provinceDisabled(value: boolean) {
    this._provinceDisabled = value;
  }
  public get provinceDisabled(): boolean {
    return this._provinceDisabled;
  }
  @Input()
  public set municipalityDisabled(value: boolean) {
    this._municipalityDisabled = value;
  }
  public get municipalityDisabled(): boolean {
    return this._municipalityDisabled;
  }
  @Input()
  public set barangayDisabled(value: boolean) {
    this._barangayDisabled = value;
  }
  public get barangayDisabled(): boolean {
    return this._barangayDisabled;
  }
  @Input()
  public formGroup: FormGroup = new FormGroup({
    region: new FormControl(null, []),
    province: new FormControl(null, []),
    municipality: new FormControl(null, []),
    barangay: new FormControl(null, []),
  });

  ngOnInit() {}

  @Output()
  public onRegionChange = new EventEmitter();

  @Output()
  public onProvinceChange = new EventEmitter();

  @Output()
  public onMunicipalityChange = new EventEmitter();

  @Output()
  public onBarangayChange = new EventEmitter();

  public get regionControl(): FormControl {
    if (!this.formGroup || !this.formGroup.get('region')) return null;
    return this.formGroup.get('region') as FormControl;
  }

  public get provinceControl(): FormControl {
    if (!this.formGroup || !this.formGroup.get('province')) return null;
    return this.formGroup.get('province') as FormControl;
  }
  public get municipalityControl(): FormControl {
    if (!this.formGroup || !this.formGroup.get('municipality')) return null;
    return this.formGroup.get('municipality') as FormControl;
  }
  public get barangayControl(): FormControl {
    if (!this.formGroup || !this.formGroup.get('barangay')) return null;
    return this.formGroup.get('barangay') as FormControl;
  }

  private resetRegion() {
    this.regionControl.reset();
    this.provinceControl.reset();
    this.municipalityControl.reset();
    this.barangayControl.reset();
  }

  private resetProvince() {
    this.provinceControl.reset();
    this.municipalityControl.reset();
    this.barangayControl.reset();
  }

  private resetMunicipality() {
    this.municipalityControl.reset();
    this.barangayControl.reset();
  }

  private resetBarangay() {
    this.barangayControl.reset();
  }

  public regionChange(regionId: number) {
    this.onRegionChange.emit(regionId);
    this.resetProvince();
  }

  public provinceChange(provinceId: number) {
    this.onProvinceChange.emit(provinceId);
    this.resetMunicipality();
  }

  public municipalityChange(municipalityId: number) {
    this.onMunicipalityChange.emit(municipalityId);
    this.resetBarangay();
  }
}
