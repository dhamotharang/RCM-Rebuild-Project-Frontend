import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';;
import { environment } from '../../../environments/environment';
import { ErrorService } from '../../v2/core/services/error.service';
import { FarmerAndFieldStorageService } from 'src/app/offline-management/services/farmer-and-field-storage.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';

@Injectable({
    providedIn: 'root'
})
export class FieldService {

  farmerFieldInfo: FarmApiModel;

  apiurl = environment.fieldApi;
  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  httpOptions = {
    headers: this.headers
  };

  constructor(
    private http: HttpClient, 
    private errorService: ErrorService, 
  ) {}

  private handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  getFields(id: number): Observable<FarmApiModel[]> {
    const url = `${this.apiurl}/${id}/fields`;
    return this.http.get<FarmApiModel[]>(url, this.httpOptions).pipe(
      catchError(this.errorService.handleError('FieldService', 'getFields'))
    );
  }

  // TODO: enforce strict typing. use return type = { success: boolean, message?: string, data: FarmApiModel}
  addField (field: FarmApiModel): Observable<any> {
    const url = `${this.apiurl}/fields`;
    return this.http.post<FarmApiModel>(url, field, this.httpOptions).pipe(
      catchError(this.errorService.handleError('FieldService', 'addField'))
    );
  }

  updateField(field: FarmApiModel) {
    const url = `${this.apiurl}/fields/${field.id}`;
    return this.http.put(url, field).pipe(
      catchError(this.errorService.handleError('FieldService', 'updateField'))
    );
  }

  deleteField(id: number): Observable<FarmApiModel> {
    const url = `${this.apiurl}/fields/${id}/delete`;
    return this.http.put<FarmApiModel>(url, this.httpOptions).pipe(
      catchError(this.errorService.handleError('FieldService', 'deleteField'))
    );
  }

  getFarmerField(id: number): Observable<any> {

    return from(this.getFarmerFieldInfo(id));

  }

  getTotalIsVerifiedFieldCount(gaoId: number, isVerified: number): Observable<any> {
    const dynamicUrlParam = `filterCheckedKey=${isVerified}&role_id=${gaoId}`;
    const constUrlParam = `isDownload=0&isSortedByBrgy=0&checkFilters=1&filters=0&pageIndex=1&pageSize=5&isAdmin=0`;
    
    const url = `${this.apiurl}/farmers?${dynamicUrlParam}&${constUrlParam}`;

    return this.http.get<any>(url, this.httpOptions).pipe(
      catchError(this.errorService.handleError('FieldService', 'getTotalVerifiedFieldCount'))
    );
  }

  getTotalFieldCount(gaoId: number): Observable<any> {
    const dynamicUrlParam = `role_id=${gaoId}`;
    const constUrlParam = `isDownload=0&isSortedByBrgy=0&checkFilters=0&filters=0&pageIndex=0&pageSize=5&isAdmin=0`;
    
    const url = `${this.apiurl}/farmers?${dynamicUrlParam}&${constUrlParam}`;

    return this.http.get<any>(url, this.httpOptions).pipe(
      catchError(this.errorService.handleError('FieldService', 'getTotalVerifiedFieldCount'))
    );
  }

  async getFarmerFieldInfo(id: number): Promise<Object> {
      const url = `${this.apiurl}/fields/${id}`;
      return this.http.get<FarmApiModel>(url, this.httpOptions).pipe(
        catchError(this.errorService.handleError('FarmerService', 'getFarmerInfo'))
      ).toPromise();
  }  

}
