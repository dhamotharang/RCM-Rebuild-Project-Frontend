import { LocationFormModel } from 'src/app/location/models/location-form.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorService } from '../../v2/core/services/error.service';
import { FarmerListResultApiModel } from '../../farmer-management/models/api/farmer-list-result.model';
import { InterviewedModel } from '../models/interviewed-model';
import { OfflineDataModel } from '../models/offline-data-model';
import { FarmerAndFieldStorageService } from 'src/app/offline-management/services/farmer-and-field-storage.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';

/** @deprecated use service inside FarmerManagementModule */
@Injectable({
  providedIn: 'root'
})
export class FarmerService {

  public constructor(
  private http: HttpClient,
  private offlineStorage: OfflineStorageService,
  private farmerLocalStorageService: FarmerAndFieldStorageService,
  private errorService: ErrorService) { }
  private apiUrl = environment.farmerApi;
  private apiForInterviewed = environment.apiForInterviewed;
  private offlineUrl = environment.offlineApi;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  private httpOptions = {
    headers: this.headers
  };
  public notify = new BehaviorSubject<{ status: string }>({ status: 'success' });
  public downloading = new BehaviorSubject<boolean>(false);
  public getFarmerList(role_id: string,
    location: LocationFormModel,
    isAdmin: number,
    searchQuery?: string,
    pageIndex?: number,
    itemsPerPage?: number,
    withFilters?: boolean,
    withCheckFilters?: boolean,
    fromDate?: string,
    toDate?: string,
    filterCheckedKey?: string,
    isDownload?: boolean,
    isSortedByBrgy?: boolean): Observable<FarmerListResultApiModel> {

    return from(this.getFarmerListAsync(role_id,
      location,
      isAdmin,
      searchQuery,
      pageIndex,
      itemsPerPage,
      withFilters,
      withCheckFilters,
      fromDate,
      toDate,
      filterCheckedKey,
      isDownload,
      isSortedByBrgy));
  }
  
  public async getFarmerListAsync(role_id: string,
    location: LocationFormModel,
    isAdmin: number,
    searchQuery?: string,
    pageIndex?: number,
    itemsPerPage?: number,
    withFilters?: boolean,
    withCheckFilters?: boolean,
    fromDate?: string,
    toDate?: string,
    filterCheckedKey?: string,
    isDownload?: boolean,
    isSortedByBrgy?: boolean): Promise<FarmerListResultApiModel> {

    const isOfflineModeEnabled = await this.offlineStorage.getOfflineMode();
      if (isOfflineModeEnabled) {
        return this.farmerLocalStorageService.getFarmerDashboardData(
          pageIndex, 
          itemsPerPage,
          filterCheckedKey
        );
      } else {
        let params = new HttpParams();
        params = params.append('role_id', role_id);
        if (location.regionId) {
          params = params.append('region_id', location.regionId.toString());
        }
        if (location.provinceId) {
          params = params.append('province_id', location.provinceId.toString());
        }
        if (location.municipalityId) {
          params = params.append('municipality_id', location.municipalityId.toString());
        }
        if (location.barangayId) {
          params = params.append('barangay_id', location.barangayId.toString());
        }
        if (fromDate) {
          params = params.append('fromDate', fromDate);
          params = params.append('toDate', toDate);
        }
        if (!!filterCheckedKey) {
          params = params.append('filterCheckedKey', filterCheckedKey.toString());
        }
    
        params = withFilters ? params.append('filters', '1') : params.append('filters', '0');
        params = withCheckFilters ? params.append('checkFilters', '1') : params.append('checkFilters', '0');
        params = isDownload ? params.append('isDownload', '1') : params.append('isDownload', '0');
        params = isSortedByBrgy ? params.append('isSortedByBrgy','1') : params.append('isSortedByBrgy', '0')
    
        if (searchQuery) {
          params = params.append('searchQuery', searchQuery);
        }
    
        if (pageIndex >= 0 && itemsPerPage >= 1) {
          params = params.append('pageIndex', pageIndex.toString());
          params = params.append('pageSize', itemsPerPage.toString());
        }
        params = params.append('isAdmin', isAdmin.toString());
    
        return this.http.get<FarmerListResultApiModel>(this.apiUrl, { params: params }).pipe(
          catchError(this.errorService.handleError('FarmerService', 'getFarmerList'))
        ).toPromise();
      }
   
  }

  public addFarmer(farmer: FarmerApiModel) {
    return this.http.post<FarmerApiModel>(this.apiUrl, farmer, {
      headers: this.headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorService.handleError('FarmerService', 'addFarmer'))
    );
  }

  public getFarmerInfo(id: number): Observable<FarmerApiModel> {
    return from(this.getFarmerInfoAsync(id));
  }

  public async getFarmerInfoAsync(id: number): Promise<FarmerApiModel> {
    const isOfflineModeEnabled = await this.offlineStorage.getOfflineMode();
    
    if (isOfflineModeEnabled) {
      return this.farmerLocalStorageService.getFarmerPageInfoData(id);
    } else {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<FarmerApiModel>(url, this.httpOptions).pipe(
        catchError(this.errorService.handleError('FarmerService', 'getFarmerInfo'))
      ).toPromise();
    }
  }

  public updateFarmer(farmer: FarmerApiModel) {
    return this.http.put(`${this.apiUrl}/${farmer.id}`, farmer, {
      headers: this.headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorService.handleError('FarmerService', 'updateFarmer'))
    );
  }

  public getFarmerByName(name: string) {
    let original = this.apiUrl;
    original += '?name=' + name;
    return this.http.get(original);
  }
  
  public getFarmerPDFHeader(): Observable<any> {
    return this.http.get<any[]>('../../assets/Farmers.Header.DL.json');
  }

  public deleteFarmer(farmerId: number) {
    return this.http.put<FarmerApiModel>(`${this.apiUrl}/${farmerId}/delete`, this.httpOptions);
  }

  public isInterviewedByMe(farmerId: number) : Observable<InterviewedModel> {
    return from(this.isInterviewedByMeAsync(farmerId));
  }

  public async isInterviewedByMeAsync(farmerId: number) : Promise<InterviewedModel> {
    const isOfflineModeEnabled = await this.offlineStorage.getOfflineMode();
    
    if (isOfflineModeEnabled) {
      return {
        status: false
      }; //dummy data
    } else {
      return this.http.get<InterviewedModel>(`${this.apiForInterviewed}?farmerId=${farmerId}`, this.httpOptions).toPromise();
    }
  }

  public getFarmerAndFieldInfoForOffline(municipalityId: number) : Observable<OfflineDataModel> {
    const params = new HttpParams().set("municipality_id", municipalityId.toString());
    const url = `${this.offlineUrl}/farmers`;

    return this.http.get<OfflineDataModel>(url, { params: params }).pipe(
      catchError(this.errorService.handleError('FarmerService', 'getFarmerAndFieldInfoForOffline'))
    );
  }
}
