import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError, from, Observable } from 'rxjs';
import { DataHistoryModel } from '../../../core/models/data-history.model';
import { ErrorService } from './error.service';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { formatDate } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class DataHistoryService {

  constructor(
    private http: HttpClient, 
    private errorService: ErrorService,
    private offlineStorage: OfflineStorageService,
  ) { }

  private apiUrl = environment.historyApi;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  private httpOptions = {
    headers: this.headers
  };
  public getDataHistory(filterBy: string, dataId: any, fromDate, toDate) {

    let params = new HttpParams();
    params = params.append('filter_by', filterBy.toString());
    params = params.append('filter_ids', dataId.toString());

    if (fromDate) {
      params = params.append('fromDate', fromDate);
      params = toDate ? params.append('toDate', toDate) : params.append('toDate', formatDate(new Date(),'yyyy-MM-dd', 'en-US'));
    }

    return this.http.get<DataHistoryModel[]>(this.apiUrl, { params: params }).pipe(
      catchError(this.handleError)
    );

  }

  public getDataSummary(location, fromDate?: string, toDate?: string) {
    let params = new HttpParams();
    if (location.region) {
      params = params.append('region_id', location.region);
    }
    if (location.province) {
      params = params.append('province_id', location.province);
    }
    if (location.municipality) {
      params = params.append('municipality_id', location.municipality);
    }
    if (fromDate) {
      params = params.append('fromDate', fromDate);
      params = toDate ? params.append('toDate', toDate) : params.append('toDate', formatDate(new Date(),'yyyy-MM-dd', 'en-US'));
    }

    const url = `${this.apiUrl}/summary`;

    return this.http.get(url, { params: params }).pipe(
      catchError(this.handleError)
    );
  }

  public getUserHistory(id: any, page: string): Observable<DataHistoryModel[]> {
    return from(this.getUserHistoryAsync(id, page));
  }

  public async getUserHistoryAsync(id: any, page: string): Promise<DataHistoryModel[]> {
    const isOfflineModeEnabled = await this.offlineStorage.getOfflineMode();
    
    if (isOfflineModeEnabled) {
      return []; //dummy data
    } else {
      const url = `${this.apiUrl}/${id}/${page}`;
      return this.http.get<DataHistoryModel[]>(url).pipe(
        catchError(this.handleError)).toPromise();
    }
  }

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  public logDataHistory(data_type: number, data_module: number, farmer?: FarmerApiModel) {
    const url = `${this.apiUrl}/datalog`;
    const params = {
      farmer: farmer,
      type: data_type,
      module: data_module
    };
    return this.http.post<FarmerApiModel>(url, JSON.stringify(params), this.httpOptions).pipe(
      catchError(this.errorService.handleError('DataHistoryService', 'logDataHistory'))
    );
  }

}
