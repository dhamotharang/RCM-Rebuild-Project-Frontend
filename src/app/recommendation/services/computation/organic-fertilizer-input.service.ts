import { Injectable } from '@angular/core';
import { OrganicFertilizerRateModel } from '../../model/organic-fertilizer-rate.model';

@Injectable({
  providedIn: 'root'
})
export class OrganicFertilizerInputService {

  constructor() { }

  calculateNutrientAmountFromAppliedOrganicFertilizer(
    numberOfBags: number, 
    weightOfBag: number, 
    fieldSizeInHa: number
  ): OrganicFertilizerRateModel {

    let nPercentage = 0.8;
    let pPercentage = 0.47;
    let kPercentage = 1.2;
    let maxPOrganicValue = 25;
    let maxKOrganicValue = 60;
    let minNOrganicValue = 10;
    let minPKOrganicValue = 2;

    let totalAmountToApply = (numberOfBags * weightOfBag) / fieldSizeInHa;

    const nAmountFromAppliedOrganicFertilizerFarmLotSize = this.calculateNutrientAmountHelper(totalAmountToApply, nPercentage);
    const pAmountFromAppliedOrganicFertilizerFarmLotSize = this.calculateNutrientAmountHelper(totalAmountToApply, pPercentage);
    const kAmountFromAppliedOrganicFertilizerFarmLotSize = this.calculateNutrientAmountHelper(totalAmountToApply, kPercentage);

    const nAmountFromAppliedOrganicFertilizerHa = nAmountFromAppliedOrganicFertilizerFarmLotSize * fieldSizeInHa;
    const pAmountFromAppliedOrganicFertilizerHa = pAmountFromAppliedOrganicFertilizerFarmLotSize * fieldSizeInHa;
    const kAmountFromAppliedOrganicFertilizerHa = kAmountFromAppliedOrganicFertilizerFarmLotSize * fieldSizeInHa;

    let organicN = nAmountFromAppliedOrganicFertilizerHa < minNOrganicValue ? 0 : nAmountFromAppliedOrganicFertilizerHa;
    let organicP = pAmountFromAppliedOrganicFertilizerHa >= minPKOrganicValue ? pAmountFromAppliedOrganicFertilizerHa : 0;
    let organicK = kAmountFromAppliedOrganicFertilizerHa >= minPKOrganicValue ? kAmountFromAppliedOrganicFertilizerHa : 0;

    if (organicP > maxPOrganicValue) {
        organicP = maxPOrganicValue;
    }

    if (organicK > maxKOrganicValue) {
        organicK = maxKOrganicValue;
    }

    let nutrientAmountFromAppliedOrganicFertilizer = {
        organicNRate: organicN,
        organicPRate: organicP,
        organicKRate: organicK
    }

    return nutrientAmountFromAppliedOrganicFertilizer;
  }

  calculateNutrientAmountHelper(
    totalAmountToApply: number,
    fertilizerRatePercentage: number
  ) {

    return totalAmountToApply * (fertilizerRatePercentage / 100);
  }

}
