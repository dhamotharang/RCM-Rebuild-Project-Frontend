import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

@Injectable({ providedIn: 'root' })

export class YieldCalculationValidationService {

  public isYieldValid (
    minReportedYield: number,
    reportedYield: number,
    maxReportedYield: number
  ): ValidatorFn {
    return (control: FormGroup) : ValidationErrors | null => {
        if (reportedYield < minReportedYield) {
          return { reportedYieldMin : true };
        }

        if (reportedYield > maxReportedYield) {
          return { reportedYieldMax : true };
        }

        return null;
    };
  }
}