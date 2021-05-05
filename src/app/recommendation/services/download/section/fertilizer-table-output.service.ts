import { Injectable } from '@angular/core';
import { KgToBagsPipe } from 'src/app/recommendation/pipe/kg-to-bags.pipe';
import { CapitalizePipe } from 'src/app/v2/shared/pipe/capitalize.pipe';
import { Common, TimingAndSplitting  } from 'src/app/recommendation/model/translation.model';

@Injectable({
  providedIn: 'root'
})
export class FertilizerTableOutputService {

  public daysAfterTranplantingLabel: string;
  public middleSeedlingAgeLabel: string;
  public lateSeedlingAgeLabel: string;

  public growthStageLabel: string;
  public earlyStageLabel: string;
  public activeTilleringStageLabel: string;
  public panicleInitiationStageLabel: string;
  public headingStageLabel: string;
  public fertilizerAmountLabel: string;

  public bagLabel: string;
  public pluralBagLabel: string;
  public andConjuctionLabel: string;
  public kilogramLabel: string;

  constructor(
    private kgToPipe: KgToBagsPipe,
    private capitalizePipe: CapitalizePipe,
  ) { }

  public setLanguage(
    dialectTranslation: { COMMON: Common; TIMING_AND_SPLITTING: TimingAndSplitting; },
    farmSize: number,
  ) {

    let commonDialect = dialectTranslation.COMMON;
    let timingAndSplittingDialect = dialectTranslation.TIMING_AND_SPLITTING;

    this.daysAfterTranplantingLabel = this.capitalizePipe.transform(commonDialect.CROP_ESTABLISHMENT_SHORT_LABEL.TRANSPLANTING);
    this.middleSeedlingAgeLabel = commonDialect.SEEDLING_AGE.MIDDLE_SEEDLING_AGE;
    this.lateSeedlingAgeLabel = commonDialect.SEEDLING_AGE.LATE_SEEDLING_AGE;
    this.bagLabel = commonDialect.UNIT.BAG;
    this.pluralBagLabel = commonDialect.UNIT.BAGS;
    this.andConjuctionLabel = commonDialect.AND;
    this.kilogramLabel = commonDialect.UNIT.KG;

    this.growthStageLabel = timingAndSplittingDialect.GROWTH_STAGES.LABEL;
    this.earlyStageLabel = timingAndSplittingDialect.GROWTH_STAGES.EARLY;
    this.activeTilleringStageLabel = timingAndSplittingDialect.GROWTH_STAGES.ACTIVE_TILLERING;
    this.panicleInitiationStageLabel = timingAndSplittingDialect.GROWTH_STAGES.PANICLE_INITIATION;
    this.headingStageLabel = timingAndSplittingDialect.GROWTH_STAGES.HEADING;

    let dialectFertilizerAmountForSelectedFarmSize = timingAndSplittingDialect.FERTILIZER_AMOUNT_FOR_SELECTED_FARM_SIZE;

    this.fertilizerAmountLabel = dialectFertilizerAmountForSelectedFarmSize + " " + farmSize + " " + commonDialect.UNIT.HECTARE;
  }

  public defineTableHeader(show21DaysSeedling: boolean) {

    const tableHeader = [
      { text: this.growthStageLabel, rowSpan: 2 },
      { text: this.capitalizePipe.transform(this.daysAfterTranplantingLabel) + '\n(' + this.middleSeedlingAgeLabel + ')', colSpan: 2, rowSpan: 2 },
      { text: '' },
      { text: this.fertilizerAmountLabel, colSpan: 3 },
      '',
      ''
    ];

    if (show21DaysSeedling) {
      tableHeader[1] = { text: this.capitalizePipe.transform(this.daysAfterTranplantingLabel) + '\n(' + this.middleSeedlingAgeLabel + ')', rowSpan: 2 };
      tableHeader[2] = { text: this.capitalizePipe.transform(this.daysAfterTranplantingLabel) + '\n(' + this.lateSeedlingAgeLabel + ')', rowSpan: 2 };
    }

    return tableHeader;
  }

  public defineFertilizerName(
    show21DaysSeedling: boolean,
    showEarlyFert: string,
    ureaAmmosul: string,
    showMOPFert: boolean
  ) {
    const mopFertilizer = 'MOP (0-0-60)';

    const fertNames = [
      '',
      { text: '', colSpan: 2 },
      '',
      { text: '', colSpan: 1 },
      { text: '', colSpan: 1 },
      { text: '', colSpan: 1 },
    ];

    if (show21DaysSeedling) {
      fertNames[1] = { text: '', colSpan: 1 };
    }

    if (showEarlyFert) {
      fertNames[3] = showEarlyFert;

      if (ureaAmmosul) {
        fertNames[4] = { text: ureaAmmosul, colSpan: showMOPFert ? 1 : 2 };
      }

      if (showMOPFert) {
        fertNames[5] = { text: mopFertilizer, colSpan: 1 };
      }
    } else {
      if (ureaAmmosul) {
        fertNames[3] = { text: ureaAmmosul, colSpan: showMOPFert ? 1 : 2 };
      }

      if (showMOPFert) {
        fertNames[4] = { text: mopFertilizer, colSpan: 2 };
      }
    }

    return fertNames;
  }

