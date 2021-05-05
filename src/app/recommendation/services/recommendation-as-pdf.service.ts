import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { Injectable } from '@angular/core';
import { HeaderService } from 'src/app/recommendation/services/download/section/header.service';
import { FooterService } from 'src/app/recommendation/services/download/section/footer.service';
import { FarmerAndFieldInfoService } from 'src/app/recommendation/services/download/section/farmer-and-field-info.service';
import { TargetYieldOutputService } from 'src/app/recommendation/services/download/section/target-yield-output.service';
import { RecommendationValidityNoteService } from 'src/app/recommendation/services/download/section/recommendation-validity-note.service';
import { OtherManagementOutputService } from 'src/app/recommendation/services/download/section/other-management-output.service';
import { FertilizerTableOutputService } from 'src/app/recommendation/services/download/section/fertilizer-table-output.service';
import { WaterSource } from 'src/app/recommendation/enum/water-source.enum';
import { FieldInfoRecommendationModel } from '../model/field-info-recommendation.model';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';
import { TimingAndFertilizerSourcesModel } from 'src/app/recommendation/model/timing-and-fertilizer-sources-model';
import { TargetYieldModel } from 'src/app/recommendation/model/target-yield.model';
import { MonthPipe } from 'src/app/recommendation/pipe/month.pipe';

