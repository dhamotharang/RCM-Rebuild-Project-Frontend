import { Injectable } from '@angular/core';
import { RegionModel } from '../models/region.model';
import { Observable, of, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProvinceModel } from '../models/province.model';
import { BarangayModel } from '../models/barangay.model';
import { environment } from '../../../environments/environment';
import { LocationStorageService } from './location-storage.service';
import { take, map } from 'rxjs/operators';
import { MunicipalityApiModel } from 'src/app/location/models/api/municipality-api.model';

/**
 * @deprecated Please use Location Service in location module instead
 */
@Injectable({ providedIn: 'root' })
export class LocationService {
  private regions: RegionModel[];
  private provinces: ProvinceModel[];
  private municipalities: any[];
  private barangays: BarangayModel[];

  public barangayApi = environment.barangayApi;
  public regionsApi = environment.regionsApi;
  public provincesApi = environment.provincesApi;
  public municipalitiesApi = environment.municipalitiesApi;

  constructor(private http: HttpClient, private locationStorage: LocationStorageService) { }

  public getRegionsApi() {
    return this.http.get<RegionModel[]>(this.regionsApi).pipe(
      map(regionModel => regionModel.map(this.regionsMapping))
    );
  }

  public getMunicipalityApi() {
    return this.http.get<MunicipalityApiModel[]>(this.municipalitiesApi).pipe(
      map(municipalityModel => municipalityModel.map(this.municipalitiesMapping))
    );
  }

  public getProvinceApi() {
    return this.http.get<ProvinceModel[]>(this.provincesApi).pipe(
      map(provinceModel => provinceModel.map(this.provincesMapping))
    );
  }

  public getBarangaysApi() {
    return this.http.get<BarangayModel[]>('../../assets/RCM.barangays.json');
  }

  public loadLocationLookups(): Promise<any> {
    return Promise.all([this.getRegions(), this.getProvinces(), this.getMunicipalities()]);
  }

  public getRegions() {
    const p = new Promise<any>((resolve, reject) => {
      if (!this.regions || this.regions.length === 0) {
        this.locationStorage.getRegionData()
          .then((res) => {
            if (res && res.length > 0) {
              this.regions = res;
              resolve(this.regions);
            } else {
              this.getRegionsApi()
                .pipe(take(1))
                .subscribe((regionRes) => {
                  this.regions = regionRes;
                  resolve(this.regions);
                });
            }
          }).catch(() => {
            reject('error getting data');

          });
      } else {
        resolve(this.regions);
      }
    });

    return p;
  }



  public getProvinces() {
    const p = new Promise<any>((resolve, reject) => {
      if (!this.provinces || this.provinces.length === 0) {
        this.locationStorage.getProvinceData()
          .then((res) => {
            if (res && res.length > 0) {
              this.provinces = res;
              resolve(this.provinces);
            } else {
              this.getProvinceApi()
                .pipe(take(1))
                .subscribe((provinces) => {
                  this.provinces = provinces;
                  resolve(this.provinces);
                });
            }
          }).catch(() => {
            reject('error getting data');

          });
      } else {
        resolve(this.provinces);
      }
    });

    return p;
  }



  public getMunicipalities() {
    const p = new Promise<any>((resolve, reject) => {
      if (!this.municipalities || this.municipalities.length === 0) {
        this.locationStorage.getMunicipalityData()
          .then((res) => {
            if (res && res.length > 0) {
              this.municipalities = res;
              resolve(this.municipalities);
            } else {
              this.getMunicipalityApi()
                .pipe(take(1))
                .subscribe((municipalities) => {
                  this.municipalities = municipalities.map(municipality => (
                    { 
                      value: municipality.id, 
                      label: municipality.label, 
                      runId: municipality.run_id,
                      soilFertility: municipality.soil_fertility 
                    }
                  ));
                  resolve(this.municipalities);
                });
            }
          }).catch(() => {
            reject('error getting data');

          });
      } else {
        resolve(this.municipalities);
      }
    });

    return p;
  }

  public async queryBarangay(municipalityId) {
    let barangays = await this.locationStorage.getBarangayByMunicipality(municipalityId);

    if (!barangays || barangays.length <= 0) {
      const res = await this.http.get<BarangayModel[]>(this.barangayApi + '?municipality_id=' + municipalityId).toPromise();
      barangays = res.map(b => ({ value: b.barangay_id.toString(), label: b.barangay }));
    }

    return barangays;
  }

  public async queryMunicipality(provinceId) {
    let municipalities = await this.locationStorage.getMunicipalitiesByProvince(provinceId);

    if (!municipalities || municipalities.length <= 0) {
      const res = await this.getMunicipalityApi().toPromise();
      municipalities = res.filter((m) => m.filter_by_answer_value === provinceId.toString()).map(m => ({ value: m.id.toString(), label: m.label }));
    }

    return municipalities;
  }

  public async queryProvince(regionId) {
    let provinces = await this.locationStorage.getProvinceData();

    if (!provinces || provinces.length <= 0) {
      provinces = await this.getProvinceApi().toPromise();
    }

    return provinces.filter((p) => p.filter_by_answer_value.toString() === regionId);
  }

  public getBarangay(barangayId): Observable<BarangayModel> {
    return this.http.get<BarangayModel>(
      this.barangayApi + '?barangay_id=' + barangayId
    );
  }

  private regionsMapping(region) {
    return {
      id: region.region_id,
      filter_by_answer_name: '',
      filter_by_answer_value: '',
      value: region.region_id.toString(),
      label: region.region,
    };
  }

  private provincesMapping(province) {
    return {
      id: province.province_id,
      filter_by_answer_name: 'region',
      filter_by_answer_value: province.region_id,
      value: province.province_id.toString(),
      label: province.province,
      irrigated_dry: province.irrigated_dry,
      irrigated_wet: province.irrigated_wet,
      rainfed_dry: province.rainfed_dry,
      rainfed_wet: province.rainfed_wet,
      corn_avg: province.corn_avg,
      irrigated_1stq: province.irrigated_1stq,
      irrigated_2ndq: province.irrigated_2ndq,
      irrigated_3rdq: province.irrigated_3rdq,
      irrigated_4thq: province.irrigated_4thq,
      rainfed_1stq: province.rainfed_1stq,
      rainfed_2ndq: province.rainfed_2ndq,
      rainfed_3rdq: province.rainfed_3rdq,
      rainfed_4thq: province.rainfed_4thq
    };
  }

  private municipalitiesMapping(municipality) {
    return {
      id: municipality.municipality_id,
      filter_by_answer_name: 'province',
      filter_by_answer_value: municipality.province_id.toString(),
      value: municipality.municipality_id.toString(),
      label: municipality.municipality,
      soil_fertility: municipality.soil_fertility,
      hide_list: municipality.hide_list,
      zip_code: municipality.zip_code,
      run_id: municipality.run_id,
      lng: municipality.lng,
      lat: municipality.lat,
    }
  }

  public async getMunicipalityById(municipalityId: number, provinceId?: number) {
    const municipalities = provinceId ? await this.queryMunicipality(provinceId) : await this.getMunicipalities();
    const municipalityFound = municipalities.find(municipality => municipality.value === municipalityId);
    return municipalityFound;
  }

  public async getProvinceById(provinceId: number) {
    const provinces = await this.getProvinces();
    const provinceFound = provinces.find(province => province.value === provinceId.toString());
    return provinceFound;
  }
}
