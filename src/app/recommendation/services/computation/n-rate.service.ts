import { Injectable } from "@angular/core";
import { NRateModel } from "../../model/n-rate.model";
import { OrganicFertilizerInputService } from './organic-fertilizer-input.service';
import { OrganicFertilizerRateModel } from '../../model/organic-fertilizer-rate.model';

@Injectable({
  providedIn: "root"
})
export class NRateService {

  constructor(private organicFertilizerInputService: OrganicFertilizerInputService) { }

  public computeNRate(
    soilFertility: number,
    targetYield: number,
    growthDuration: number,
    cropEstablishment: number,
    varietyType: number,
    seedlingAge: number,
    organicFertilizer: OrganicFertilizerRateModel,
  ) {

    let nLimitedYield = this.computeNLimitedYield(targetYield);
    let yieldGain = this.computeYieldGain(targetYield, nLimitedYield);
    let agronomicEfficiencyN = this.getAgronomicEfficiencyN(targetYield);
    let cropEstablishmentVal = this.getCropEstablishment(cropEstablishment);
    let twoNApplication = this.isTwoNApplication(targetYield, growthDuration, cropEstablishmentVal, seedlingAge);
    let fertilizerNRate = this.computeFertilizerNRate(soilFertility, yieldGain, agronomicEfficiencyN, twoNApplication);
    let nEarly = this.getNEarly(soilFertility, yieldGain, twoNApplication, fertilizerNRate, seedlingAge);
    let nActiveTillering = this.getNActiveTillering(soilFertility, varietyType, twoNApplication, yieldGain, fertilizerNRate, nEarly);
    let nPanicleInitiation = this.getNPanicleInitiation(soilFertility, varietyType, twoNApplication, yieldGain, fertilizerNRate, nEarly, nActiveTillering);
    let nHeading = this.getNHeading(soilFertility, varietyType, twoNApplication, yieldGain);

    if (soilFertility === 3 && nHeading === 20) {
      nPanicleInitiation -= 20;
    }

    if (organicFertilizer) {
      const tempOrganicN = 0.25 * (nEarly + nActiveTillering + nPanicleInitiation);
      if (organicFertilizer.organicNRate >= tempOrganicN) {
        organicFertilizer.organicNRate = tempOrganicN;
      }

      let organicN = organicFertilizer.organicNRate;

      if (organicN > 10) {
        nEarly = nEarly - 10;
      } else {
        nEarly = nEarly - organicN;
      }

      organicN = organicN - 10;
      if (organicN > 0) {
        nPanicleInitiation = nPanicleInitiation - organicN;
      }

      if (nPanicleInitiation < 0) {
        nEarly = nEarly + nPanicleInitiation;
      }

      if (nEarly < 0) {
        nActiveTillering = nActiveTillering + nEarly;
      }
    }

    nEarly = nEarly < 5 ? 0 : (nEarly < 10 ? 10 : nEarly);
    nActiveTillering = nActiveTillering < 5 ? 0 : (nActiveTillering < 10 ? 10 : nActiveTillering);
    nPanicleInitiation = nPanicleInitiation < 5 ? 0 : (nPanicleInitiation < 10 ? 10 : nPanicleInitiation);
    nHeading = nHeading < 5 ? 0 : (nHeading < 10 ? 10 : nHeading);

    return new NRateModel(
      nEarly,
      nActiveTillering,
      nPanicleInitiation,
      nHeading
    );
  }

  public computeNLimitedYield(targetYield: number) {
    return 0.589 * targetYield + 0.536;
  }

  public computeYieldGain(targetYield: number, nLimitedYield: number) {
    return targetYield - nLimitedYield;
  }

  public getAgronomicEfficiencyN(targetYield: number) {
    return targetYield <= 8.2 ? 16 : 17;
  }

  public computeFertilizerNRate(
    soilFertility: number,
    yieldGain: number,
    agronomicEfficiencyN: number,
    twoNApplication: boolean
  ) {

    let fertilizerNRate = (yieldGain * 1000) / agronomicEfficiencyN;

    if (soilFertility === 1) {
      fertilizerNRate -= 23;
    }

    if (soilFertility === 3) {
      fertilizerNRate -= 45;
      fertilizerNRate = twoNApplication ? fertilizerNRate : (fertilizerNRate < 5 ? 0 : fertilizerNRate);
    }

    return fertilizerNRate;
  }

  public getCropEstablishment(cropEstablishment: number) {
    return cropEstablishment === 3 ? 1 : cropEstablishment;
  }

  public isTwoNApplication(
    targetYield: number,
    growthDuration: number,
    cropEstablishmentVal: number,
    seedlingAge: number
  ): boolean {

    let twoNApplication =
      targetYield <= 3.9 &&
      growthDuration < 3 &&
      cropEstablishmentVal === 1 &&
      seedlingAge != 3;

    if (seedlingAge === 3 && targetYield <= 3.9) {
      twoNApplication = true;
    }

    return twoNApplication;
  }

