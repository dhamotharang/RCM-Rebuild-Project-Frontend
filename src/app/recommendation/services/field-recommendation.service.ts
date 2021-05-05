import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../../v2/core/services/error.service';
import { FieldRecommendationApiModel } from '../model/recommendation-form-models/field-recommendation-api.model';
import { RCMRecommendationListModel } from '../model/rcm-recommendation-list.model';
import { RecommendationModel } from '../model/recommendation-model';
import { RecommendationStorageService } from 'src/app/offline-management/services/recommendation-storage.service';
import { FarmLotModel } from '../model/recommendation-answer-models/farm-lot-model';
import { SetTargetYieldModel } from '../model/recommendation-answer-models/set-target-yield-model';
import { FertilizerRatesModel } from '../model/recommendation-answer-models/fertilizer-rates-model';
import { OtherCropManagementModel } from '../model/recommendation-answer-models/other-crop-management-model';
import { OrganicFertilizerRateModel } from '../model/organic-fertilizer-rate.model';
import { SmsDialectModel } from 'src/app/recommendation/model/sms-dialect.model';

const RECOMMENDATION_KEY = 'RECOMMENDATION';

@Injectable({
  providedIn: 'root'
})
export class FieldRecommendationService {
  private recommendationApiUrl = environment.recommendationApi;
  private recommendationPdfApiUrl = environment.recommendationPdfApi;
  private fieldApiUrl = environment.fieldApi;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  private httpOptions = {
    headers: this.headers
  };
  private offlineUrl = environment.offlineApi;

  constructor(
    private http: HttpClient, 
    private errorService: ErrorService,
    private offlineStorage: OfflineStorageService,
    private recommendationStorageService: RecommendationStorageService
  ) { }

  public saveRecommendation(recommendation: FieldRecommendationApiModel): Observable<FieldRecommendationApiModel> {
    return this.http.post<FieldRecommendationApiModel>(this.recommendationApiUrl, recommendation, this.httpOptions).pipe(
      catchError(this.errorService.handleError('RecommendationService', 'saveRecommendation'))
    );
  }

  public updateRecommendation(recommendation: FieldRecommendationApiModel) {
    const url = `${this.recommendationApiUrl}/${recommendation.refId}`;
    return this.http.put(url, recommendation).pipe(
      catchError(this.errorService.handleError('RecommendationService', 'updateRecommendation'))
    );
  }

  public updatePdfRecommendation(referenceId: number, pdf: string) {
    const updateData = {
      refId: referenceId,
      pdfFile: pdf
    };

    const url = `${this.recommendationPdfApiUrl}/${referenceId}`;
    return this.http.put(url, updateData).pipe(
      catchError(this.errorService.handleError('RecommendationService', 'updatePdfRecommendation'))
    );
  }

  public viewRecommendation(referenceId: number, temporaryRefId?: string, fieldId?: string): Observable<RecommendationModel> {
    return from(this.viewRecommendationAsync(referenceId, temporaryRefId, fieldId));
  }

  public async viewRecommendationAsync(referenceId: number, temporaryRefId?: string, fieldId?: string): Promise<RecommendationModel> {
    if (temporaryRefId) {
      const fieldRecommendation = await this.recommendationStorageService.get(temporaryRefId, 'temporaryRefId');
      return this.mapRecommendationModel(fieldRecommendation);
    } else {
      const url = `${this.recommendationApiUrl}/${referenceId}`;
      return this.http.get<RecommendationModel>(url, this.httpOptions).pipe(
        catchError(this.errorService.handleError('RecommendationService', 'viewRecommendation'))
      ).toPromise();
    }
  }

