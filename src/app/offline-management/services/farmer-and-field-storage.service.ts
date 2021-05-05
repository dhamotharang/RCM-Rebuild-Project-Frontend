import { Injectable } from '@angular/core';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { OfflineDataModel } from 'src/app/offline-management/models/offline-data-model';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { FarmerFilterModel } from 'src/app/farmer-management/models/farmer-filter.model';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';

const FARMER_KEY_PREFIX = 'FARMER_STORAGE_KEY';
const FARMER_LOCATION_KEY_PREFIX = 'FARMER_LOCATION_STORAGE_KEY';
const FIELD_KEY_PREFIX = 'FIELD_STORAGE_KEY';
const ONLINE_RECOMMENDATIONS_KEY_PREFIX = 'ONLINE_RECOMMENDATION_STORAGE_KEY';
@Injectable({
  providedIn: 'root',
})
export class FarmerAndFieldStorageService {
  constructor(private offlineStorage: OfflineStorageService) {}
  public async storeFarmerAndFieldData(dataFarmerAndField, recommendationData) {
    const farmerInfoModel = dataFarmerAndField.data as FarmerApiModel[];
    let farmers = [];
    let fields = [];
    let recommendations = [];
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

    recommendationData.forEach(recommendation => {
      recommendation.mode = 1
      recommendations.push(recommendation);
    });

    await this.offlineStorage.set(FARMER_KEY_PREFIX, offlineData);
    await this.offlineStorage.set(FIELD_KEY_PREFIX, fields);
    await this.offlineStorage.set(ONLINE_RECOMMENDATIONS_KEY_PREFIX, recommendations);

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

  public async addFarmer(farmerData: FarmerApiModel) {
    const offlineFarmerData = await this.getFarmerData();
    offlineFarmerData.offlineFarmerData.unshift(farmerData);
    await this.offlineStorage.set(FARMER_KEY_PREFIX, offlineFarmerData);
  }

  public async updateOfflineFarmer(farmerData, offlineId: string) {
    const offlineFarmerData = await this.getFarmerData();
    const farmerDataIndex = offlineFarmerData.offlineFarmerData.findIndex(farmer => farmer.offline_id === offlineId);
    if (farmerDataIndex >= 0) {
      offlineFarmerData.offlineFarmerData[farmerDataIndex].id = farmerData.id;
      offlineFarmerData.offlineFarmerData[farmerDataIndex].farmer_id = farmerData.farmer_id;
      offlineFarmerData.offlineFarmerData[farmerDataIndex].upload_failed = farmerData.upload_failed;
    }

    await this.offlineStorage.set(FARMER_KEY_PREFIX, offlineFarmerData);
  }

  public async updateFarmer(farmerData: FarmerApiModel, id: number) {
    const offlineFarmerData = await this.getFarmerData();
    const farmerDataIndex = offlineFarmerData.offlineFarmerData.findIndex(farmer => farmer.id === id);
    if (farmerDataIndex >= 0) {
      offlineFarmerData.offlineFarmerData[farmerDataIndex].id = farmerData.id;
      offlineFarmerData.offlineFarmerData[farmerDataIndex].farmer_id = farmerData.farmer_id;
      offlineFarmerData.offlineFarmerData[farmerDataIndex].upload_failed = farmerData.upload_failed;
    }

    await this.offlineStorage.set(FARMER_KEY_PREFIX, offlineFarmerData);
  }

  public async updateOfflineField(
    farmData: FarmApiModel, 
    offlineFieldData: FarmApiModel[], 
    index: number
  ) {
    
    if (index >= 0) {
      offlineFieldData[index].id = farmData.id;
      offlineFieldData[index].farmer_id = farmData.farmer_id;
      offlineFieldData[index].field_id = farmData.field_id;
      offlineFieldData[index].gpx_id = farmData.gpx_id;
    }

    await this.offlineStorage.set(FIELD_KEY_PREFIX, offlineFieldData);
  }

  public async getFarmerDashboardData(pageIndex, pageSize, farmerFilter) {
    const farmerOfflineData = await this.getFarmerData();
    let offlineFarmerData = farmerOfflineData.offlineFarmerData;
    let totalSize = offlineFarmerData.length;
    const isAnyFarmerFilterChecked = Object.values(farmerFilter).includes(true);
    
    if (isAnyFarmerFilterChecked) {
      const farmerIdArray = await this.quickFilters(farmerFilter);

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

  public async quickFilters(farmerFilter: FarmerFilterModel) {
    const fieldData = await this.offlineStorage.get(FIELD_KEY_PREFIX);
    let farmerIdArray = [];

    if (farmerFilter) {
      if (farmerFilter.verifiedField) {
        fieldData.filter(field => {
          if (field.is_verified === 1) {
            farmerIdArray.push(field.farmer_id);
          }
        });
      } 
      
      if (farmerFilter.notVerifiedField) {
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
    this.offlineStorage.clearByKey(ONLINE_RECOMMENDATIONS_KEY_PREFIX);
  }

  public async getOfflineFarmers() {
    const dataFarmer = await this.getFarmerData();
    if (dataFarmer) {
      return dataFarmer.offlineFarmerData.filter(farmer => farmer.id == null);
    }
    return null;
  }

  public async getFarmerPageInfoData(id: number|string) {
    const dataFarmer = await this.getFarmerData();
    const result = dataFarmer.offlineFarmerData.find(farmer => (farmer.id ? farmer.id : farmer.offline_id) == id);
    if (result) {
      let dataFields = [];
      if(result.farmer_id){
        dataFields = await this.getFarmerFieldsDataById(result.farmer_id);
      }else{
        dataFields = await this.getFarmerFieldsDataByOfflineId(result.offline_id);
      }
      result.fields = dataFields;
      return result;
    }

    return null;
  }

  public async getFieldData() {
    const dataField: FarmApiModel[] = await this.offlineStorage.get(FIELD_KEY_PREFIX);
    return dataField;
  }

  public async getFieldInfoByFieldId(fieldId: number) {
    const fieldData = await this.getFieldData();
    return fieldData.find(field => fieldId === field.id);
  }

  public async getFieldInfoByOfflineFieldId(offlineFieldId: string) {
    const fieldData = await this.getFieldData();
    return fieldData.find(field => offlineFieldId === field.offlineFieldId);
  }

  public async getFarmerFieldsDataById(farmerId: string) {
    const fieldData = await this.getFieldData();
    const farmerFields = fieldData.filter(field => {
      return field.farmer_id === farmerId;
    });

    return farmerFields;
  }

  public async getFarmerFieldsDataByOfflineId(farmerId: string) {
    const fieldData = await this.getFieldData();
    const farmerFields = fieldData.filter(field => {
      return field.offlineFarmerId === farmerId;
    });

    return farmerFields;
  }

  public async addField(fieldData: FarmApiModel) {
    const offlineFieldData = await this.getFieldData();
    offlineFieldData.push(fieldData);
    await this.offlineStorage.set(FIELD_KEY_PREFIX, offlineFieldData);
  }
}