  public getNEarly(
    soilFertility: number,
    yieldGain: number,
    twoNApplication: boolean,
    fertilizerNRate: number,
    seedlingAge: number
  ): number {

    let nEarly = 0;

    if (soilFertility === 1) {

      if (twoNApplication) {
        let multiplier = seedlingAge === 3 ? 0.5 : 0.3;
        nEarly = yieldGain === 4 ? 20 : fertilizerNRate * multiplier;
      } else {

        if (yieldGain < 0.8) {
          nEarly = 0;
        } else if (yieldGain < 1.2) {
          nEarly = fertilizerNRate * 0.3;
        } else if (yieldGain < 1.4) {
          nEarly = fertilizerNRate * 0.25;
        } else if (yieldGain < 2) {
          nEarly = 20;
        } else if (yieldGain < 2.3) {
          nEarly = 30;
        } else if (yieldGain < 2.5) {
          nEarly = 35;
        } else if (yieldGain < 2.7) {
          nEarly = 40;
        } else {
          nEarly = 45;
        }
      }
    } else if (soilFertility === 2) {

      if (twoNApplication) {
        let multiplier = seedlingAge === 3 ? 0.5 : 0.3;
        nEarly = yieldGain === 4 ? 20 : fertilizerNRate * multiplier;
      } else {

        if (yieldGain < 1) {
          nEarly = fertilizerNRate * 0.3;
        } else if (yieldGain < 1.6) {
          nEarly = 20;
        } else if (yieldGain < 2.1) {
          nEarly = 30;
        } else if (yieldGain < 2.3) {
          nEarly = 35;
        } else if (yieldGain < 2.5) {
          nEarly = 40;
        } else if (yieldGain < 2.8) {
          nEarly = 45;
        } else {
          nEarly = 50;
        }
      }
    } else {

      if (twoNApplication) {
        let multiplier = seedlingAge === 3 ? 0.5 : 0.3;
        nEarly = yieldGain === 4 ? 20 : fertilizerNRate * multiplier;
      } else {

        if (yieldGain < 1.3) {
          nEarly = 0;
        } else if (yieldGain < 2.1) {
          nEarly = 14;
        } else if (yieldGain < 2.3) {
          nEarly = 25;
        } else if (yieldGain < 2.5) {
          nEarly = 30;
        } else if (yieldGain < 3.3) {
          nEarly = 35;
        } else {
          nEarly = 40;
        }
      }
    }

    return Math.round(nEarly * 10) / 10;
  }

  public getNActiveTillering(
    soilFertility: number,
    varietyType: number,
    twoNApplication: boolean,
    yieldGain: number,
    fertilizerNRate: number,
    nEarly: number
  ): number {

    if (soilFertility === 2 && twoNApplication) {
      return 0;
    }

    let yieldGainCompare1 = 1.108;
    let yieldGainCompare2 = 1.108;

    if (soilFertility === 3) {
      yieldGainCompare1 = 1.7;
      yieldGainCompare2 = 1.6;
    }

    return this.computeActiveTillering(
      varietyType,
      yieldGainCompare1,
      yieldGainCompare2,
      yieldGain,
      fertilizerNRate,
      nEarly
    );
  }

  public computeActiveTillering(
    varietyType: number,
    yieldGainCompare1: number,
    yieldGainCompare2: number,
    yieldGain: number,
    fertilizerNRate: number,
    nEarly: number
  ) {

    let nActiveTillering = yieldGain < yieldGainCompare1 ? 0 : (fertilizerNRate - nEarly) / 2;
    if (varietyType != 1) {
      if (yieldGain < yieldGainCompare2) {
        nActiveTillering = 0;
      } else {
        let difference = fertilizerNRate - nEarly;
        if (yieldGain >= 2.5) {
          difference -= 20;
        }
        nActiveTillering = difference / 2;
      }
    }
    return Math.round(nActiveTillering * 10) / 10;
  }

  public getNPanicleInitiation(
    soilFertility: number,
    varietyType: number,
    twoNApplication: boolean,
    yieldGain: number,
    fertilizerNRate: number,
    nEarly: number,
    nActiveTillering: number
  ) {

    let inbredLimit = +soilFertility === 3 ? 1.7 : 1.1;
    let hybridLimit = 2.5;

    if (+soilFertility === 2 && twoNApplication) {
      return fertilizerNRate - nEarly - nActiveTillering;
    }

    return this.computePanicleInitiation(
      varietyType,
      inbredLimit,
      hybridLimit,
      yieldGain,
      fertilizerNRate,
      nEarly,
      nActiveTillering
    );
  }

  public computePanicleInitiation(
    varietyType: number,
    inbredLimit: number,
    hybridLimit: number,
    yieldGain: number,
    fertilizerNRate: number,
    nEarly: number,
    nActiveTillering: number
  ) {

    let difference1 = fertilizerNRate - nEarly;
    let difference2 = difference1 - nActiveTillering;
    let nPanicleInitiation = yieldGain < inbredLimit ? difference1 : difference2;

    if (+varietyType === 2) {
      nPanicleInitiation = yieldGain < hybridLimit ? difference2 : difference2 - 20;
    }

    return nPanicleInitiation;
  }

  public getNHeading(
    soilFertility: number,
    varietyType: number,
    twoNApplication: boolean,
    yieldGain: number
  ) {

    if (soilFertility === 2 && twoNApplication) {
      return 0;
    }

    return this.computeHeading(varietyType, yieldGain);
  }

  public computeHeading(
    varietyType: number,
    yieldGain: number
  ) {

    return (yieldGain < 2.5 && varietyType === 2) || varietyType === 1 ? 0 : 20;
  }
}
