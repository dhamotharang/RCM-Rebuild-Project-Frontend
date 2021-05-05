import { Injectable } from '@angular/core';
import { Season } from '../enum/season.enum';
import { WaterSource } from '../enum/water-source.enum';
import { VarietyType } from '../enum/variety-type.enum';
import { Month } from '../../v2/core/enums/month.enum';
import { Establishment } from '../enum/establishment.enum';
import { add, format } from 'date-fns';
import { A_TONNE } from '../constant/field-unit.constant';
import { MoistureContentInitial } from '../enum/moisture-content-initial.enum';
import { MoistureContentFinal } from '../enum/moisture-content-final.enum';

@Injectable({
  providedIn: 'root'
})
export class TargetYieldService {

  constructor() { }

  public computeSeedRate(kilogram: number, fieldSizeHectare: number): number {
    let seedRate = 0;
    if(!!kilogram && !!fieldSizeHectare) {
        seedRate = Math.round(kilogram / fieldSizeHectare);
    } 
    return seedRate;
  }

  public computeReportYield(noOfSacks: number, weightOfSack: number, fieldSizeHectare: number): number {
    if (!!noOfSacks && !!weightOfSack && !!fieldSizeHectare) {
      const tonne = 1000;
      let tonnePerHectare = (noOfSacks * weightOfSack) / tonne / fieldSizeHectare;
      return Math.round((tonnePerHectare + Number.EPSILON) * 100) / 100;
    } else {
      return 0;
    }
   
  }

  public computeMaxReportYield(season: number, waterSource: number, varietyType: number): number {
    
    if (!!season && !!waterSource && !!varietyType) {
      let maximumReportedYield = 0;

      if (season === Season.DRY) {
        if (waterSource === WaterSource.IRRIGATED) {
          maximumReportedYield = (varietyType === VarietyType.HYBRID) ? 12.5 : 11
        }
        else if (waterSource === WaterSource.RAINFED) {
          maximumReportedYield = (varietyType === VarietyType.HYBRID) ? 11 : 9.5
        }
      }
      else if (season === Season.WET) {
  
        if (waterSource === WaterSource.IRRIGATED) {
          maximumReportedYield = (varietyType === VarietyType.HYBRID) ? 13 : 11.5
        }
        else if (waterSource === WaterSource.RAINFED) {
          maximumReportedYield = (varietyType === VarietyType.HYBRID) ? 11.5 : 10
        }
      }
      return maximumReportedYield;
    } else {
      return 0;
    }
  }

  public computeFarmerNormalYield(noOfSacks: number, weightOfSack: number, fieldSizeHectare: number): number {

    if (!!noOfSacks && !!weightOfSack && !!fieldSizeHectare) {
      const tonne = 1000;
      return ((((noOfSacks * weightOfSack) / fieldSizeHectare) * MoistureContentInitial.value) / MoistureContentFinal.value) / tonne;
    } else {
      return 0;
    }
    
  }

  public estimateHarvestMonth(sowingDate: Date, growthDurationId: number, cropEstablishment: number): string {

    if(!!sowingDate && !!growthDurationId && !!cropEstablishment) {
      let harvestDays = -1;

      if (growthDurationId == 1) {
        harvestDays = 105;
      }

      if (growthDurationId == 2) {
        harvestDays = 115;
      }

      if (growthDurationId === 3) {
        harvestDays = 125;
      }

      if (cropEstablishment == Establishment.WET || cropEstablishment == Establishment.DRY) {
        harvestDays -= 10;
      }


      const harvestDate = add(sowingDate, { 
        days: harvestDays
      });

      const harvestMonth = format(harvestDate, 'M');
      const monthInString = Month[parseInt(harvestMonth)];

      return monthInString;
    } else {
      return '';
    }

  }

  public computeReportedYieldDryWeight(noOfSacks: number, weightOfSack: number, fieldSizeHectare: number): number {
    let reportedYieldDryWeight = 0;
    const reportedYieldFreshWeight = (noOfSacks * weightOfSack) / A_TONNE / fieldSizeHectare;
    reportedYieldDryWeight = (reportedYieldFreshWeight * (100 - MoistureContentInitial.subtrahend)) / 86;
    return reportedYieldDryWeight;
  }

}
