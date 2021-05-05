import { Injectable } from '@angular/core';
import { WaterSource } from 'src/app/recommendation/enum/water-source.enum';
import { VarietyType } from 'src/app/recommendation/enum/variety-type.enum';
import { FarmlotDescription } from 'src/app/recommendation/enum/farmlot-description.enum';
import { SeedSource } from 'src/app/recommendation/enum/seed-source.enum';
import { UpcomingSeedSource } from 'src/app/recommendation/enum/upcoming-seed-source.enum';
import { Region } from 'src/app/core/enum/region.enum';
import { Month } from 'src/app/v2/core/enums/month.enum';

import { A_TONNE } from 'src/app/recommendation/constant/field-unit.constant';
import {DataPotentialYieldService} from '../../data-potential-yield.service';


@Injectable({
  providedIn: 'root',
})
export class PotentialYieldService {
  public potentialYield: number;
  public percentage: number;
  public additionalPercent: number;
  public upperYieldLimit: number;
  public lowerYieldLimit: number;
  public targetYield: number;
  public potentialYieldOutput: number;

  constructor(private potentialYieldDataService: DataPotentialYieldService) { }

  computePotentialYield(
    regionId: number,
    municipalityRunId: number,
    growthDuration: number,
    sowingDate: Date,
    varietyType: number,
    previousSeedSource: number,
    upcomingSeedSource: number,
    waterSupply: number,
    typicalYield: number, //  reported yield, user input
    irrigation: number,
    previousYield: number,
    previousVarietyType: number
  ) {
    const sowingMonth = sowingDate.getMonth() + 1;
    
    let potentialYieldObj = this.potentialYieldDataService.queryByRunIdSowingMonthGrowthDuration(
      municipalityRunId,
      sowingMonth,
      growthDuration
    );
    
    // set yield
    if (regionId <= Region.MIMAROPA) {
      if (
        sowingMonth === Month.NOVEMBER ||
        sowingMonth === Month.DECEMBER ||
        sowingMonth <= Month.APRIL
      ) {
        if (varietyType === VarietyType.INBRED) {
          this.potentialYield = potentialYieldObj.inbred70;
          this.percentage = 0.7;
        } else {
          this.potentialYield = potentialYieldObj.hybrid80;
          this.percentage = 0.8;
        }
      } else {
        if (varietyType === VarietyType.INBRED) {
          this.potentialYield = potentialYieldObj.inbred60;
          this.percentage = 0.6;
        } else {
          this.potentialYield = potentialYieldObj.hybrid70;
          this.percentage = 0.7;
        }
      }
    } else if (regionId === Region.REGION_V) {
      if (varietyType === VarietyType.INBRED) {
        this.potentialYield = potentialYieldObj.inbred60;
        this.percentage = 0.6;
      } else {
        this.potentialYield = potentialYieldObj.hybrid70;
        this.percentage = 0.7;
      }
    } else {
      if (varietyType === VarietyType.INBRED) {
        this.potentialYield = potentialYieldObj.inbred65;
        this.percentage = 0.65;
      } else {
        this.potentialYield = potentialYieldObj.hybrid75;
        this.percentage = 0.75;
      }
    }

    // determine yield increase based on seed source input
    this.setAddtionalIncrease(
      previousSeedSource,
      upcomingSeedSource,
      waterSupply,
      previousVarietyType,
      varietyType
    );

    // set yield upper limit
    this.setYieldUpperLimit();

    // set lower yield limit
    this.setYieldLowerLimit(irrigation, previousYield);

    this.setTargetYield(typicalYield, this.potentialYield);
    this.setPotentialYield(this.potentialYield);
  }

  setAddtionalIncrease(
    previousSeedSource: number,
    upcomingSeedSource: number,
    waterSupply: number,
    previousVarietyType: number,
    varietyType: number
  ) {
    let prev23 =
      previousSeedSource === SeedSource.PURCHASED_EXCHANGED ||
      previousSeedSource === SeedSource.FIRST_HAVEST_SEED;
    let up23 =
      upcomingSeedSource === UpcomingSeedSource.PURCHASED_EXCHANGED ||
      upcomingSeedSource === UpcomingSeedSource.FIRST_HAVEST_SEED;

    // to support old version
    if (varietyType > 0 && previousVarietyType > 0) {
      if (varietyType === previousVarietyType) {
        if (waterSupply === FarmlotDescription.ADEQUATE) {
          this.additionalPercent = 0.2;
        } else {
          this.additionalPercent = 0.15;
        }
      } else {
        if (varietyType === VarietyType.HYBRID) {
          if (waterSupply === FarmlotDescription.ADEQUATE) {
            this.additionalPercent = 0.3;
          } else {
            this.additionalPercent = 0.25;
          }
        } else {
          if (waterSupply === FarmlotDescription.ADEQUATE) {
            this.additionalPercent = 0.15;
          } else {
            this.additionalPercent = 0;
          }
        }
      }
    } else {
      if (
        (prev23 && upcomingSeedSource === UpcomingSeedSource.HOME_SAVED_SEED) ||
        (previousSeedSource === SeedSource.HOME_SAVED_SEED &&
          upcomingSeedSource === UpcomingSeedSource.HOME_SAVED_SEED)
      ) {
        this.additionalPercent = 0;
        return;
      }

      if (
        previousSeedSource === SeedSource.HOME_SAVED_SEED &&
        (upcomingSeedSource === UpcomingSeedSource.PURCHASED_CERTIFIED || up23)
      ) {
        this.additionalPercent = 0.3;
      } else {
        this.additionalPercent = 0.2;
      }

      if (waterSupply !== FarmlotDescription.ADEQUATE) {
        this.additionalPercent -= 0.05;
      }
    }
  }

  setYieldUpperLimit() {
    this.upperYieldLimit = this.potentialYield / A_TONNE;
    if (this.potentialYield / this.percentage / A_TONNE >= 12.5) {
      this.upperYieldLimit = 12.5;
    }
  }

  setYieldLowerLimit(irrigation: number, previousYield: number) {
    if (irrigation !== WaterSource.RAINFED) {
      if (previousYield > 4.25) {
        this.lowerYieldLimit = 4.5;
      } else if (previousYield <= 4.25 && previousYield >= 3.75) {
        this.lowerYieldLimit = 4;
      } else {
        this.lowerYieldLimit = 3.5;
      }
    } else {
      this.lowerYieldLimit = 3;
    }
  }

  setTargetYield(typicalYld: number, previousYield: number) {
    let pYield;
    let potentialYield;
    const typicalYield = typicalYld * A_TONNE;
    if (typicalYield / A_TONNE >= this.upperYieldLimit) {
      potentialYield = this.upperYieldLimit;
    } else {
      pYield =
        (previousYield - typicalYield) * this.additionalPercent + typicalYield;
      potentialYield = pYield / A_TONNE;
    }

    if (potentialYield >= this.upperYieldLimit) {
      this.targetYield = this.upperYieldLimit;
    }

    if (potentialYield <= this.lowerYieldLimit) {
      this.targetYield = this.lowerYieldLimit;
    }

    if (!this.targetYield) {
      this.targetYield = potentialYield;
    }
  }

  setPotentialYield(potentialYield: number) {
    this.potentialYieldOutput = potentialYield / 1000;
  }
}
