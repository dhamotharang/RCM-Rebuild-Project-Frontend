import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { of, from } from 'rxjs';
/** @deprecated use service inside OfflineManagementModule */
@Injectable({
  providedIn: 'root'
})
export class OfflineStorageService {

  constructor(private storage: Storage) {

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
    return this.set('OFFLINE_MODE', value);
  }

  public getOfflineMode() {
    return this.get('OFFLINE_MODE');
  }
}
