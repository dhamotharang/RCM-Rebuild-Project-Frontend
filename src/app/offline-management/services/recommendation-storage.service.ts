import { Injectable } from '@angular/core';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { FieldRecommendationApiModel } from 'src/app/recommendation/model/recommendation-form-models/field-recommendation-api.model'; 
import { DecimalPipe, formatDate } from '@angular/common';
import { RCMRecommendationListModel } from 'src/app/recommendation/model/rcm-recommendation-list.model';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';

const ONLINE_RECOMMENDATION_KEY_PREFIX = 'ONLINE_RECOMMENDATION_STORAGE_KEY';
const OFFLINE_RECOMMENDATION_KEY_PREFIX = 'OFFLINE_RECOMMENDATION_STORAGE_KEY';

@Injectable({
  providedIn: 'root'
})
export class RecommendationStorageService {

  constructor(
    private offlineStorage: OfflineStorageService,
    private decimalPipe: DecimalPipe
  ) {}

  public async storeRecommendation(fieldRecommendation: FieldRecommendationApiModel) {

    const fieldId = fieldRecommendation.fieldInfoModel.field_id ? fieldRecommendation.fieldInfoModel.field_id : fieldRecommendation.fieldInfoModel.offlineFieldId;
    const temporaryReferenceId = await this.createTemporaryReferenceId(fieldId);
    fieldRecommendation.temporaryRefId = temporaryReferenceId;
    fieldRecommendation.dateGenerated  = formatDate(new Date(), 'M/d/yy, h:mm:ss a', 'en-US')

    const storedRecommendation = await this.offlineStorage.get(OFFLINE_RECOMMENDATION_KEY_PREFIX);

    let recommendation = [];

    if (storedRecommendation) {
      storedRecommendation.push(fieldRecommendation);
      recommendation = storedRecommendation;

    } else {
      recommendation.push(fieldRecommendation)
    }

    await this.offlineStorage.set(OFFLINE_RECOMMENDATION_KEY_PREFIX,recommendation);
    

    return true;
  }

  public async getRecommendationData() {
    const dataRecommendation: FieldRecommendationApiModel[] = await this.offlineStorage.get(OFFLINE_RECOMMENDATION_KEY_PREFIX);
    return dataRecommendation;
  }

  public async updateRecommendation(
    fieldRecommendation: FieldRecommendationApiModel, 
    offlineRecommendationData: FieldRecommendationApiModel[], 
    index: number,
    field: FarmApiModel
  ) {

    if (index >= 0) {
      offlineRecommendationData[index].refId = fieldRecommendation.refId;
      offlineRecommendationData[index].farmerId = field.farmer_id;
      offlineRecommendationData[index].farmLotId = field.field_id;
    }
    await this.offlineStorage.set(OFFLINE_RECOMMENDATION_KEY_PREFIX, offlineRecommendationData);
  }


  /**
   * @description Update locally stored recommendation
   * @param fieldRecommendation Recommendation object must include temporaryRefId or refId property
   */
  public async update(fieldRecommendation: FieldRecommendationApiModel): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!fieldRecommendation && (!fieldRecommendation.temporaryRefId || !fieldRecommendation.refId)) {
        reject('Field recommendation must include temporaryRefId or refId');
      }

      const reference: { id: any, propertyName: string} = fieldRecommendation.temporaryRefId ? {
        id: fieldRecommendation.temporaryRefId,
        propertyName: 'temporaryRefId'
      } : {
        id: fieldRecommendation.refId,
        propertyName: 'refId'
      }

      const storedRecommendations: FieldRecommendationApiModel[] = (await this.offlineStorage.get(OFFLINE_RECOMMENDATION_KEY_PREFIX)) || [];
      const foundIndex = storedRecommendations.findIndex((recommendation: FieldRecommendationApiModel) => recommendation[reference.propertyName] === reference.id);

      if (foundIndex < 0) {
        reject('Recommendation not found');
      }
      storedRecommendations[foundIndex] = fieldRecommendation;
      await this.offlineStorage.set(OFFLINE_RECOMMENDATION_KEY_PREFIX, storedRecommendations);
      resolve(true);
    });
  }

  /**
   * @description Finds and returns the first instance of a locally stored recommendation based on property name and value
   * @param value The value to find
   * @param propertyName The property name to match
   */
  public async get(value: any, propertyName: string): Promise<FieldRecommendationApiModel> {
    return new Promise(async(resolve) => {
      const storedRecommendations: FieldRecommendationApiModel[] = (await this.offlineStorage.get(OFFLINE_RECOMMENDATION_KEY_PREFIX)) || [];
      resolve(storedRecommendations.find((recommendation: FieldRecommendationApiModel) => recommendation[propertyName] === value));
    })
  }

  public async createTemporaryReferenceId(fieldId: string) {
    let count = '';
    const countStart = 1;
    
    const fieldRecommendation = await this.offlineStorage.get(OFFLINE_RECOMMENDATION_KEY_PREFIX);

     if (fieldRecommendation) {
      count = this.decimalPipe.transform(
        fieldRecommendation.length + countStart,
        '2.0'
      );
    } else {
      count = this.decimalPipe.transform(countStart, '2.0');
    }

    return fieldId + '-' + count;
  }





  public async getAllOfflineRecommendations(fieldId: string){
    const fieldRecommendation = await this.offlineStorage.get(OFFLINE_RECOMMENDATION_KEY_PREFIX);
    if (fieldRecommendation) {
      return fieldRecommendation.filter(field => field.farmLotId === fieldId);
    }

    return [];
   
  }

  // GET ALL RECOMMENDATION
  public async getOfflineRecommendations() {
    const fieldRecommendation = await this.offlineStorage.get(OFFLINE_RECOMMENDATION_KEY_PREFIX);
    if (fieldRecommendation) {
      return fieldRecommendation;
    }

    return [];
  }
  

  public async getAllRCMRecommendation(fieldRefId){
    const allRecommendations = await this.offlineStorage.get(ONLINE_RECOMMENDATION_KEY_PREFIX);
    let fieldRecommendations: RCMRecommendationListModel[];
      if(allRecommendations){
      fieldRecommendations = allRecommendations.filter(field => {
        return field.fieldId === fieldRefId;
      });
    }
    
    return fieldRecommendations;

  }

}
