import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TargetYieldModel } from 'src/app/recommendation/model/target-yield.model';
import { FieldInfoRecommendationModel } from 'src/app/recommendation/model/field-info-recommendation.model';
import { WaterSource } from 'src/app/recommendation/enum/water-source.enum';
import { IRRIGATED, RAINFED } from 'src/app/recommendation/constant/field-season-description.constant';
import { Establishment } from 'src/app/recommendation/enum/establishment.enum';
import { FertlizerRatesFormOutputModel } from 'src/app/recommendation/model/fertlizer-rates-form-output.model';
import { TimingAndFertilizerSourcesModel } from 'src/app/recommendation/model/timing-and-fertilizer-sources-model';
import { OtherCropManagementModel } from 'src/app/recommendation/model/other-crop-management.model';
import { RecommendationAsPdfService } from "src/app/recommendation/services/recommendation-as-pdf.service";
import { RecommendationModel } from 'src/app/recommendation/model/recommendation-model';
import { Image } from '@svgdotjs/svg.js';
import { FarmingRecommendationPracticesOutputModel } from 'src/app/recommendation/model/farming-recommendation-practices-output.model';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { DAYS_AFTER_SOWING, DAYS_AFTER_EMERGENCE, DAYS_AFTER_TRANSPLANTING, DAYS_AFTER_TRANSPLANTING_ACRONYM, DAYS_AFTER_EMERGENCE_ACRONYM, DAYS_AFTER_SOWING_ACRONYM } from 'src/app/recommendation/constant/label-days-after-crop-establishment.constant';
import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';
import { DownloadService } from 'src/app/core/services/download/download.service';
import { SmsDialectModel } from 'src/app/recommendation/model/sms-dialect.model';
import { DialectTranslationService } from 'src/app/recommendation/services/dialect-translation.service';


@Component({
  selector: 'app-recommendation-summary',
  templateUrl: './recommendation-summary.component.html',
  styleUrls: ['./recommendation-summary.component.scss'],
})
export class RecommendationSummaryComponent implements OnInit {

  @Input() wasTheRecommendationSaved: boolean;
  @Input() pdfFile: string;
  @Input() temporaryReferenceId: string;
  @Output() saveRecommendation: EventEmitter<any> = new EventEmitter<any>();

  private _targetYield;
  @Input() public set targetYield(targetYield: TargetYieldModel) {
    this._targetYield = targetYield;

  }
  public get targetYield() {
    return this._targetYield;
  }

  private _fieldInfoRecommendation;
  @Input() public set fieldInfoRecommendation(fieldInfoRecommendation: FieldInfoRecommendationModel) {
    this._fieldInfoRecommendation = fieldInfoRecommendation;

  }
  public get fieldInfoRecommendation() {
    return this._fieldInfoRecommendation;
  }

  private _fertilizerRates;
  @Input() public set fertilizerRates(fertilizerRates: FertlizerRatesFormOutputModel) {
    this._fertilizerRates = fertilizerRates;

  }
  public get fertilizerRates() {
    return this._fertilizerRates;
  }

  private _fertilizerRecommendationModel;
  @Input() public set fertilizerRecommendationModel(fertilizerRecommendationModel: TimingAndFertilizerSourcesModel) {
    this._fertilizerRecommendationModel = fertilizerRecommendationModel;

  }
  public get fertilizerRecommendationModel() {
    return this._fertilizerRecommendationModel;
  }

  private _otherCropManagement;
  @Input() public set otherCropManagement(otherCropManagement: OtherCropManagementModel) {
    this._otherCropManagement = otherCropManagement;

  }
  public get otherCropManagement() {
    return this._otherCropManagement;
  }

  private _smsAndDialect;
  @Input() public set smsAndDialect(smsAndDialect: SmsDialectModel) {
    this._smsAndDialect = smsAndDialect;

  }
  public get smsAndDialect() {
    return this._smsAndDialect;
  }

