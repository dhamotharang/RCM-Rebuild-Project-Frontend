import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OfflineSyncService {
  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  private farmerPushApiUrl: string;
  constructor(private http: HttpClient) {
    this.farmerPushApiUrl = `${environment.apiBaseUrl}/v1/rcmffr/offline-data-push`;
  }

  public pushFarmerData(farmer: FarmerApiModel) {
    return this.http.post<FarmerApiModel>(this.farmerPushApiUrl, farmer, {headers: this.headers});
  }
}
