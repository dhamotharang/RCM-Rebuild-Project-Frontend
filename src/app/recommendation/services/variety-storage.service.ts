import { Injectable } from '@angular/core';
import { OfflineStorageService } from '../../core/services/offline-storage.service';

const VARIETY_STORAGE_KEY = 'VARIETY_STORAGE_KEY';

/** @deprecated use service inside OfflineManagementModule */
@Injectable({
  providedIn: 'root'
})
export class VarietyStorageService {

  constructor(
    private offlineStorage: OfflineStorageService
  ) { }

  public async storeVarietyData(dataVariety) {
    await this.offlineStorage.set(VARIETY_STORAGE_KEY, dataVariety);
    return true;
  }

  public async getVarietyData() {
    const dataVariety = await this.offlineStorage.get(VARIETY_STORAGE_KEY);
    return dataVariety;
  }

  public async clearVarietyData() {
    return this.offlineStorage.clearByKey(VARIETY_STORAGE_KEY);
  }

}
