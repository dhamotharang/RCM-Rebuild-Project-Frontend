import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { PhLocationFormModel, DropdownModel } from '../../../core/models/ph-location-form.model';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-ph-location-form',
  templateUrl: './ph-location-form.component.html',
  styleUrls: ['./ph-location-form.component.scss'],
})
export class PhLocationFormComponent implements OnInit {

  private _locationFormModel: PhLocationFormModel;

  private _regions:DropdownModel[];
  private _provinces: DropdownModel[];

  @Input()
  public set regions(value: DropdownModel[]) {
    this._regions = value;
  }

  public get regions(): DropdownModel[] {
    return this._regions;
  }

  @Input()
  public set provinces(value:DropdownModel[]) {
    this._provinces = value;
    
  }

  public get provinces(): DropdownModel[] {
    return this._provinces;
  }

  
  @Input()
  public municipalities: DropdownModel[];
  
  @Input()
  public barangays: DropdownModel[];

  @Input()
  public set locationFormModel(value: PhLocationFormModel) {
    if (!value) throw new Error('PhLocationFormModel input is required');
    this._locationFormModel = value;

    if (this.isComponentReady) {
      if (!value.selectedRegion) {
        this.resetRegion();
      } else if (!value.selectedProvince) {
        this.resetProvince();
      } else if (!value.selectedMunicipality) {
        this.resetMunicipality();
      } else if (!value.selectedBarangay) {
        this.resetBarangay();
      }

      if (this.disabled === true || this.regionDisabled === true) {
        this.regionControl.disable();
      } else {
        this.regionControl.enable();
      }

      if (value.selectedRegion) {
        this.regionControl.setValue(value.selectedRegion);
        if (this.disabled === true || this.provinceDisabled === true) {
          this.provinceControl.disable();
        } else {
          this.provinceControl.enable();
        }

        if (value.selectedProvince) {
          this.provinceControl.setValue(value.selectedProvince);

          if (this.disabled === true || this.municipalityDisabled === true) {
            this.municipalityControl.disable();
          } else {
            this.municipalityControl.enable();
          }

          if (value.selectedMunicipality) {
            this.municipalityControl.setValue(value.selectedMunicipality);

            if (this.disabled === true || this.barangayDisabled === true) {
              this.barangayControl.disable();
            } else {
              this.barangayControl.enable();
            }

            if (value.selectedBarangay) {
              this.barangayControl.setValue(value.selectedBarangay);
            }
          }
        }
      }
    }
  }

  @Input()
  public disableValidation: boolean;

  public get locationFormModel(): PhLocationFormModel {
    return this._locationFormModel;
  }

  private _disabled: boolean;

  @Input()
  public set disabled(isDisabled: boolean) {

    if (this.isComponentReady) {
      if (isDisabled) {
        this.regionControl.disable();
      } else {
        this.regionControl.enable();
      }
    }
    this._disabled = isDisabled;
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
    if (this.isComponentReady) {
      if (value || this.disabled) {
        this.regionControl.disable();
      } else {
        this.regionControl.enable();
      }
    }
    this._regionDisabled = value;
  }

  public get regionDisabled(): boolean {
    return this._regionDisabled;
  }

  @Input()
  public set provinceDisabled(value: boolean) {
    if (this.isComponentReady) {
      if (value || !this.regionControl.valid || this.disabled) {
        this.provinceControl.disable();
      } else {
        this.provinceControl.enable();
      }
    }
    this._provinceDisabled = value;
  }
  public get provinceDisabled(): boolean {
    return this._provinceDisabled;
  }
  @Input()
  public set municipalityDisabled(value: boolean) {
    if (this.isComponentReady) {
      if (value || !this.provinceControl.valid || this.disabled) {
        this.municipalityControl.disable();
      } else {
        this.municipalityControl.enable();
      }
    }
    this._municipalityDisabled = value;
  }
  public get municipalityDisabled(): boolean {
    return this._municipalityDisabled;
  }
  @Input()
  public set barangayDisabled(value: boolean) {
    if (this.isComponentReady) {
      if (value || !this.municipalityControl.valid || this.disabled) {
        this.barangayControl.disable();
      } else {
        this.barangayControl.enable();
      }
    }

    this._barangayDisabled = value;
  }
  public get barangayDisabled(): boolean {
    return this._barangayDisabled;
  }
  @Input()
  public formGroup: FormGroup;


  @Output()
  public onSelectionChange = new EventEmitter<PhLocationFormModel>();

  private isComponentReady: boolean;

