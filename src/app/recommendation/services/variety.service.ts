import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VarietyModel } from '../model/variety.model';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { VarietyStorageService } from './variety-storage.service';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../../v2/core/services/error.service';

@Injectable({
  providedIn: 'root'
})
export class VarietyService {

  public varieties: VarietyModel[];

  constructor(
    private http: HttpClient,
    private offlineStorage: OfflineStorageService,
    private varietyStorage: VarietyStorageService,
    private errorService: ErrorService
  ) { }

  private apiUrl = environment.varietyApi;
  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  private httpOptions = {
    headers: this.headers
  };

  public getVarieties(): Observable<VarietyModel[]> {
    return from(this.getVarietiesAsync());
  }

  public async getVarietiesAsync(): Promise<VarietyModel[]> {
    const isOfflineModeEnabled = await this.offlineStorage.getOfflineMode();
    
    if (isOfflineModeEnabled) {
      return this.varietyStorage.getVarietyData();
    } else {
      return this.http.get<VarietyModel[]>('assets/RCM.variety-type.json').pipe(
        map(varietyModels => varietyModels.map(this.mappingFunction))
      ).toPromise();
    }
  }

  public getVarietiesApi(): Observable<VarietyModel[]> {
    return this.http.get<VarietyModel[]>('assets/RCM.variety-type.json').pipe(
      map(varietyModels => varietyModels.map(this.mappingFunction))
    );
  }

  private mappingFunction(variety) {
    return {
      filterByAnswerValue: parseInt((variety as any).filter_by_answer_value),
      value: parseInt((variety as any).value),
      label: (variety as any).label,
      growthDuration: parseInt((variety as any).growth_duration)
    }
  }

  public getVarietyApi(): Observable<VarietyModel[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<VarietyModel[]>(url, this.httpOptions).pipe(
      map(varietyModel => varietyModel.map(this.varietyApiMapper)),
      catchError(this.errorService.handleError('VarietyService', 'getVarietyApi'))
    );
  }

  private varietyApiMapper(varietyModel) {
    const variety = varietyModel as any;
    return {
      filterByAnswerValue: parseInt(variety.type),
      value: parseInt(variety.variety_id),
      label: `${variety.variety1} ${variety.variety2} ${variety.variety3} `,
      growthDuration: parseInt(variety.growth_duration)
    }
  }
}
