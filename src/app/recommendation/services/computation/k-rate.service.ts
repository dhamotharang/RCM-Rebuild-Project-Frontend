import { Injectable } from '@angular/core';
import { SoilFertility } from '../../enum/soil-fertility.enum';
import { PreviousStraw } from '../../enum/previous-straw.enum';
import { previousStraws } from '../../constant/previous-straw.constant';
import { PreviousCrop } from '../../enum/previous-crop.enum';
import { WaterSource } from '../../enum/water-source.enum';
import { Season } from '../../enum/season.enum';
import { RiceCropPerYear  } from '../../enum/rice-crop-per-year.enum';
import { SeasonService } from "./season.service";
import { KSplitModel } from '../../model/k-split.model';

@Injectable({
  providedIn: 'root',
})
export class KRateService {
  constructor(
    private seasonService: SeasonService
  ) { }

  private selectedCropRIEK = 19.2; // (15.9 * 1.205);

  public getTargetYieldMultiplier(
    soilFertility: SoilFertility, 
    straw: PreviousStraw
  ) {
    
    let multiplier = 0.12;

    if (straw && straw > 0) {
      if (soilFertility === SoilFertility.STANDARD) {
        multiplier = straw === PreviousStraw.COMBINE ? 0.08 : 0.12;
      } else {
        multiplier = straw === PreviousStraw.COMBINE ? 0.06 : 0.1;
      }
    } else {
      multiplier = soilFertility === SoilFertility.STANDARD ? 0.12 : 0.1;
    }

    return multiplier;
  }

  public calculateYieldGainK2ORate(
    targetYield: number,
    soilFertility: number,
    straw: number
  ) {
    
    const targetYieldMultiplier = this.getTargetYieldMultiplier(
      soilFertility,
      straw
    );

    const yieldGainK2ORate = (targetYield * targetYieldMultiplier * this.selectedCropRIEK) / 0.44;

    return Math.round(yieldGainK2ORate);
  }

  public calculateK2OSediment(
    previousCrop: PreviousCrop,
    soilFertility: SoilFertility
  ) {

    let k2OSediment = 0;
    
    if (previousCrop === PreviousCrop.RICE && soilFertility === SoilFertility.FALLOW) {
      k2OSediment = 18;
    }

    return k2OSediment;
  }

  public calculateK2OFromCropResidue(
    targetYield: number, 
    previousYield: number, 
    straw: number, 
    previousCrop: number
  ) {
    
    let k2OFromCropResidue = 0;
    
    if (straw && straw > 0) {
      const strawPercentage = previousStraws.find((s: any) => s.id === straw).percentage;
      k2OFromCropResidue = previousYield * this.selectedCropRIEK * (0.85) * (strawPercentage / 100);
    } else {
      if (previousCrop === PreviousCrop.LEGUME || previousCrop === PreviousCrop.NO_CROP) {
        k2OFromCropResidue = targetYield * this.selectedCropRIEK * (0.85) * (0.5);
      } else {
        k2OFromCropResidue = 40;
      }
    }

    return Math.round(k2OFromCropResidue);
  }

  public calculateK2OFromWaterIrrigation(
    waterSource: WaterSource, 
    sowingDate: Date
  ) {
    
    let k2OFromWaterIrrigation = 0;
    const season = this.seasonService.computeSeason(sowingDate);

    if (waterSource === WaterSource.IRRIGATED) {
      if (season === Season.WET) {
        k2OFromWaterIrrigation = 25;
      } else {
        k2OFromWaterIrrigation = 10;
      }
    }

    return k2OFromWaterIrrigation;
  }

  public calculateK2OFromOrganicMaterial(
    riceCropPerYear: number,
    sowingDate: Date,
    previousCrop: number,
    soilFertility: SoilFertility
  ) {

    const isOneCropPerYear = (riceCropPerYear === RiceCropPerYear.ONE);
    const season = this.seasonService.computeSeason(sowingDate);
    const isPreviousCropIsRice = (previousCrop === PreviousCrop.RICE);
    const isFallowWet = (soilFertility === SoilFertility.FALLOW);

    let k2OFromOrganicMaterial = 0;

    if (isOneCropPerYear && season === Season.WET && isPreviousCropIsRice && isFallowWet) {
      k2OFromOrganicMaterial = 60;
    }

    return k2OFromOrganicMaterial;
  }

  public calculateK2OFromSoilReserves(
    waterSource: WaterSource, 
    soilFertility: SoilFertility
  ) {
    
    let k2OFromSoilReserves = 18;

    if (waterSource === WaterSource.IRRIGATED &&
      (soilFertility === SoilFertility.HIGH || soilFertility === SoilFertility.FALLOW)
    ) {
      k2OFromSoilReserves = 25;
    }

    return k2OFromSoilReserves;
  }

  public calculateTotalK2ORate(
    targetYield: number,
    straw: number,
    previousCrop: number,
    previousYield: number,
    waterSource: number,
    riceCropPerYear: number,
    sowingDate: Date,
    soilFertility: number
  ) {

    const k2OFromCropResidue = this.calculateK2OFromCropResidue(
      targetYield, 
      previousYield, 
      straw, 
      previousCrop);

    const k2OFromWaterIrrigation = this.calculateK2OFromWaterIrrigation(
      waterSource, 
      sowingDate,
    );

    const k2OFromOrganicMaterial = this.calculateK2OFromOrganicMaterial(
      riceCropPerYear,
      sowingDate,
      previousCrop,
      soilFertility
    );

    const k2OSediment = this.calculateK2OSediment(
      previousCrop,
      soilFertility
    );

    const k2OFromSoilReserves = this.calculateK2OFromSoilReserves(
      waterSource,
      soilFertility
    );

    const k2OTotalSum = (
      k2OFromCropResidue +
      k2OFromWaterIrrigation +
      k2OFromOrganicMaterial +
      k2OSediment +
      k2OFromSoilReserves
    );

    const targetedK2O = this.selectedCropRIEK * targetYield;

    const nutrientBalanceK2ORate = targetedK2O - k2OTotalSum;

    let totalK2ORate = nutrientBalanceK2ORate;

    const yieldGainK2ORate = this.calculateYieldGainK2ORate(
      targetYield,
      soilFertility,
      straw
    );

    if (yieldGainK2ORate > totalK2ORate) {
      totalK2ORate = yieldGainK2ORate;
    }

    return totalK2ORate;
  }

  public populateKSplitModel(totalK2ORate): KSplitModel {

    return {
      kEarly: (totalK2ORate > 40 ? totalK2ORate/2 : totalK2ORate),
      kPanicleInitiation: (totalK2ORate > 40 ? totalK2ORate/2 : 0)
    }
  }
}
