import { Injectable } from '@angular/core';
import { OfflineStorageService } from './offline-storage.service';

const POTENTIAL_YIELD_STORAGE_KEY = 'POTENTIAL_YIELD_STORAGE_KEY';

/** @deprecated use service inside OfflineManagementModule */
@Injectable({
  providedIn: 'root'
})
export class PotentialYieldStorageService {

  constructor(private offlineStorage: OfflineStorageService) { }

  public async storePotentialYieldData(dataPotentialYield) {
    await this.offlineStorage.set(POTENTIAL_YIELD_STORAGE_KEY, dataPotentialYield);
    return true;
  }

  public async getPotentialYieldData() {
    const dataPotentialYield = await this.offlineStorage.get(POTENTIAL_YIELD_STORAGE_KEY);
    return dataPotentialYield;
  }

  public async clearPotentialYieldData() {
    return this.offlineStorage.clearByKey(POTENTIAL_YIELD_STORAGE_KEY);
  }
}