  private mapRecommendationModel(data: FieldRecommendationApiModel){
    const farmLot: FarmLotModel = {
      farmLotName: data.fieldInfoModel.farmLotName,

      farmLotAddress: data.fieldInfoModel.farmLotAddress,

      farmLotRegionId: data.fieldInfoModel.regionId,
      farmLotProvinceId: data.fieldInfoModel.provinceId,
      farmLotMunicipalityId: data.fieldInfoModel.municipalityId,
      farmLotBarangayId: data.fieldInfoModel.barangayId,

      isSelectedWholeFarmLotSize: data.fieldInfoModel.isSelectedWholeFarmLotSize,
      specifiedFarmLotSizeUnit: data.fieldInfoModel.specifiedFarmLotSizeUnit,
      specifiedFarmLotSize: data.fieldInfoModel.specifiedFarmLotSize,

      daProject: data.fieldInfoModel.daProject,
      specifiedDaProject: data.fieldInfoModel.specifiedDaProject,
      waterSource: data.fieldInfoModel.waterSource,

      isUsingPumpPoweredEquipment: data.fieldInfoModel.useGasolineDieselOrElectricity,
      hasPumpSupplyAccess: data.fieldInfoModel.hasAccessToPump
    };

    const targetYield: SetTargetYieldModel = {
      cropsPerYear: parseInt(data.targetYieldModel.timesPlantInAYear, 10),
      cropEstablishment: parseInt(data.targetYieldModel.establishment, 10),
      sowingDate: new Date(data.targetYieldModel.sowingDate),
      seedlingAge: parseInt(data.targetYieldModel.seedlingAge, 10),
      seedRate: data.targetYieldModel.seedRate,
      varietyType: parseInt(data.targetYieldModel.varietyType, 10),
      varietyName: data.targetYieldModel.varietyNameLabel,
      growthDuration: parseInt(data.targetYieldModel.growthDuration, 10),
      typicalYieldSacks: data.targetYieldModel.noOfSacks,
      typicalYieldKg: data.targetYieldModel.weightOfSack,
      previousVarietyType: parseInt(data.targetYieldModel.previousVariety, 10),
      upcomingSeedSource: parseInt(data.targetYieldModel.upcomingSeasonSeedSource, 10),
      previousSeedSource: parseInt(data.targetYieldModel.seedSource, 10),
      water: parseInt(data.targetYieldModel.recentYearsFarmLotDescription, 10),
    
      sowingMonth: new Date(data.targetYieldModel.sowingDate).getMonth(),
      sowingDay: new Date(data.targetYieldModel.sowingDate).getDay(),
      maxReportedYield: data.targetYieldModel.maxReportedYield,
      targetYieldSackCount: data.targetYieldModel.targetYieldSackCount,
      targetYieldKgPerSack: data.targetYieldModel.targetYieldKgPerSack,
      freshWeightOutput: data.targetYieldModel.freshWeightOutput,
      dryWeightOutput: data.targetYieldModel.dryWeightOutput,
      previousYield: data.targetYieldModel.previousYield,
      seedRateKilogramPerHectare: data.targetYieldModel.seedRateKgHa,
      season: data.targetYieldModel.season,
      potentialYieldOutput: data.targetYieldModel.potentialYieldOutput,
      normalFreshWeight: data.targetYieldModel.normalFreshWeight,
      normalDryWeight: data.targetYieldModel.normalDryWeight,
      varietyId: data.targetYieldModel.varietyName,
      estimatedHarvestMonth: data.targetYieldModel.estimatedHarvestMonth
    }

    const organicFert: OrganicFertilizerRateModel = {
      organicKRate: null,
      organicNRate: null,
      organicPRate: null
    };
    const fertilizerRates: FertilizerRatesModel = {
      previousCrop: data.fertlizerRatesModel.previousCrop,
      harvestType: data.fertlizerRatesModel.harvestType,
      previousYieldSacks: data.fertlizerRatesModel.immediateRiceHarvestSackCount,
      previousYieldKg: data.fertlizerRatesModel.immediateRiceHarvestKgPerSack,
      previousFreshWeight: null,
      previousDryWeight: null,
      previousYieldConversion: data.fertlizerRatesModel.previousFreshWeight,
      willApplyOrganicFertilizer: data.fertlizerRatesModel.willApplyOrganicFertlizer,
      organicBags: data.fertlizerRatesModel.organicFertlizerBagCount,
      organicWeight: data.fertlizerRatesModel.organicFertlizerKgPerBag,
      nRate: data.fertlizerRatesModel.nRate,
      kSplit: data.fertlizerRatesModel.kSplit,
      totalNRate: data.fertlizerRatesModel.totalNRate,
      totalPRate: data.fertlizerRatesModel.totalPRate,
      totalKRate: data.fertlizerRatesModel.totalKRate,
      soilFertility: data.fertlizerRatesModel.soilFertility,
      organicFertilizer: data.fertlizerRatesModel.organicFertilizer ? data.fertlizerRatesModel.organicFertilizer : organicFert,
      organicFertilizerConversion: data.fertlizerRatesModel.organicFertilizerRateConversion,
      organicFertilizerRate: data.fertlizerRatesModel.organicFertilizerRateConversion
    }

    const timingAndSplitting = data.timingSplittingModel;

    const otherCropManagement: OtherCropManagementModel = {
      applyInsecticide: data.otherCropManagementModel.applyInsecticide,
      synchronizing: data.otherCropManagementModel.synchronizing,
      weedControl: data.otherCropManagementModel.weedControl,
      zincObservation: data.otherCropManagementModel.zincObservation,
    }

    const farmingPractices = data.farmingPracticesModel;

    const smsAndDialect: SmsDialectModel = {
      receiveSms: data.smsDialectModel.receiveSms,
      dialect: data.smsDialectModel.dialect,
      transplantingWillOccur: data.smsDialectModel.transplantingWillOccur,
    }

    const recommendation: RecommendationModel = {
      farmLot: farmLot,
      setTargetYield: targetYield,
      fertilizerRates: fertilizerRates,
      timingSplitting: timingAndSplitting,
      otherCropManagement: otherCropManagement,
      farmingPractices: farmingPractices,
      refId: 0,
      dateGenerated: new Date(data.dateGenerated),
      pdfFile: data.pdfFile,
      temporaryReferenceId: data.temporaryRefId,
      previousSelectedLanguage: data.previousSelectedLanguage,
      smsAndDialect: smsAndDialect,
    }

    return recommendation;
  }

