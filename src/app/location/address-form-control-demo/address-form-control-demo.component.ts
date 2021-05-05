import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormMode } from '../enum/mode.enum';
import { LocationFormModel } from '../models/location-form.model';

@Component({
  selector: 'app-address-form-control-demo',
  templateUrl: './address-form-control-demo.component.html',
  styleUrls: ['./address-form-control-demo.component.scss'],
})
export class AddressFormControlDemoComponent implements OnInit {

  constructor() { }

  public myFormGroup: FormGroup = new FormGroup({});
  public currentMode: FormMode = FormMode.material;

  public toggleMode() {
    if (this.currentMode === FormMode.material) {
      this.currentMode = FormMode.ionic;
    } else {
      this.currentMode = FormMode.material;
    }
  }

  public existingValueFormGroup: FormGroup = new FormGroup({});
  public exitingValueAddressModel: LocationFormModel = {
    regionId: 5,
    provinceId: 25,
    municipalityId: 487,
    barangayId: 7852
  }

  // CUSTOMIZATION
  public customizationFormGroup: FormGroup = new FormGroup({});
  public customizationLocationValue: LocationFormModel = {
    regionId: null,
    provinceId: null,
    municipalityId: null,
    barangayId: null
  }
  public customizationFormDisabled = false;
  public barangayVisible = true;

  public toggleInitialValue() {
    if (this.customizationLocationValue.regionId) {
      this.customizationLocationValue = {
        regionId: null,
        provinceId: null,
        municipalityId: null,
        barangayId: null
      }
    } else {
      this.customizationLocationValue = {
        regionId: 5,
        provinceId: 25,
        municipalityId: 487,
        barangayId: 7852
      }
    }
  }

  ngOnInit() {
    
  }

}
