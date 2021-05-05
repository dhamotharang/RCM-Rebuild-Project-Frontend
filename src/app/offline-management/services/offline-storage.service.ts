import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfflineStorageService {
  public isOfflineIconVisible: boolean;
  public offlineIconVisibilityChange = new Subject<boolean>();

  constructor(private storage: Storage) {
    this.offlineIconVisibilityChange.subscribe((value) => {
      this.isOfflineIconVisible = value;
    });
  }

  public set(key: string, value: any) {
    return this.storage.set(key, value);
  }

  public get(key: string) {
    return this.storage.get(key);
  }

  public clearAll() {
    return this.storage.clear();
  }

  public clearByKey(key: string) {
    this.storage.forEach((value, keyFromStorage) => {
      if (keyFromStorage.includes(key)) {
        this.storage.remove(keyFromStorage); 
      }
    });
  }
  
  public setOfflineMode(value: boolean) {
    this.offlineIconVisibilityChange.next(value);
    return this.set('OFFLINE_MODE', value);
  }

  public async getOfflineMode() {
    const res = await this.get('OFFLINE_MODE');
    this.offlineIconVisibilityChange.next(res);
    return res;
  }
}
