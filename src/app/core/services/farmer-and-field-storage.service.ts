import { Injectable } from '@angular/core';
import { OfflineStorageService } from './offline-storage.service';
import { OfflineDataModel } from '../models/offline-data-model';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';

const FARMER_KEY_PREFIX = 'FARMER_STORAGE_KEY';
const FARMER_LOCATION_KEY_PREFIX = 'FARMER_LOCATION_STORAGE_KEY';
const FIELD_KEY_PREFIX = 'FIELD_STORAGE_KEY';
const RECOMMENDATIONS_KEY_PREFIX = 'RECOMMENDATION_STORAGE_KEY';

/** @deprecated use model inside OfflineManagementModule */
@Injectable({
  providedIn: 'root',
})
export class FarmerAndFieldStorageService {
  constructor(private offlineStorage: OfflineStorageService) {}
  public async storeFarmerAndFieldData(dataFarmerAndField, recommendationData) {
    const farmerInfoModel = dataFarmerAndField.data as FarmerApiModel[];
    let farmers = [];
    let fields = [];
    farmerInfoModel.forEach(farmerData => {
      farmerData.fields.forEach(fieldData => {
        fields.push(fieldData);
      });
      farmerData.fields = [];
      farmers.push(farmerData);
    });

    const offlineData: OfflineDataModel = {
      offlineFarmerData: farmers,
      dateDownloaded: new Date()
    }

    await this.offlineStorage.set(FARMER_KEY_PREFIX, offlineData);
    await this.offlineStorage.set(FIELD_KEY_PREFIX, fields);
    await this.offlineStorage.set(RECOMMENDATIONS_KEY_PREFIX, recommendationData);

    return true;
  }

  public async storeFarmerLocation(farmerLocation) {
    await this.offlineStorage.set(FARMER_LOCATION_KEY_PREFIX, farmerLocation);
    return true;
  }

  public async getFarmerData() {
    const dataFarmer: OfflineDataModel = await this.offlineStorage.get(FARMER_KEY_PREFIX);
    return dataFarmer;
  }

  public async getFarmerDataLocation() {
    const farmerLocation = await this.offlineStorage.get(FARMER_LOCATION_KEY_PREFIX);
    return farmerLocation;
  }


  public async getFarmerDashboardData(pageIndex, pageSize, filterCheckedKey) {
    const farmerOfflineData = await this.getFarmerData();
    let offlineFarmerData = farmerOfflineData.offlineFarmerData;
    let totalSize = offlineFarmerData.length;
    

    if (filterCheckedKey) {
      const farmerIdArray = await this.quickFilters(filterCheckedKey);

      offlineFarmerData = offlineFarmerData.filter(farmer => {
        return farmerIdArray.includes(farmer.farmer_id);
      });
      totalSize = offlineFarmerData.length;
    }

    return {
      farmers: offlineFarmerData.splice(pageIndex * pageSize, pageSize),
      totalResultCount: totalSize,
    };
  }

  public async quickFilters(filterCheckedKey) {
    const fieldData = await this.offlineStorage.get(FIELD_KEY_PREFIX);
    let farmerIdArray = [];

    if (filterCheckedKey) {
      if (filterCheckedKey.includes("2")) {
        fieldData.filter(field => {
          if (field.is_verified === 1) {
            farmerIdArray.push(field.farmer_id);
          }
        });
      } 
      
      if (filterCheckedKey.includes("3")) {
        fieldData.filter(field => {
          if (field.is_verified === 0) {
            farmerIdArray.push(field.farmer_id);
          }
        });
      }
    }

    return farmerIdArray;
  }

  public async clearFarmerAndFieldData() {
    this.offlineStorage.clearByKey(FARMER_KEY_PREFIX);
    this.offlineStorage.clearByKey(FIELD_KEY_PREFIX);
    this.offlineStorage.clearByKey(FARMER_LOCATION_KEY_PREFIX);
    this.offlineStorage.clearByKey(RECOMMENDATIONS_KEY_PREFIX);
  }

  public async getFarmerPageInfoData(id: number) {
    const dataFarmer = await this.getFarmerData();
    const result = dataFarmer && dataFarmer.offlineFarmerData.find(farmer => farmer.id === id);
    if (result) {
      const dataFields = await this.getFarmerFieldsData(result.farmer_id);
      result.fields = dataFields;
      return result;
    }

    return null;
  }

  public async getFieldInfoByFieldId(fieldId: number) {
    const fieldData = await this.offlineStorage.get(FIELD_KEY_PREFIX);
    return fieldData.find(field => fieldId === field.id);
  }

  public async getFarmerFieldsData(farmerId: string) {
    const fieldData = await this.offlineStorage.get(FIELD_KEY_PREFIX);

    const farmerFields = fieldData.filter(field => {
      return field.farmer_id === farmerId;
    });

    return farmerFields;
  }
}
