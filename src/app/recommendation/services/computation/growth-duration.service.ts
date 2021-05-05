import { Injectable } from '@angular/core';
import { GrowthDuration } from '../../model/growth-duration';

@Injectable({
  providedIn: 'root'
})
export class GrowthDurationService {

  constructor() { }

  public computeGD(
      cropEstablishment: number, 
      growthDuration: number, 
      seedlingAge: number, 
      threeSplits: boolean, 
      irrigation: number
    ) {
        
    let growthDurationAve = this.determineGDAve(cropEstablishment, growthDuration);
    let sc = 0;
    let transplantingShock = 0;
    if (cropEstablishment === 1 || cropEstablishment === 3) {
      sc = this.determineSAComp(seedlingAge);
      transplantingShock = seedlingAge === 3 ? 3 : 0;
    }

    let twoSplits = !threeSplits;

    let harvestHigh = this.computeDayOfApplication(
      cropEstablishment,
      growthDurationAve,
      sc,
      transplantingShock,
      5
    );

    let harvestLow = this.computeDayOfApplication(
      cropEstablishment,
      growthDurationAve,
      sc,
      transplantingShock,
      -4
    );
    
    let headingHigh = this.computeDayOfApplication(
      cropEstablishment,
      growthDurationAve,
      sc,
      transplantingShock,
      -27
    );

    let headingLow = this.computeDayOfApplication(
      cropEstablishment,
      growthDurationAve,
      sc,
      transplantingShock,
      -33
    );

    let panicleInitiationHigh = this.computePanicleInitiationHigh(
      cropEstablishment,
      growthDurationAve,
      sc,
      transplantingShock,
      growthDuration,
      twoSplits,
      irrigation
    );
    
    let panicleInitiationLowSub = this.computePanicleInitiationLowSub(twoSplits, cropEstablishment, growthDuration);
    let panicleInitiationLow = this.computeDayOfApplication(
      cropEstablishment, 
      growthDurationAve,
      sc,
      transplantingShock,
      panicleInitiationLowSub
    );

    let activeTilleringHigh = this.computeActiveTilleringHigh(cropEstablishment, seedlingAge, panicleInitiationHigh, irrigation, twoSplits);
    let activeTilleringLow = this.computeActiveTilleringLow(cropEstablishment, seedlingAge, panicleInitiationLow, twoSplits);
    
    let earlyHigh = this.computeEarlyHigh(cropEstablishment, seedlingAge, growthDuration);
    let earlyLow = 'Basal';
    
    let rainfedPanicleInitiationHigh = this.computeRainfedPanicleInitiation(panicleInitiationHigh, growthDuration);
    let rainfedPanicleInitiationLow = this.computeRainfedPanicleInitiation(panicleInitiationLow, growthDuration);

    let rainfedActiveTilleringHigh = activeTilleringHigh + 5;
    let rainfedActiveTilleringLow = activeTilleringLow + 1;

    let growthDurationReco = new GrowthDuration(
      earlyLow,
      earlyHigh,
      activeTilleringLow,
      activeTilleringHigh,
      panicleInitiationLow,
      panicleInitiationHigh,
      headingLow,
      headingHigh,
      harvestLow,
      harvestHigh,
      rainfedActiveTilleringLow,
      rainfedActiveTilleringHigh,
      rainfedPanicleInitiationLow,
      rainfedPanicleInitiationHigh
    );

    return growthDurationReco;

  }

  public determineGDAve(cropEstablishment: number, growthDuration: number) {
    let gda: number = 125;

    if (growthDuration === 1) {
      gda -= 20;
    }

    if (growthDuration === 2) {
      gda -= 10;
    }

    if (cropEstablishment === 2 || cropEstablishment === 4) {
      gda -= 10;
    }

    return gda;
  }

  public determineSAComp(seedlingAge: number) {
    let sc: number = 20;
    sc = seedlingAge === 1 ? 14 : sc;
    sc = seedlingAge === 3 ? 25 : sc;
    return sc;
  }