  @Input() farmerNameDisplay: string;
  @Input() recommendationReferenceId: number;
  @Input() farmingPractices: FarmingRecommendationPracticesOutputModel;
  public dateGenerated: Date;

  private _recommendation;
  @Input() public set recommendationModel(recommendation: RecommendationModel) {
    this._recommendation = recommendation;
    if (!recommendation) {
      this._recommendation = null;
      this.dateGenerated = new Date();
    } else {
      this.recommendationReferenceId = this.recommendationModel.refId;
      this.dateGenerated = new Date(this.recommendationModel.dateGenerated);
    }
  }

  public get recommendationModel() {
    return this._recommendation;
  }

  public get dialectSelected() {
    return this.dialectTranslationService.getDialectSelected();
  }

  public isRecommendationForUpdate: boolean;

  constructor(
    private recommendationPdfService: RecommendationAsPdfService,
    public translateService: TranslateService,
    public datePipe: DatePipe,
    public downloadService: DownloadService,
    private router: Router,
    private dialectTranslationService: DialectTranslationService,
  ) { 
    const urlPath = this.router.routerState.snapshot.url;
    const recommendationUrlUpdate = urlPath.split('/').slice(-1)[0];
    this.isRecommendationForUpdate = recommendationUrlUpdate == "update";
  }

  public get waterPump() {
    let waterPump = '';
    if (this.fieldInfoRecommendation) {
      if (
        this.fieldInfoRecommendation.useGasolineDieselOrElectricity === YesNo.YES ||
        this.fieldInfoRecommendation.hasAccessToPump === YesNo.YES
      ) {
        waterPump = 'WITH_PUMP';
      } else {
        waterPump = 'NO_PUMP';
      }
    }
    return waterPump;
  }

  public get waterRegime() {
    let waterRegime = '';
    if (this.fieldInfoRecommendation) {
      if (this.fieldInfoRecommendation.waterSource === WaterSource.IRRIGATED) {
        waterRegime = IRRIGATED;
      } else {
        waterRegime = RAINFED;
      }
    }
    return waterRegime;
  }

  public get cropEstablishment() {
    let cropEstablishment = ""
    if (this.targetYield) {
      if (this.targetYield.establishment === Establishment.MANUAL.toString()) {
        cropEstablishment = 'MANUAL';
      } else if (this.targetYield.establishment === Establishment.MECHANICAL.toString()) {
        cropEstablishment = 'MECHANICAL';
      } else if (this.targetYield.establishment === Establishment.DRY.toString()) {
        cropEstablishment = 'DRY';
      } else if (this.targetYield.establishment === Establishment.WET.toString()) {
        cropEstablishment = 'WET';
      }
    }
    return cropEstablishment;
  }

  startDownloadAsPdf() {
    if (this.pdfFile) {
      const farmerSplitName = this.farmerNameDisplay.split(" ").join("_");
      const fileName = farmerSplitName + "_" + this.recommendationModel.refId + '.pdf';
      this.downloadService.downloader(this.pdfFile, fileName)
      
    } else {
      this.initPDFProperties();
      const fileName = this.farmerNameDisplay.split(" ").join("_");
      this.recommendationPdfService.setDownloadAction(
        fileName,
        this.temporaryReferenceId
      );
    }
  }

  public async onSaveRecommendation() {
    this.initPDFProperties();
    const pdfBlob = await this.recommendationPdfService.getBase64String();
    this.saveRecommendation.emit(pdfBlob);
  }

  public timelineImage: Image;

  public getTimeline($event) {
    this.timelineImage = $event;
    this.initPDFProperties();
  }

  public initPDFProperties() {
    this.recommendationPdfService.defineDocProperties(
      this.fieldInfoRecommendation,
      this.targetYield,
      this.fertilizerRecommendationModel,
      this.timelineImage,
      this.farmingPractices,
      this.farmerNameDisplay,
      this.dateGenerated,
      this.activeTilleringHighDisplay,
      this.panicleInitiationLowDay,
      this.panicleInitiationHighDay,
    );
  }

