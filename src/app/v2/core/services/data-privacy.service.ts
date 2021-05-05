import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { FarmerConsentModel } from '../../../core/models/farmer-consent.model';
import { DataPrivacyResponseModel } from '../../../core/models/data-privacy-response.model';

@Injectable({
  providedIn: 'root'
})
export class DataPrivacyService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.dataPrivacyApi;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  private httpOptions = {
    headers: this.headers
  };

  public getDataPrivacyDocument(languageId: number): Observable<FarmerConsentModel> {
    return this.http.get<FarmerConsentModel>(`${this.apiUrl}/${languageId}`, this.httpOptions);
  }

  public uploadDataPrivacy(farmerConsent: FarmerConsentModel): Observable<DataPrivacyResponseModel> {
    return this.http.post<DataPrivacyResponseModel>(this.apiUrl, farmerConsent, this.httpOptions);
  }

  public updateDataPrivacy(farmerConsent: FarmerConsentModel): Observable<DataPrivacyResponseModel> {
    return this.http.put<DataPrivacyResponseModel>(this.apiUrl, farmerConsent, this.httpOptions);
  }

  public getFarmerConsentForms(): Observable<FarmerConsentModel[]> {
    return this.http.get<FarmerConsentModel[]>(this.apiUrl, this.httpOptions);
  }
}
