import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  BarangayModel,
  MunicipalityModel,
  ProvinceModel,
  RegionModel,
} from 'src/app/location/models';
import {
  BarangayApiModel,
  MunicipalityApiModel,
  ProvinceApiModel,
  RegionApiModel,
} from 'src/app/location/models/api';
import { mergeMap, map } from 'rxjs/operators';
import { LocationFormModel } from '../models/location-form.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly regionsApi: string;
  private readonly municipalityApi: string;
  private readonly provinceApi: string;
  private readonly barangayApi: string;

  private regionData: RegionModel[];
  private provinceData: ProvinceModel[];
  private municipalityData: MunicipalityModel[];
  private barangayData: BarangayModel[];

  constructor(private http: HttpClient) {
    this.regionsApi = `${environment.apiBaseUrl}/v1/rcmffr/regions`;
    this.municipalityApi = `${environment.apiBaseUrl}/v1/rcmffr/municipalities`;
    this.provinceApi = `${environment.apiBaseUrl}/v1/rcmffr/provinces`;
    this.barangayApi = `${environment.apiBaseUrl}/v1/rcmffr/barangays`;
  }

  public getRegionsApi(): Observable<RegionModel[]> {
    // if cached region data is available do not make another api call
    if (this.regionData && this.regionData.length > 0) {
      return of(this.regionData);
    }
    return this.http.get<RegionApiModel[]>(this.regionsApi).pipe(
      map((data) => {
        const regionData = data.map((item) => ({
          id: item.region_id,
          label: item.region,
        }));

        // cache region data
        this.regionData = regionData;

        return regionData;
      })
    );
  }

  public getRegionProvinces(regionId: number): Observable<ProvinceModel[]> {
    return this.getProvinces().pipe(
      map((provinceList) =>
        provinceList.filter(
          (provinceItem) => provinceItem.regionId === regionId
        )
      )
    );
  }

  public getProvinces(): Observable<ProvinceModel[]> {
    if (this.provinceData && this.provinceData.length > 0) {
      return of(this.provinceData);
    }
    return this.http.get<ProvinceApiModel[]>(this.provinceApi).pipe(
      map((data) => {
        const provinceData = data.map(
          (item) =>
            ({
              id: item.province_id,
              label: item.province,
              regionId: item.region_id,
              cornAvg: item.corn_avg,
              irrigated1stq: item.irrigated_1stq,
              irrigated2ndq: item.irrigated_2ndq,
              irrigated3rdq: item.irrigated_3rdq,
              irrigated4thq: item.irrigated_4thq,
              irrigatedDry: item.irrigated_dry,
              irrigatedWet: item.irrigated_wet,
              rainfed1stq: item.rainfed_1stq,
              rainfed2ndq: item.rainfed_2ndq,
              rainfed3rdq: item.rainfed_3rdq,
              rainfed4thq: item.rainfed_4thq,
              rainfedDry: item.rainfed_dry,
              rainfedWet: item.rainfed_wet,
            } as ProvinceModel)
        );
        this.provinceData = provinceData;
        return provinceData;
      })
    );
  }

  public getProvinceMunicipalities(provinceId) {
    return this.getMunicipalities().pipe(
      map((municipalities) =>
        municipalities.filter(
          (municipality) => municipality.provinceId === provinceId
        )
      )
    );
  }

  public getMunicipalities(): Observable<MunicipalityModel[]> {
    // if cached region data is available do not make another api call
    if (this.municipalityData && this.municipalityData.length > 0) {
      return of(this.municipalityData);
    }
    return this.http.get<MunicipalityApiModel[]>(this.municipalityApi).pipe(
      map((data) => {
        const municipalityData = data.map((item) => ({
          id: item.municipality_id,
          label: item.municipality,
          runId: item.run_id,
          provinceId: item.province_id,
          soilFertility: item.soil_fertility,
        }));

        this.municipalityData = municipalityData;
        return municipalityData;
      })
    );
  }

  public getMunicipalityBarangays(municipalityId) {
    return this.http
      .get<BarangayApiModel[]>(
        `${this.barangayApi}?municipality_id=${municipalityId}`
      )
      .pipe(
        map((data) => {
          const barangayData = data.map(
            (item) =>
              ({
                id: item.barangay_id,
                label: item.barangay,
                municipalityId: item.municipality_id,
              } as BarangayModel)
          );

          return barangayData;
        })
      );
  }

  public getBarangaysApi(): Observable<BarangayModel[]> {
    // if cached barangay data is available do not make another api call
    if (this.barangayData && this.barangayData.length > 0) {
      return of(this.barangayData);
    }

    return this.http.get<BarangayApiModel[]>(this.barangayApi).pipe(
      map((data) => {
        const barangayData = data.map(
          (item) =>
            ({
              id: item.barangay_id,
              label: item.barangay,
              municipalityId: item.municipality_id,
            } as BarangayModel)
        );

        return barangayData;
      })
    );
  }


  public getLocationName(
    regionId: number,
    provinceId: number,
    municipalityId: number,
    barangayId?: number
  ) {
    let locationModel: LocationFormModel = {
      regionId: regionId,
      provinceId: provinceId,
      municipalityId: municipalityId,
      barangayId: barangayId
    };
    return this.getRegionsApi().pipe(
      mergeMap((regions) => {
        const region = regions.find(regionItem => regionItem.id === regionId);
        locationModel = {...locationModel, regionName: region.label};
        return this.getRegionProvinces(regionId);
      }),
      mergeMap((provinces) => {
        const province = provinces.find(provinceItem => provinceItem.id === provinceId) 
        locationModel = {...locationModel, provinceName: province.label};
        return this.getProvinceMunicipalities(provinceId);
      }),
      mergeMap((municipalities) => {
        const municipality = municipalities.find(municipalityItem => municipalityItem.id === municipalityId) 
        locationModel = {...locationModel, barangayName: municipality.label};
        return this.getMunicipalityBarangays(barangayId);
      }),
      map(barangays => {
        if (barangayId) {
          const barangay = barangays.find(barangayItem => barangayItem.id === barangayId) 
          locationModel = {...locationModel, barangayName: barangay.label};
        }
        return locationModel;
      })
    );
  }
}
