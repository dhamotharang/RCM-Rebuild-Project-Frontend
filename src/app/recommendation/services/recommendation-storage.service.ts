import { Injectable } from '@angular/core';
import { OfflineStorageService } from '../../core/services/offline-storage.service';
import { FieldRecommendationApiModel } from '../model/recommendation-form-models/field-recommendation-api.model';
import { DecimalPipe, formatDate } from '@angular/common';
import { RCMRecommendationListModel } from '../model/rcm-recommendation-list.model';

const RECOMMENDATION_KEY_PREFIX = 'RECOMMENDATION_';
const RCM_RECOMMENDATIONS_KEY_PREFIX = 'RECOMMENDATION_STORAGE_KEY';

@Injectable({
  providedIn: 'root',
})
export class RecommendationStorageService {
  constructor(
    private offlineStorage: OfflineStorageService,
    private decimalPipe: DecimalPipe
  ) {}

  public async storeRecommendation(
    fieldRecommendation: FieldRecommendationApiModel
  ) {
    const fieldId = fieldRecommendation.fieldInfoModel.field_id ? fieldRecommendation.fieldInfoModel.field_id : fieldRecommendation.fieldInfoModel.offlineFieldId;
    const temporaryReferenceId = await this.createTemporaryReferenceId(fieldId);
    fieldRecommendation.temporaryRefId = temporaryReferenceId;
    fieldRecommendation.dateGenerated  = formatDate(new Date(), 'M/d/yy, h:mm:ss a', 'en-US')

    const storedRecommendation = await this.offlineStorage.get(
      RECOMMENDATION_KEY_PREFIX + fieldId
    );

    let recommendation = [];

    if (storedRecommendation) {
      storedRecommendation.push(fieldRecommendation);
      recommendation = storedRecommendation;

    } else {
      recommendation.push(fieldRecommendation)
    }

    await this.offlineStorage.set(
      RECOMMENDATION_KEY_PREFIX + fieldId,
      recommendation
    );

    return true;
  }

  public async createTemporaryReferenceId(fieldId: string) {
    let count = '';
    const countStart = 1;
    const fieldRecommendation = await this.offlineStorage.get(
      RECOMMENDATION_KEY_PREFIX + fieldId
    );

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
    const fieldRecommendation = await this.offlineStorage.get(
      RECOMMENDATION_KEY_PREFIX + fieldId
    );

    return fieldRecommendation;

  }

  public async getAllRCMRecommendation(fieldRefId){
    const allRecommendations = await this.offlineStorage.get(RCM_RECOMMENDATIONS_KEY_PREFIX);
    let fieldRecommendations: RCMRecommendationListModel[];
      if(allRecommendations){
      fieldRecommendations = allRecommendations.filter(field => {
        return field.fieldId === fieldRefId;
      });
    }
    
    return fieldRecommendations;

  }
}