  public computeDayOfApplication(
    cropEstablishment: number, 
    growthDurationAve: number, 
    seedlingAgeAve: number, 
    transplantingShock: number, 
    sub: number) {
      let daysOfApplication:number = growthDurationAve + sub;
      if (cropEstablishment === 1 || cropEstablishment === 3) {
        daysOfApplication = daysOfApplication - seedlingAgeAve + transplantingShock;
      }
      return daysOfApplication;
  }

  public computePanicleInitiationHigh(
    cropEstablishment:number,
    growthDurationAve: number,
    seedlingAgeAve: number,
    transplantingShock: number,
    growthDuration: number,
    twoSplits: boolean,
    irrigation: number
  ) {
    let sub = -56;
    let isTransplanting = cropEstablishment === 1 || cropEstablishment === 3;

    if (twoSplits) {
      sub = -60;
      if (isTransplanting) {
        sub = growthDuration === 1 ? -55 : -58;
      }
    } else {
      if (irrigation === 3) {
        sub = -56;
        if (isTransplanting) {
          sub = growthDuration === 1 ? -51 : -54;
        }
      } else {
        sub = -58;
        if (isTransplanting) {
          sub = growthDuration === 1 ? -53 : -56;
        }
      }
    }

    return this.computeDayOfApplication(
      cropEstablishment,
      growthDurationAve,
      seedlingAgeAve,
      transplantingShock,
      sub
    );
  }

  public computePanicleInitiationLowSub(twoSplits:boolean, cropEstablishment:number, growthDuration: number) {

    let sub;
    let isTransplanting = cropEstablishment === 1 || cropEstablishment === 3;

    if (twoSplits) {
      sub = -64;
      if (isTransplanting) {
        sub = growthDuration === 1 ? -59 : -62;
      }
    } else {
      sub = -62;
      if (isTransplanting) {
        sub = growthDuration === 1 ? -57 : -60;
      }
    }
    return sub;
  }

  public computeActiveTilleringDays(panicleInitiationHigh:number, add1:number, add2:number) {
    let activeTilleringDays = add1 + ((panicleInitiationHigh - add1) / 2) + add2;
    return Math.round(activeTilleringDays);
  }

  public computeActiveTilleringHigh(cropEstablishment:number, seedlingAge:number, panicleInitiationHigh:number, irrigation:number, twoSplits:boolean) {
    
    let isTransplanting = cropEstablishment === 1 || cropEstablishment === 3;
    let add1 = 10;
    let add2 = 1;    

    if (twoSplits) {
      return null;
    }

    if (irrigation === 3) {
      add2 = 2;
    } 

    if (isTransplanting) {
      add1 = seedlingAge === 3 ? 4 : 8;
    }

    return this.computeActiveTilleringDays(panicleInitiationHigh, add1, add2);    
  }

  public computeActiveTilleringLow(cropEstablishment:number, seedlingAge:number, panicleInitiationLow:number, twoSplits:boolean) {

    let isTransplanting = cropEstablishment === 1 || cropEstablishment === 3;
    let add1 = 10;
    let add2 = -1;
    let activeTilleringLow; 

    if (twoSplits) {
      return null;
    }

    if (isTransplanting) {
      add1 = seedlingAge == 3 ? 4 : 8;
    }

    activeTilleringLow = this.computeActiveTilleringDays(panicleInitiationLow, add1, add2);

    return activeTilleringLow;
  }

  public computeEarlyHigh(cropEstablishment:number, seedlingAge:number, growthDuration:number) {

    let isTransplanting = growthDuration === 1 || cropEstablishment === 3;
    let earlyHigh:number;

    earlyHigh = seedlingAge === 1 ? 10 : 14;
    if (isTransplanting) {
      earlyHigh = seedlingAge === 3 ? 5 : 10;      
    }

    return earlyHigh;
  }

  public computeRainfedPanicleInitiation(panicleInitiationValue:number, growthDuration:number) {
    let adder = growthDuration === 3 ? 0 : 3;
    return panicleInitiationValue + adder;
  }
}
