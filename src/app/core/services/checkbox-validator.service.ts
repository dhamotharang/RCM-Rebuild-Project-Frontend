import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class CheckboxValidatorService {

    constructor() { }

    public checkBoxValidator(minRequired): ValidatorFn {
        return function validate(formGroup: FormGroup) {
          let checked = 0;
    
          Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.controls[key];
    
            if (control.value === true) {
              checked++;
            }
          });
    
          if (checked < minRequired) {
            return {
              requireCheckboxToBeChecked: true,
            };
          }
    
          return null;
        };
    }
}