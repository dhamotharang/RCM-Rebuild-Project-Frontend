import { Injectable } from '@angular/core';
import { PreviousCrop } from '../../enum/previous-crop.enum';
import { PreviousStraw } from '../../enum/previous-straw.enum';
import { WaterSource } from '../../enum/water-source.enum';
import { SoilFertility } from '../../enum/soil-fertility.enum';
import { OrganicFertilizerInputService } from './organic-fertilizer-input.service';
import { OrganicFertilizerRateModel } from '../../model/organic-fertilizer-rate.model';

@Injectable({
  providedIn: 'root'
})
export class PRateService {

  constructor(private organicFertilizerInputService: OrganicFertilizerInputService) { }

  getStrawPercentageByHarvestType(
    harvestType: number,
    previousCrop: number
  ) {

    let previousStrawInput = 0;

    if (previousCrop === PreviousCrop.RICE) {
      previousStrawInput = harvestType === PreviousStraw.COMBINE ? 100 : 50;
    }

    return previousStrawInput;
  }

  calculateP2O5CropResidueRate(
    previousCrop: number,
    previousYield: number,
    harvestType: number
  ) {

    const riepPreviousCrop = 6.2;
    const multiplier = 0.3;
    const previousStrawInputPercentage = this.getStrawPercentageByHarvestType(harvestType, previousCrop);

    const p2O5cropResidueRate = ((previousCrop === PreviousCrop.RICE) ? previousYield : 0) * riepPreviousCrop * multiplier * previousStrawInputPercentage / 100;

    return p2O5cropResidueRate;
  }

  calculateP2O5SoilReservesRate(
    targetYield: number,
    irrigation: number,
    soilFertility: number
  ) {

    let p2O5SoilReservesRate = 0;
    let compareTargetYieldValue = 5;
    let multiplier1 = 1.5;
    let multiplier2 = 2.292;
    let addend = 3;

    if (irrigation === WaterSource.IRRIGATED) {
      if (soilFertility !== SoilFertility.STANDARD) {

        const val = targetYield < compareTargetYieldValue ? multiplier1 + addend : addend;
        p2O5SoilReservesRate = val * multiplier2;
      } else {

        p2O5SoilReservesRate = targetYield < compareTargetYieldValue ? multiplier1 * multiplier2 : 0;
      }
    }

    return p2O5SoilReservesRate;
  }

  calculateTargetedP2O5Rate(
    targetYield: number
  ) {

    let riepSelectedCrop = 2.7 * 2.292;

    const targetedP2O5Rate = targetYield * riepSelectedCrop;

    return targetedP2O5Rate;
  }

  calculateTotalP2O5Rate(
    targetYield: number,
    irrigation: number,
    soilFertility: number,
    previousCrop: number,
    previousYield: number,
    harvestType: number,
    organicFertilizer: OrganicFertilizerRateModel,
  ) {

    let p2O5SedimentValue = 10.3;
    const targetedP2O5Rate = this.calculateTargetedP2O5Rate(targetYield);
    const p2O5cropResidueRate = this.calculateP2O5CropResidueRate(previousCrop, previousYield, harvestType);

    let p2O5Organic = 0;
    if (organicFertilizer) {
      p2O5Organic = organicFertilizer.organicPRate;
    }

    const p2O5SoilReservesRate = this.calculateP2O5SoilReservesRate(targetYield, irrigation, soilFertility);
    const p2O5Sediment = soilFertility === SoilFertility.FALLOW ? p2O5SedimentValue : 0;

    let totalP2O5Rate = targetedP2O5Rate
      - (
        p2O5cropResidueRate +
        p2O5Organic +
        p2O5Sediment +
        p2O5SoilReservesRate
      );

    totalP2O5Rate = totalP2O5Rate < 5 ? 0 : (totalP2O5Rate < 10 ? 10 : totalP2O5Rate);

    return totalP2O5Rate;
  }

}