  public get activeTilleringHighDisplay() {
    let activeTilleringHighDisplay = 0;

    if (this.fertilizerRecommendationModel) {
      const addDaysShort = 2;
      const addDaysMedium = 4;
      const addDaysLong = 8;
      const shortDaysDuration = 17;
      const mediumDaysDuration = 24;

      const panicleInitiationHighDay = this.fertilizerRecommendationModel.growthDuration.panicleInitiationHigh;
      const activeTilleringLowDay = this.fertilizerRecommendationModel.growthDuration.activeTilleringLow;

      const daysDifference = (panicleInitiationHighDay - activeTilleringLowDay);

      if (daysDifference < shortDaysDuration) {
        activeTilleringHighDisplay += addDaysShort;

      } else if (daysDifference >= shortDaysDuration && daysDifference < mediumDaysDuration) {
        activeTilleringHighDisplay += addDaysMedium;

      } else {
        activeTilleringHighDisplay += addDaysLong;
      }

    }

    return activeTilleringHighDisplay;
  }

  public get daysAfterLabel() {
    let daysAfterLabel = '';

    if (this.targetYield) {
      const cropEstablishment = parseInt(this.targetYield.establishment, 10);
      if (cropEstablishment === Establishment.WET) {
        daysAfterLabel = DAYS_AFTER_SOWING;
      } else if (cropEstablishment === Establishment.DRY) {
        daysAfterLabel = DAYS_AFTER_EMERGENCE;
      } else {
        daysAfterLabel = DAYS_AFTER_TRANSPLANTING;
      }

    }

    return daysAfterLabel;
  }

  public get cropEstablishShortLabel() {
    let cropEstablishShortLabel = '';
    if (this.targetYield) {
      const cropEstablishment = parseInt(this.targetYield.establishment, 10);
      if (cropEstablishment === Establishment.MANUAL || cropEstablishment === Establishment.MECHANICAL) {
        cropEstablishShortLabel = 'TRANSPLANTING';
      } else if (cropEstablishment === Establishment.DRY) {
        cropEstablishShortLabel = 'SOWING';
      } else {
        cropEstablishShortLabel = 'EMERGENCE';
      }
    }
    return cropEstablishShortLabel;
  }

  public get daysAfterAcronym() {
    let daysAfterAcronym = '';
    if (this.targetYield) {
      const cropEstablishment = parseInt(this.targetYield.establishment, 10);
      if (cropEstablishment === Establishment.MANUAL || cropEstablishment === Establishment.MECHANICAL) {
        daysAfterAcronym = DAYS_AFTER_TRANSPLANTING_ACRONYM;
      } else if (cropEstablishment === Establishment.DRY) {
        daysAfterAcronym = DAYS_AFTER_EMERGENCE_ACRONYM;
      } else {
        daysAfterAcronym = DAYS_AFTER_SOWING_ACRONYM;
      }
    }
    return daysAfterAcronym;
  }

  public get panicleInitiationLowDay() {
    let panicleInitiationLowDisplay = 0;

    if (this.fertilizerRecommendationModel) {
      const addDays = 3;
      const panicleInitiationLow = this.fertilizerRecommendationModel.growthDuration.panicleInitiationLow;
      panicleInitiationLowDisplay = panicleInitiationLow + addDays;
    }

    return panicleInitiationLowDisplay;
  }

  public get panicleInitiationHighDay() {
    let panicleInitiationHighDisplay = 0;

    if (this.fertilizerRecommendationModel) {
      const addDays = 3;
      const panicleInitiationHigh = this.fertilizerRecommendationModel.growthDuration.panicleInitiationHigh;
      panicleInitiationHighDisplay = panicleInitiationHigh + addDays;
    }

    return panicleInitiationHighDisplay;
  }

  ngOnInit() { }
}
