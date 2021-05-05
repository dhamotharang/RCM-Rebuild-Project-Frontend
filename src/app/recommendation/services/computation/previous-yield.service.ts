import { Injectable } from '@angular/core';

import { ProvinceModel } from 'src/app/location/models/province.model';
import { add, format } from 'date-fns';
import { WaterSource } from 'src/app/recommendation/enum/water-source.enum';

@Injectable({
  providedIn: 'root'
})
export class PreviousYieldService {

  constructor() { }

  /**
   * Returns -1 if invalid sowing date
   * @param irrigation 
   * @param sowingDate 
   * @param growthDuration 
   * @param cropEstablishment 
   * @param noOfCrops 
   * @param provinceQuarterYield 
   */
  public computePreviousYield(
    irrigation: WaterSource,
    sowingDate: Date,
    growthDuration: number,
    cropEstablishment: number,
    noOfCrops: number,
    provinceQuarterYield: ProvinceModel
  ): number {

    const numberOfDaysOfRice = this.computeNumberOfDaysOfRice(
      cropEstablishment,
      growthDuration,
      noOfCrops
    );

    const sowingDatePlusNoOfDaysOfRice = add(sowingDate, {
      days: numberOfDaysOfRice
    });

    const quarter = format(sowingDatePlusNoOfDaysOfRice, 'Qo');
    const previousYield = this.getProvinceQuarterYield(quarter, provinceQuarterYield, irrigation);

    return previousYield;
  }

  private getProvinceQuarterYield(
    quarter: string, 
    provinceQuarterYield: ProvinceModel,
    irrigation: WaterSource
  ) {

    let previousYield = -1;

    switch(quarter) {
      case '1st': 
        previousYield = irrigation === WaterSource.IRRIGATED ? provinceQuarterYield.irrigated1stq : provinceQuarterYield.rainfed1stq;
        break;
      case '2nd': 
        previousYield = irrigation === WaterSource.IRRIGATED ? provinceQuarterYield.irrigated2ndq : provinceQuarterYield.rainfed2ndq;
        break;
      case '3rd': 
        previousYield = irrigation === WaterSource.IRRIGATED ? provinceQuarterYield.irrigated3rdq : provinceQuarterYield.rainfed3rdq;
        break;
      case '4th': 
        previousYield = irrigation === WaterSource.IRRIGATED ? provinceQuarterYield.irrigated4thq : provinceQuarterYield.rainfed4thq;
        break;
    }

    return previousYield;
  }

  /**
   *
   * days values: 110, 120, 130, 100, 110, 120 (+60, +30, +0)
   *
   *
   * @param cropEstablishment
   * @param growthDuration
   */
  computeNumberOfDaysOfRice(
    cropEstablishment: number,
    growthDuration: number,
    noOfCrops: number
  ) {
    let days: number = 0;

    if (noOfCrops === 1) {
      if (cropEstablishment === 1 || cropEstablishment === 3) { // transplanting
        if (growthDuration === 1) {
          days = 110;
        } else if (growthDuration === 2) {
          days = 120;
        } else {
          days = 130;
        }
      } else { // seeding
        if (growthDuration === 1) {
          days = 100;
        } else if (growthDuration === 2) {
          days = 110;
        } else {
          days = 120;
        }
      }
    } else if (noOfCrops === 2) {
      days = 60;
    } else {
      days = 30;
    }

    return days;
  }
}
