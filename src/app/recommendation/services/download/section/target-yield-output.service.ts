import { Injectable } from '@angular/core';
import { Common, Output } from "src/app/recommendation/model/translation.model";

@Injectable({
  providedIn: 'root'
})
export class TargetYieldOutputService {


  public targetYieldForYourLabel: string;
  public farmlotIsLabel: string;
  public hectareLabel: string;
  public sacksAtLabel: string;
  public kgPerSackLabel: string;
  public freshWeightBasisLabel: string;
  public dryWeightBasisLabel: string;

  constructor() {
  }

  public setLanguage(dialectTranslation: { COMMON: Common; OUTPUT: Output; }) {
    let commonDialect = dialectTranslation.COMMON;
    let outputDialect = dialectTranslation.OUTPUT;

    this.kgPerSackLabel = commonDialect.UNIT.KG_PER_SACK;
    this.freshWeightBasisLabel = commonDialect.FRESH_WEIGHT;
    this.dryWeightBasisLabel = commonDialect.DRY_WEIGHT;

    this.targetYieldForYourLabel = outputDialect.THE_TARGET_YIELD_FOR_YOUR;
    this.farmlotIsLabel = outputDialect.FARM_LOT_IS;
    this.hectareLabel = outputDialect.HECTARE;
    this.sacksAtLabel = outputDialect.SACKS_AT;
  }

  public targetYieldOutput(fieldSize: number, farmLotName: string) {
    return { 'text': this.targetYieldForYourLabel + ' ' + fieldSize + this.hectareLabel + ' ' +  farmLotName + ' ' +  this.farmlotIsLabel };
  }

  public attainableYieldOutput(displaySacks: number, displayKg: number) {
    return { 'text':  displaySacks + ' ' +  this.sacksAtLabel + ' ' +  displayKg + ' ' +  this.kgPerSackLabel };
  }

  public freshWeightOutput(freshWeight: number) {
    return { 'text': freshWeight + ' t/ha ('+this.freshWeightBasisLabel+')' };
  }

  public dryWeightOutput(dryWeight: number) {
    return { 'text': dryWeight + ' t/ha ('+this.dryWeightBasisLabel+')' };
  }

}