import * as pdfMake from 'pdfmake/build/pdfmake';
import { Image } from '@svgdotjs/svg.js';
import { FarmingRecommendationPracticesOutputModel } from '../model/farming-recommendation-practices-output.model';
import { take } from 'rxjs/operators';
import { WaterSource as WaterSourceAnswer, RecommendationSummary, CropEstablishment, Month, TimingAndSplitting } from "src/app/recommendation/model/translation.model";
import { Establishment } from 'src/app/recommendation/enum/establishment.enum';
import { DialectTranslationService } from 'src/app/recommendation/services/dialect-translation.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationAsPdfService {

  public dialect: string;
  public definedDoc: object;
  private loggedInUser: UserLoginModel;

  constructor(
    private headerService: HeaderService,
    private footerService: FooterService,
    private farmerAndFieldService: FarmerAndFieldInfoService,
    private targetYieldOuputService: TargetYieldOutputService,
    private recommendationNoteService: RecommendationValidityNoteService,
    private otherManagementService: OtherManagementOutputService,
    private fertilizerTableService: FertilizerTableOutputService,
    private authService: AuthenticationService,
    private monthPipe: MonthPipe,
    private dialectTranslationService: DialectTranslationService,
  ) {
    if (this.authService.isAuthenticated()) {
      this.loggedInUser = authService.loggedInUser;
    }
  }

  public timingAndSplittingLabel: string;

  public async defineDocProperties(
    fieldInfoRecommendationModel: FieldInfoRecommendationModel,
    targetYieldModel: TargetYieldModel,
    fertilizerRecommendationModel: TimingAndFertilizerSourcesModel,
    timelineImage: Image,
    farmingPractices: FarmingRecommendationPracticesOutputModel,
    farmerNameDisplay: string,
    dateGenerated: Date,
    activeTilleringHighDisplay: number,
    panicleInitiationLowDay: number,
    panicleInitiationHighDay: number,
  ) {

    this.dialect = this.dialectTranslationService.getDialectSelected();
    const dialectObject = await this.dialectTranslationService.getDialectTranslation(this.dialect).pipe(take(1)).toPromise();
    const dialectTranslation = dialectObject.default;

    this.farmerAndFieldService.setLanguage(dialectTranslation);
    this.targetYieldOuputService.setLanguage(dialectTranslation);
    this.recommendationNoteService.setLanguage(dialectTranslation);
    this.fertilizerTableService.setLanguage(dialectTranslation, fieldInfoRecommendationModel.selectedFarmSize);
    this.otherManagementService.setLanguage(dialectTranslation,
      activeTilleringHighDisplay,
      panicleInitiationLowDay,
      panicleInitiationHighDay,
      farmingPractices,
      parseInt(targetYieldModel.establishment, 10),
      fieldInfoRecommendationModel.selectedFarmSize);

    let timingAndSplittingDialect = dialectTranslation.TIMING_AND_SPLITTING as TimingAndSplitting;
    let dialectTableHeading = timingAndSplittingDialect.TABLE_HEADING;
    this.timingAndSplittingLabel = dialectTableHeading;

    let waterRegime = this.getWaterRegimeTranslate(
      dialectTranslation,
      fieldInfoRecommendationModel.waterSource,
      fieldInfoRecommendationModel.useGasolineDieselOrElectricity === YesNo.YES ||
      fieldInfoRecommendationModel.hasAccessToPump === YesNo.YES
    );

    const pdfHeader = this.headerService.pdfFormattedHeader();
    const pdfFooter = this.footerService.createPdfFormattedFooter(this.loggedInUser);
    
    const sowingDate = new Date(targetYieldModel.sowingDate);
    const sowingMonth = this.monthPipe.transform(sowingDate);
    const sowingYear = sowingDate.getFullYear();

    const dateGeneratedTranslate = this.getDateGeneratedTranslate(dialectTranslation, dateGenerated);
    const sowingDateTranslate = this.getSowingDateTranslate(
      dialectTranslation,
      sowingDate);
    const cropEstablishmentTranslate = this.getCropEstablishmentTranslate(dialectTranslation, parseInt(targetYieldModel.establishment, 10));

    const farmerNfield = this.farmerAndFieldService.pdfFormattedFarmerFieldInfo(
      farmerNameDisplay,
      fieldInfoRecommendationModel.farmLotName,
      fieldInfoRecommendationModel.farmLotAddress,
      dateGeneratedTranslate,
      waterRegime,
      cropEstablishmentTranslate,
      targetYieldModel.varietyNameLabel,
      sowingDateTranslate
    );

    const targetYield = this.targetYieldOuputService.targetYieldOutput(
      fieldInfoRecommendationModel.selectedFarmSize,
      fieldInfoRecommendationModel.farmLotName
    );

    const attainableYield = this.targetYieldOuputService.attainableYieldOutput(
      targetYieldModel.targetYieldSackCount,
      targetYieldModel.targetYieldKgPerSack
    );

    const dryWeightValue = this.targetYieldOuputService.dryWeightOutput(targetYieldModel.dryWeightOutput);

    const freshWeightValue = this.targetYieldOuputService.freshWeightOutput(targetYieldModel.freshWeightOutput);
    const sowingMonthTranslate = this.getMonthTranslate(dialectTranslation, sowingMonth);

    const recommendationNote = this.recommendationNoteService.recommendationValidityNote(
      sowingMonthTranslate,
      String(sowingYear)
    );

    // FARMING PRACTICES
    const zincApp = this.otherManagementService.zincApplication(
      farmingPractices.isZincDeficientDisplayed,
    );

    const qualitySeeds = this.otherManagementService.qualitySeeds(
      farmingPractices.isQualitySeedsDisplayed);

    const use21DaysSeeds = this.otherManagementService.use21DaysSeeds(
      farmingPractices.isTwentyOneDaysDisplayed,
    );

    const handWeeding = this.otherManagementService.handWeeding(
      farmingPractices.isWeedManagementDisplayed,
    );

    const insecticideApplication = this.otherManagementService.insecticideApplication(
      farmingPractices.isSprayInsecticideDisplayed);

    const fiveCmIrrigationDept = this.otherManagementService.keepFloodedWater(
      farmingPractices.isWaterManagementDisplayed,
    );

    const irrigationPump = this.otherManagementService.irrigationPump(
      farmingPractices.isControlIrrigationDisplayed,
    );

    const irrigateAtFlowering = this.otherManagementService.irrigateAtFlowering(
      farmingPractices.isIrrigateAtFloweringDisplayed,
    );

    const fertAppDelay = this.otherManagementService.fertilizerApplicationDelay(
      farmingPractices.isDelayFertilizerApplicationDisplayed);
    // END OF FARMING PRACTICES


    const fertilizerTableHeader = this.fertilizerTableService.defineTableHeader(
      fertilizerRecommendationModel.show21DaysSeedling,
    );

    const fertilizerTableColumnCount = this.fertilizerTableService.defineTableColumns(fertilizerRecommendationModel.show21DaysSeedling);

    const earlyFertilizerSource = fertilizerRecommendationModel.showEarlyFert ? fertilizerRecommendationModel.growthStages[0].fertilizerSources[0].fertilizerSource : "";

    const fertilizerTableFertilizerName = this.fertilizerTableService.defineFertilizerName(
      fertilizerRecommendationModel.show21DaysSeedling,
      earlyFertilizerSource,
      fertilizerRecommendationModel.ureaAmmosul,
      fertilizerRecommendationModel.showMOPFert
    );

    let earlyLow21daysSeedling = "";
    let earlyHigh21daysSeedling = 0;
    let activeTilleringLow21daysSeedling = 0;
    let activeTilleringHigh21daysSeedling = 0;
    let panicleInitiationLow21daysSeedling = 0;
    let panicleInitiationHigh21daysSeedling = 0;
    let headingLow21daysSeedling = 0;
    let headingHigh21daysSeedling = 0;

    if (!!fertilizerRecommendationModel.twentyOneDaysSeedling) {
      earlyLow21daysSeedling = fertilizerRecommendationModel.twentyOneDaysSeedling.earlyLow;
      earlyHigh21daysSeedling = fertilizerRecommendationModel.twentyOneDaysSeedling.earlyHigh;
      activeTilleringLow21daysSeedling = fertilizerRecommendationModel.twentyOneDaysSeedling.activeTilleringLow;
      activeTilleringHigh21daysSeedling = fertilizerRecommendationModel.twentyOneDaysSeedling.activeTilleringHigh;
      panicleInitiationLow21daysSeedling = fertilizerRecommendationModel.twentyOneDaysSeedling.panicleInitiationLow;
      panicleInitiationHigh21daysSeedling = fertilizerRecommendationModel.twentyOneDaysSeedling.panicleInitiationHigh;
      headingLow21daysSeedling = fertilizerRecommendationModel.twentyOneDaysSeedling.headingLow;
      headingHigh21daysSeedling = fertilizerRecommendationModel.twentyOneDaysSeedling.headingHigh;
    }

    const earlyFertilizer0 = !!fertilizerRecommendationModel.growthStages[0].fertilizerSources[0]
      ? fertilizerRecommendationModel.growthStages[0]
        .fertilizerSources[0].fertilizerAmount
      : 0;

    const earlyFertilizer1 = !!fertilizerRecommendationModel.growthStages[0].fertilizerSources[1]
      ? fertilizerRecommendationModel.growthStages[0]
        .fertilizerSources[1].fertilizerAmount
      : 0;

    let earlyFertilizer2 = 0;
    if (fertilizerRecommendationModel.pRate === 0
      && !!fertilizerRecommendationModel.growthStages[0].fertilizerSources[2]
    ) {
      earlyFertilizer2 = fertilizerRecommendationModel.growthStages[0].fertilizerSources[2].fertilizerAmount;
    }

    const fertilizerTableRowBasal = this.fertilizerTableService
      .setBasalApplicationRow(
        fertilizerRecommendationModel.show21DaysSeedling,
        fertilizerRecommendationModel.growthDuration.earlyLow,
        fertilizerRecommendationModel.growthDuration.earlyHigh,
        earlyLow21daysSeedling,
        earlyHigh21daysSeedling,
        fertilizerRecommendationModel.showEarlyFert,
        fertilizerRecommendationModel.showMOPFert,
        earlyFertilizer0,
        earlyFertilizer1,
        earlyFertilizer2
      );

    const activeTilleringFertilizer1 = fertilizerRecommendationModel.growthStages[1].fertilizerSources[0]
      .fertilizerAmount;

    const fertilizerTableRowActiveTillering = this.fertilizerTableService
      .setActiveTilleringApplicationRow(
        fertilizerRecommendationModel.show21DaysSeedling,
        fertilizerRecommendationModel.growthDuration.activeTilleringLow,
        fertilizerRecommendationModel.growthDuration.activeTilleringHigh,
        activeTilleringLow21daysSeedling,
        activeTilleringHigh21daysSeedling,
        fertilizerRecommendationModel.showEarlyFert,
        fertilizerRecommendationModel.showMOPFert,
        0,
        activeTilleringFertilizer1,
        0
      );

    const panicleInitiationFertilizer1 = fertilizerRecommendationModel.growthStages[2].fertilizerSources[0]
      .fertilizerAmount;

    const panicleInitiationFertilizer2 = fertilizerRecommendationModel.pRate === 0
      ? 0
      : fertilizerRecommendationModel.growthStages[2]
        .fertilizerSources[1].fertilizerAmount > 0
        ? fertilizerRecommendationModel.growthStages[2]
          .fertilizerSources[1].fertilizerAmount
        : 0

    const fertilizerTableRowPannicleInitiation = this.fertilizerTableService
      .setPannicleInitiationApplicationRow(
        fertilizerRecommendationModel.show21DaysSeedling,
        fertilizerRecommendationModel.growthDuration.panicleInitiationLow,
        fertilizerRecommendationModel.growthDuration.panicleInitiationHigh,
        panicleInitiationLow21daysSeedling,
        panicleInitiationHigh21daysSeedling,
        fertilizerRecommendationModel.showEarlyFert,
        fertilizerRecommendationModel.showMOPFert,
        0,
        panicleInitiationFertilizer1,
        panicleInitiationFertilizer2
      );

    const headingFertilizer1 = fertilizerRecommendationModel.growthStages[3].fertilizerSources[0]
      .fertilizerAmount;

    const fertilizerTableRowHeading = this.fertilizerTableService
      .setHeadingApplicationRow(
        fertilizerRecommendationModel.show21DaysSeedling,
        fertilizerRecommendationModel.growthDuration.headingLow,
        fertilizerRecommendationModel.growthDuration.headingHigh,
        headingLow21daysSeedling,
        headingHigh21daysSeedling,
        fertilizerRecommendationModel.showEarlyFert,
        fertilizerRecommendationModel.showMOPFert,
        0,
        headingFertilizer1,
        0
      );

    let fertilizerTableBody = [
      fertilizerTableHeader,
      fertilizerTableFertilizerName,
      fertilizerTableRowBasal
    ];

    if (fertilizerRecommendationModel.growthDuration.activeTilleringLow > 0 && fertilizerRecommendationModel.growthDuration.activeTilleringHigh > 0) {
      fertilizerTableBody.push(fertilizerTableRowActiveTillering);
    }

    if (fertilizerRecommendationModel.growthDuration.panicleInitiationLow > 0 && fertilizerRecommendationModel.growthDuration.headingHigh > 0) {
      fertilizerTableBody.push(fertilizerTableRowPannicleInitiation);
    }

    if (fertilizerRecommendationModel.showHeading) {
      fertilizerTableBody.push(fertilizerTableRowHeading);
    }

    const fertilizerTable = [
      { text: this.timingAndSplittingLabel, 'bold': true },
      {
        table: {
          headerRows: 3,
          widths: fertilizerTableColumnCount,
          body: fertilizerTableBody
        }
      }
    ];

    const farmingPracticeSection = [
      insecticideApplication,
      handWeeding,
      irrigationPump,
      qualitySeeds,
      use21DaysSeeds,
      fiveCmIrrigationDept,
      zincApp,
      irrigateAtFlowering,
      fertAppDelay
    ];

    const farmingPracticeArray = farmingPracticeSection.filter(content => content != "");
    
    const farmingPracticeCount = farmingPracticeArray.length;
    let farmingPracticesContentWidth = ["*"];
    let farmingPracticesContentBody = farmingPracticeArray;
    
    if (farmingPracticeCount > 1) {
      const halfLength = Math.ceil(farmingPracticeCount / 2);    
      const leftSide = farmingPracticeArray.slice(0,halfLength);
      const rightSide = farmingPracticeArray.slice(halfLength);

      farmingPracticesContentWidth = ["*", "*"];
      farmingPracticesContentBody = [leftSide, rightSide];
    }

    const farmingPracticesContent = [
      {
        layout: 'noBorders',
        table: {
          widths: farmingPracticesContentWidth,
          body: [
            farmingPracticesContentBody,
          ],
        }
      },
    ];
    
    let timelineYCoordinate = 350;

    if (farmingPracticeCount > 3) {
      if (farmingPractices.isControlIrrigationDisplayed == 1)
      {
        timelineYCoordinate = 500;
      } else {
        timelineYCoordinate = 520;
      }
    }

    const imageMultiplierInPdf = 0.75;
    const timeline = {
      image: timelineImage,
      width: 750 * imageMultiplierInPdf,
      height: 450 * imageMultiplierInPdf,
      absolutePosition: {x: 20, y: timelineYCoordinate}
    };

    this.definedDoc = {
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [20, 20, 20, 60],
      content: [
        pdfHeader,
        "\n",
        farmerNfield,
        "\n",
        recommendationNote,
        "\n",
        farmingPracticesContent,
        targetYield,
        attainableYield,
        dryWeightValue,
        freshWeightValue,
        "\n",
        fertilizerTable,
        timeline
      ],
      footer: function (currentPage: number, pageCount: number) {
        if (currentPage == pageCount) {
          return pdfFooter;
        }
      },
      defaultStyle: {
        fontSize: 10,
      }
    };
  }

  public setDownloadAction(filename: string, referenceId: number | string) {
    const refIdFileName = referenceId ? '_' + referenceId : '';
    const fileName = filename + refIdFileName + '.pdf';
    if (referenceId) {
      const referenceIdText = { text: ('Reference ID: ' + referenceId + ' \n'), bold: true };
      (this.definedDoc as any).content.splice(2, 0, referenceIdText);
    }

    pdfMake.createPdf(this.definedDoc).download(fileName);
  }

  public getWaterRegimeTranslate(
    dialectTranslation: { COMMON: { WATER_SOURCE: WaterSourceAnswer; }; RECOMMENDATION_SUMMARY: RecommendationSummary; },
    waterSource: number, 
    hasAccessToPump: boolean
  ) {

    let waterRegime = "";
    let waterPump = "";
    let waterSourceAnswer = "";
    let waterPumpAnswer = "";

    const isIrrigated = waterSource === WaterSource.IRRIGATED;

    if (isIrrigated) {
      waterRegime = 'IRRIGATED';
    } else {
      waterRegime = 'RAINFED';
    }

    if (hasAccessToPump) {
      waterPump = 'WITH_PUMP';
    } else {
      waterPump = 'NO_PUMP';
    }

    let waterSourceDialect = dialectTranslation.COMMON.WATER_SOURCE;
    waterSourceAnswer = waterSourceDialect[waterRegime];

    let waterPumpDialect = dialectTranslation.RECOMMENDATION_SUMMARY;
    waterPumpAnswer = waterPumpDialect[waterPump];

    return waterSourceAnswer + ", " + waterPumpAnswer;
  }

  public getCropEstablishmentTranslate(
    dialectTranslation: { COMMON: { CROP_ESTABLISHMENT: CropEstablishment; }; },
    establishment: Establishment
  ) {
    let cropEstablishment = "";
    let cropEstablishmentAnswer = '';

    if (establishment) {
      if (establishment === Establishment.MANUAL) {
        cropEstablishment = 'MANUAL';
      } else if (establishment === Establishment.MECHANICAL) {
        cropEstablishment = 'MECHANICAL';
      } else if (establishment === Establishment.DRY) {
        cropEstablishment = 'DRY';
      } else if (establishment === Establishment.WET) {
        cropEstablishment = 'WET';
      }

      let cropEstablishmentDialect = dialectTranslation.COMMON.CROP_ESTABLISHMENT;
      cropEstablishmentAnswer = cropEstablishmentDialect[cropEstablishment];
    }

    return cropEstablishmentAnswer;
  }

  public getDateGeneratedTranslate(
    dialectTranslation,
    dateGenerated: Date
  ) {
    const generatedMonth = this.monthPipe.transform(dateGenerated);
    const generatedMonthTranslate = this.getMonthTranslate(dialectTranslation, generatedMonth);
    const generatedDate = dateGenerated.getDate();
    const generatedYear = dateGenerated.getFullYear();

    return generatedMonthTranslate + ' ' + generatedDate + ', ' + generatedYear;
  }

  public getSowingDateTranslate(
    dialectTranslation, 
    sowingDate: Date
  ) {
    const sowMonth = this.monthPipe.transform(sowingDate);
    const sowMonthTranslate = this.getMonthTranslate(dialectTranslation, sowMonth);
    const sowDate = sowingDate.getDate();
    const sowYear = sowingDate.getFullYear();

    return sowMonthTranslate + ' ' + sowDate + ', ' + sowYear;
  }

  public getMonthTranslate(
    dialectTranslation: { COMMON: { MONTH: Month; }; }, 
    month: string
  ) {
    const monthUppercase = month.toUpperCase();
    let monthAnswer = '';

    let monthDialect = dialectTranslation.COMMON.MONTH;
    monthAnswer = monthDialect[monthUppercase];

    return monthAnswer;
  }

  public async getBase64String(referenceId?: number | string): Promise<any> {

    if (referenceId) {
      const referenceIdText = { text: ('Reference ID: ' + referenceId + ' \n'), bold: true };
      (this.definedDoc as any).content.splice(2, 0, referenceIdText);
    }

    const p = new Promise((resolve, reject) => {
      pdfMake.createPdf(this.definedDoc).getDataUrl((data: string) => {
        resolve(data);
      });
    });
    return p;
  }
  
}