  public getAllRCMRecommendation(fieldRefId: number): Observable<RCMRecommendationListModel[]> {
    return from(this.getAllRCMRecommendationAsync(fieldRefId));
  }

  public async getAllRCMRecommendationAsync(fieldRefId: number): Promise<RCMRecommendationListModel[]> {
    const isOfflineModeEnabled = await this.offlineStorage.getOfflineMode();
    
    if (!isOfflineModeEnabled) {
      const url = `${this.fieldApiUrl}/fields/${fieldRefId}/recommendations`;
      return this.http.get<RCMRecommendationListModel[]>(url, this.httpOptions).pipe(
        catchError(this.errorService.handleError('RecommendationService', 'getAllRCMRecommendation'))
      ).toPromise();
    } else {
      const rcmRecommendations = await this.recommendationStorageService.getAllRCMRecommendation(fieldRefId);
      return rcmRecommendations;
    }
      
  }

  public async getOfflineRCMRecommendation(fieldId: string) {
    const fieldRecommendations = await this.recommendationStorageService.getAllOfflineRecommendations(fieldId) as FieldRecommendationApiModel[];
    return fieldRecommendations;
  }

  public getAllRecommendationForOffline(municipalityId: number): Observable<RCMRecommendationListModel[]> {
    const params = new HttpParams().set("municipality_id", municipalityId.toString());

    const url = `${this.offlineUrl}/recommendations`;

    return this.http.get<RCMRecommendationListModel[]>(url, { params: params }).pipe(
      catchError(this.errorService.handleError('RecommendationService', 'getAllRecommendationForOffline'))
    );

  }

}