  public setBasalApplicationRow(
      show21DaysSeedling: boolean,
      earlyLow: string,
      earlyHigh: number,
      earlyLow21daysSeedling: string,
      earlyHigh21daysSeedling: number,
      showEarlyFert: boolean,
      showMOPFert: boolean,
      fertilizerSources0: number,
      fertilizerSources1: number,
      fertilizerSources2: number
    ) {

    const basalRange = String(earlyLow) + '-' + String(earlyHigh);
    const basalRange21daysSeedling = earlyLow21daysSeedling + '-' + earlyHigh21daysSeedling;

    const basalDays: any = [
      this.earlyStageLabel,
      { text: basalRange21daysSeedling, colSpan: 1 },
      basalRange,
      { text: '---', colSpan: 1 },
      { text: '---', colSpan: 1 },
      { text: '---', colSpan: 1 },
    ];

    if (!show21DaysSeedling) {
      basalDays[1] = { text: basalRange, colSpan: 2 };
      basalDays[2] = '';
    } else {
      basalDays[1] = { text: basalRange };
      basalDays[2] = { text: basalRange21daysSeedling };
    }

    if (showEarlyFert) {
      if (fertilizerSources0) {
        basalDays[3] = String(this.kgToPipe.transform(fertilizerSources0, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel]));
      }

      if (fertilizerSources1) {
        basalDays[4] = { text: String(this.kgToPipe.transform(fertilizerSources1, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: showMOPFert ? 1 : 2 };
      } else {
        basalDays[4] = { text: '---', colSpan: showMOPFert ? 1 : 2 };
      }

      if (showMOPFert && fertilizerSources2) {
        basalDays[5] = String(this.kgToPipe.transform(fertilizerSources2, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel]));
      }
    } else {
      if (fertilizerSources1) {
        basalDays[3] = { text: String(this.kgToPipe.transform(fertilizerSources1, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: showMOPFert ? 1 : 2 };
      }

      if (showMOPFert) {
        if (fertilizerSources2) {
          basalDays[4] = { text: String(this.kgToPipe.transform(fertilizerSources2, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: 2 };
        } else {
          basalDays[4] = { text: '---', colSpan: 2 };
        }
      }
    }

    return basalDays;
  }

  public setActiveTilleringApplicationRow(
      show21DaysSeedling: boolean,
      activeTilleringLow: number,
      activeTilleringHigh: number,
      activeTilleringLow21daysSeedling: number,
      activeTilleringHigh21daysSeedling: number,
      showEarlyFert: boolean,
      showMOPFert: boolean,
      fertilizerSources0: number,
      fertilizerSources1: number,
      fertilizerSources2: number) {

    const atRange = String(activeTilleringLow) + '-' + String(activeTilleringHigh);
    const atRange21daysSeedling = activeTilleringLow21daysSeedling + '-' + activeTilleringHigh21daysSeedling;

    const atDays = [
      this.activeTilleringStageLabel,
      { text: atRange21daysSeedling, colSpan: 1 },
      atRange,
      { text: '---', colSpan: 1 },
      { text: '---', colSpan: 1 },
      { text: '---', colSpan: 1 },
    ];

    if (!show21DaysSeedling) {
      atDays[1] = { text: atRange, colSpan: 2 };
      atDays[2] = '';
    } else {
      atDays[1] = { text: atRange, colSpan: 1 };
      atDays[2] = { text: atRange21daysSeedling, colSpan: 1 };
    }

    if (showEarlyFert) {
      if (fertilizerSources0) {
        atDays[3] = String(this.kgToPipe.transform(fertilizerSources0, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel]));
      }

      if (fertilizerSources1) {
        atDays[4] = { text: String(this.kgToPipe.transform(fertilizerSources1, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: showMOPFert ? 1 : 2 };
      }

      if (showMOPFert && fertilizerSources2) {
        atDays[5] = String(this.kgToPipe.transform(fertilizerSources2, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel]));
      }
    } else {
      if (fertilizerSources1) {
        atDays[3] = { text: String(this.kgToPipe.transform(fertilizerSources1, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: showMOPFert ? 1 : 2 };
      }

      if (showMOPFert && fertilizerSources2) {
        atDays[4] = { text: String(this.kgToPipe.transform(fertilizerSources2, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: 2 };
      }
    }

    return atDays;
  }


  public setPannicleInitiationApplicationRow(
      show21DaysSeedling: boolean,
      panicleInitiationLow: number,
      panicleInitiationHigh: number,
      panicleInitiationLow21daysSeedling: number,
      panicleInitiationHigh21daysSeedling: number,
      showEarlyFert: boolean,
      showMOPFert: boolean,
      fertilizerSources0: number,
      fertilizerSources1: number,
      fertilizerSources2: number
    ) {

    const piRange = String(panicleInitiationLow) + '-' + String(panicleInitiationHigh);
    const piRange21daysSeedling = panicleInitiationLow21daysSeedling + '-' + panicleInitiationHigh21daysSeedling;
    const piDays: any = [
      this.panicleInitiationStageLabel,
      { text: piRange21daysSeedling, colSpan: 1 },
      piRange,
      { text: '---', colSpan: 1 },
      { text: '---', colSpan: 1 },
      { text: '---', colSpan: 1 },
    ];

    if (!show21DaysSeedling) {
      piDays[1] = { text: piRange, colSpan: 2 };
      piDays[2] = '';
    } else {
      piDays[1] = { text: piRange };
      piDays[2] = { text: piRange21daysSeedling };
    }

    if (showEarlyFert) {
      if (fertilizerSources0) {
        piDays[3] = String(this.kgToPipe.transform(fertilizerSources0, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel]));
      }

      if (fertilizerSources1) {
        piDays[4] = { text: String(this.kgToPipe.transform(fertilizerSources1, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: showMOPFert ? 1 : 2 };
      } else {
        piDays[4] = { text: '---', colSpan: showMOPFert ? 1 : 2 };
      }

      if (showMOPFert && fertilizerSources2) {
        piDays[5] = String(this.kgToPipe.transform(fertilizerSources2, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel]));
      }
    } else {
      if (fertilizerSources1) {
        piDays[3] = { text: String(this.kgToPipe.transform(fertilizerSources1, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: showMOPFert ? 1 : 2 };
      }

      if (showMOPFert) {
        if (fertilizerSources2) {
          piDays[4] = { text: String(this.kgToPipe.transform(fertilizerSources2, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: 2 };
        } else {
          piDays[4] = { text: '---', colSpan: 2 };
        }
      }
    }

    return piDays;
  }

  public setHeadingApplicationRow(
      show21DaysSeedling: boolean,
      headingLow: number,
      headingHigh: number,
      headingLow21daysSeedling: number,
      headingHigh21daysSeedling: number,
      showEarlyFert: boolean,
      showMOPFert: boolean,
      fertilizerSources0: number,
      fertilizerSources1: number,
      fertilizerSources2: number
    ) {

    const hdRange = String(headingLow) + '-' + String(headingHigh);
    const hdRange21daysSeedling = headingLow21daysSeedling + '-' + headingHigh21daysSeedling;
    const hdDays: any = [
      this.headingStageLabel,
      { text: hdRange21daysSeedling, colSpan: 1 },
      hdRange,
      { text: '---', colSpan: 1 },
      { text: '---', colSpan: 1 },
      { text: '---', colSpan: 1 },
    ];

    if (!show21DaysSeedling) {
      hdDays[1] = { text: hdRange, colSpan: 2 };
      hdDays[2] = '';
    } else {
      hdDays[1] = { text: hdRange };
      hdDays[2] = { text: hdRange21daysSeedling };
    }

    if (showEarlyFert) {
      if (fertilizerSources0) {
        hdDays[3] = String(this.kgToPipe.transform(fertilizerSources0, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel]));
      }

      if (fertilizerSources1) {
        hdDays[4] = { text: String(this.kgToPipe.transform(fertilizerSources1, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: showMOPFert ? 1 : 2 };
      }

      if (showMOPFert && fertilizerSources2) {
        hdDays[5] = String(this.kgToPipe.transform(fertilizerSources2, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel]));
      }
    } else {
      if (fertilizerSources1) {
        hdDays[3] = { text: String(this.kgToPipe.transform(fertilizerSources1, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: showMOPFert ? 1 : 2 };
      }

      if (showMOPFert && fertilizerSources2) {
        hdDays[4] = { text: String(this.kgToPipe.transform(fertilizerSources2, ...['---', this.bagLabel, this.andConjuctionLabel, this.kilogramLabel, this.pluralBagLabel])), colSpan: 2 };
      }
    }

    return hdDays;
  }

  public defineTableColumns(
    show21DaysSeedling: boolean
  ) {
    let tblCols = ['16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%']
    return tblCols;
  }


}