  ngOnInit() {

    if (!this.locationFormModel) {
      throw new Error('PhLocationFormModel input is required');
    }
    
    let validators: ValidatorFn[] = [];

    if (!this.disableValidation) {
      validators.push(Validators.required);
    }

    this.formGroup.addControl('region',
      new FormControl(null, validators));
    this.formGroup.addControl('province',
      new FormControl(null, validators));
    this.formGroup.addControl('municipality',
      new FormControl(null, validators));
    this.formGroup.addControl('barangay',
      new FormControl(null, validators));

    if (this.disabled || this._regionDisabled) {
      this.regionControl.disable();
    }

    if (!this._locationFormModel.selectedRegion || this._provinceDisabled || this.disabled) {
      this.provinceControl.disable();
    }

    if (!this._locationFormModel.selectedProvince || this._municipalityDisabled || this.disabled) {
      this.municipalityControl.disable();
    }

    if (!this._locationFormModel.selectedMunicipality || this._barangayDisabled || this.disabled) {
      this.barangayControl.disable();
    }


    this.isComponentReady = true;
  }

  public onRegionChange(value: string) {
    this._locationFormModel.selectedProvince = null;
    this._locationFormModel.selectedMunicipality = null;
    this._locationFormModel.selectedBarangay = null;

    this.municipalityControl.reset();
    this.barangayControl.reset();
    this.provinceControl.reset();

    this.barangayControl.disable();
    this.municipalityControl.disable();

    if (this.regionControl.valid) {
      this.provinceControl.enable();
    } else {
      this.provinceControl.disable();
    }

    this._locationFormModel.selectedRegion = value;
    this._locationFormModel.selectedRegionLabel = this.regions.find(r => r.value === value).label;
    this.onSelectionChange.emit(this._locationFormModel);
  }

  public onProvinceChange(value: string) {
    this._locationFormModel.selectedMunicipality = null;
    this._locationFormModel.selectedBarangay = null;

    this.municipalityControl.reset();
    this.barangayControl.reset();

    this.barangayControl.disable();

    if (this.provinceControl.valid) {
      this.municipalityControl.enable();
    } else {
      this.municipalityControl.disable();
    }

    this._locationFormModel.selectedProvince = value;
    this._locationFormModel.selectedProvinceLabel = this.provinces.find(p => p.value === value).label;
    this.onSelectionChange.emit(this._locationFormModel);
  }

  public onMunicipalityChange(value: string) {
    this._locationFormModel.selectedBarangay = null;

    this.barangayControl.reset();

    if (this.municipalityControl.valid) {
      this.barangayControl.enable();
    } else {
      this.barangayControl.disable();
    }

    this._locationFormModel.selectedMunicipality = value;
    this._locationFormModel.selectedMunicipalityLabel = this.municipalities.find(m => m.value === value).label;
    this.onSelectionChange.emit(this._locationFormModel);
  }

  public onBarangayChange(value: string) {
    this._locationFormModel.selectedBarangay = value;
    this._locationFormModel.selectedBarangayLabel = this.barangays.find(b => b.value === value).label;
    this.onSelectionChange.emit(this._locationFormModel);
  }

  public get regionControl(): FormControl {
    if (!this.formGroup) return null;
    return this.formGroup.get('region') as FormControl;
  }

  public get provinceControl(): FormControl {
    if (!this.formGroup) return null;
    return this.formGroup.get('province') as FormControl;
  }
  public get municipalityControl(): FormControl {
    if (!this.formGroup) return null;
    return this.formGroup.get('municipality') as FormControl;
  }
  public get barangayControl(): FormControl {
    if (!this.formGroup) return null;
    return this.formGroup.get('barangay') as FormControl;
  }

  private resetRegion() {
    this.regionControl.reset();
    this.provinceControl.reset();
    this.provinceControl.disable();
    this.municipalityControl.reset();
    this.municipalityControl.disable();
    this.barangayControl.reset();
    this.barangayControl.disable();
  }

  private resetProvince() {
    this.provinceControl.reset();
    this.municipalityControl.reset();
    this.municipalityControl.disable();
    this.barangayControl.reset();
    this.barangayControl.disable();
  }

  private resetMunicipality() {
    this.municipalityControl.reset();
    this.barangayControl.reset();
    this.barangayControl.disable();
  }

  private resetBarangay() {
    this.barangayControl.reset();
  }

  public regionCompareFn = (o1: any, o2: any) => {
    return o1 === this.locationFormModel.selectedRegion;
  }

  public provinceCompareFn = (o1: any, o2: any) => {
    return o1 === this.locationFormModel.selectedProvince;
  }

  public municipalityCompareFn = (o1: any, o2: any) => {
    return o1 === this.locationFormModel.selectedMunicipality;
  }
  
  public barangayCompareFn = (o1: any, o2: any) => {
    return o1 === this.locationFormModel.selectedBarangay;
  }
}
