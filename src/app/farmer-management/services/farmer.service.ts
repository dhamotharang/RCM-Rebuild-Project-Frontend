import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError, take } from 'rxjs/operators';
import { ErrorService } from 'src/app/v2/core/services/error.service';
import { FarmerListResultApiModel } from 'src/app/farmer-management/models/api/farmer-list-result.model';
import { PageInfoModel } from 'src/app/v2/core/models/page-info.model';
import { environment } from 'src/environments/environment';
import { FarmerApiModel } from '../models/api/farmer-api.model';
import { FarmerFilterModel } from '../models/farmer-filter.model';
import { FarmerListModel } from '../models/farmer-list.model';
import { FarmerModel } from '../models/farmer.model';
import { OfflineDataModel } from 'src/app/offline-management/models/offline-data-model';
import { FarmerQuickFilterEnum } from '../enums/filter.enum';
import { ErrorLevelEnum } from 'src/app/v2/core/enums/error-level.enum';
import { FarmerDownloadListResultApiModel } from '../models/api/farmer-download-list-result-api.model';
import { FarmerDownloadApiModel } from '../models/api/farmer-download-api.model';
import { FarmerDownloadModel } from '../models/farmer-download.model';
import { FarmerDownloadListResultModel } from '../models/farmer-download-result.model';

import { AddressApiModel } from 'src/app/location/models/api';

@Injectable({
  providedIn: 'root',
})
export class FarmerService {
  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  public mapModeltoApi(farmerData: FarmerModel) {
    const farmerApiData: FarmerApiModel = {
      id: null,
      farmer_id: farmerData.farmerId,
      first_name: farmerData.firstName,
      middle_name: farmerData.middleName,
      is_middle_name_unknown: farmerData.isMiddleNameUnknown,
      last_name: farmerData.lastName,
      suffix_name: farmerData.suffixName,
      photo: farmerData.farmerPhotoBase64 ? farmerData.farmerPhotoBase64 : '',
      data_privacy_consent: farmerData.dataPrivacyConsentBase64,
      birth_date: formatDate(farmerData.birthdate, 'yyyy-MM-dd', 'en-US'),
      sex: farmerData.gender.toString(),
      address: {
        region: '',
        region_code: '',
        region_id: farmerData.address.regionId.toString(),

        province: '',
        province_code: '',
        province_id: farmerData.address.provinceId.toString(),

        municipality: '',
        municipality_code: '',
        municipality_id: farmerData.address.municipalityId.toString(),

        barangay: '',
        barangay_code: '',
        barangay_id: farmerData.address.barangayId
          ? farmerData.address.barangayId.toString()
          : 0,
      },
      contact_info: {
        mobile_number: farmerData.contactInfo.mobileNumber,
        phone_owner: farmerData.contactInfo.phoneOwner,
        other_phone_owner: farmerData.contactInfo.otherPhoneOwner,
        alternative_mobile_number:
          farmerData.contactInfo.alternativeMobileNumber,
        alternative_phone_owner: farmerData.contactInfo.alternativePhoneOwner
          ? farmerData.contactInfo.alternativePhoneOwner.toString()
          : null,
        alt_other_phone_owner:
          farmerData.contactInfo.alternativeOtherPhoneOwner,
      },
      rsbsa: farmerData.rsbsa ? farmerData.rsbsa.toString() : '',
      rsbsa_id: farmerData.rsbsaId,
      farmer_type: farmerData.farmerType ? farmerData.farmerType.toString() : '',
      farmer_association: farmerData.farmerAssociation ? farmerData.farmerAssociation.toString() : '',
      fields: [],
      status: 0,
      other_farmer_type: farmerData.otherFarmerTypeName,
      created_at: new Date(),
      updated_at: new Date(),
      offline_id: farmerData.offlineId
    };
    return farmerApiData;
  }

  public mapFarmerApiModelToUpdateOfflineFarmer(farmerData) {
    const offlineFarmerData = {
      id: farmerData.id,
      farmer_id: farmerData.farmerId,
      upload_failed: farmerData.upload_failed,
      fields: farmerData.fields,
    };
    return offlineFarmerData;
  }

  private mapApiToModel(farmerApiData: FarmerApiModel) {
    const farmerData: FarmerModel = {
      firstName: farmerApiData.first_name,
      lastName: farmerApiData.last_name,
      id: farmerApiData.id,
      farmerId: farmerApiData.farmer_id,
      farmerPhotoBase64: farmerApiData.photo,
      createdDate: farmerApiData.created_at,
      farmLotCount: farmerApiData.field_count,
      offlineId: farmerApiData.offline_id,
    } as FarmerModel;
    return farmerData;
  }

  public mapFarmerApiToFarmerModel(farmerData){
    return {
        id: farmerData.id,
        farmerId: farmerData.farmer_id,
        firstName: farmerData.first_name,
        middleName: farmerData.middle_name,
        isMiddleNameUnknown: farmerData.is_middle_name_unknown,
        lastName: farmerData.last_name,
        gender: farmerData.sex,
        suffixName: farmerData.suffix_name,
        birthdate: farmerData.birth_date,
        contactInfo: {
          mobileNumber: farmerData.contact_info.mobile_number,
          phoneOwner: farmerData.contact_info.phone_owner,
          otherPhoneOwner: farmerData.contact_info.other_phone_owner,
          alternativeMobileNumber: farmerData.contact_info.alternative_mobile_number,
          alternativePhoneOwner: farmerData.contact_info.alternative_phone_owner,
          alternativeOtherPhoneOwner: farmerData.contact_info.alt_other_phone_owner,
        },
        rsbsa: farmerData.rsbsa,
        rsbsaId: farmerData.rsbsa_id,
        farmerType: farmerData.farmer_type,
        otherFarmerType: farmerData.otherFarmerType,
        otherFarmerTypeName: farmerData.other_farmer_type,
        address: {
          regionId: parseInt(farmerData.address.region_id),
          provinceId: parseInt(farmerData.address.province_id),
          municipalityId: parseInt(farmerData.address.municipality_id),
          barangayId: parseInt(farmerData.address.barangay_id),
        },
        farmerPhotoBase64: farmerData.photo,
        dataPrivacyConsentBase64: farmerData.data_privacy_consent,
        createdDate: farmerData.created_at,
        modifiedDate: farmerData.updated_at,
        offlineId: farmerData.offline_id,
        farmLotCount: farmerData.field_count,
        farmerAssociation: farmerData.farmer_association,
      } as FarmerModel
  }

  private readonly farmerApiUrl: string;
  private readonly offlineUrl: string;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private datePipe: DatePipe,
  ) {
    this.farmerApiUrl = `${environment.apiBaseUrl}/v1/rcmffr/farmers`;
    this.offlineUrl = environment.offlineApi;
  }

  public addFarmer(farmerData: FarmerModel) {
    const farmerApiData = this.mapModeltoApi(farmerData);
    return this.http
      .post(this.farmerApiUrl, farmerApiData, {
        headers: this.headers,
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((response: any) => {
          const farmerApiDataResponse = { ...response.body };
          return farmerApiDataResponse;
        }),
        map((data: any) => {
          if (data.error) {
            throw {
              level: ErrorLevelEnum.Exception,
              message: data.error,
            };
          }
          return data as FarmerApiModel;
        }),
        map((data: FarmerApiModel) => {
          const model = {
            id: data.id,
          } as FarmerModel;
          return model;
        }),
        catchError((err) => {
          throw {
            level: ErrorLevelEnum.Exception,
            message: err && err.message ? err.message : 'An error occurred',
          };
        })
      );
  }

  public getFarmerAndFieldInfoForOffline(
    municipalityId: number
  ): Observable<OfflineDataModel> {
    const params = new HttpParams().set(
      'municipality_id',
      municipalityId.toString()
    );
    const url = `${this.offlineUrl}/farmers`;

    return this.http
      .get<OfflineDataModel>(url, { params: params })
      .pipe(
        catchError(
          this.errorService.handleError(
            'FarmerService',
            'getFarmerAndFieldInfoForOffline'
          )
        )
      );
  }

  public queryFarmerForDownload(
    farmerFilter: FarmerFilterModel,
    roleId: number,
    isSortedByBrgy?: boolean
  ) {
    let params = new HttpParams();

    // QUICK FILTERS
    const quickFilterParamValue = this.getQuickFilterParamValue(farmerFilter);

    if (quickFilterParamValue) {
      params = params.append('filterCheckedKey', quickFilterParamValue);
    }

    const withQuickFilters =
      farmerFilter &&
      (farmerFilter.idGenerated ||
        farmerFilter.interviewedByMe ||
        farmerFilter.notVerifiedField ||
        farmerFilter.verifiedField);

    params = params.append('role_id', roleId.toString());

    params = params.append('isDownload', '1');

    params = params.append('isSortedByBrgy', isSortedByBrgy ? '1' : '0'); // additional params required by endpoint

    if (farmerFilter) {
      params = withQuickFilters
        ? params.append('checkFilters', '1')
        : params.append('checkFilters', '0');

      if (farmerFilter.searchQuery) {
        params = params.append('searchQuery', farmerFilter.searchQuery);
      }

      if (farmerFilter.interviewedByMe) {
        params = params.append('interviewedByMe', '1');
      }

      if (farmerFilter.regionId) {
        params = params.append('filters', '1');

        if (farmerFilter.regionId) {
          params = params.append('region_id', farmerFilter.regionId.toString());
        }
        if (farmerFilter.provinceId) {
          params = params.append(
            'province_id',
            farmerFilter.provinceId.toString()
          );
        }
        if (farmerFilter.municipalId) {
          params = params.append(
            'municipality_id',
            farmerFilter.municipalId.toString()
          );
        }
        if (farmerFilter.barangayId && farmerFilter.barangayId !== -1) {
          params = params.append(
            'barangay_id',
            farmerFilter.barangayId.toString()
          );
        }
      } else {
        params = params.append('filters', '0');
      }

      if (farmerFilter.interviewDateFrom) {
        params = params.append(
          'fromDate',
          formatDate(farmerFilter.interviewDateFrom, 'yyyy-MM-dd', 'en-US')
        );
        params = params.append(
          'toDate',
          formatDate(farmerFilter.interviewDateTo, 'yyyy-MM-dd', 'en-US')
        );
      }
    }

    params = params.append('pageIndex', '0');
    params = params.append('pageSize', '5');

    params = params.append('isAdmin', '0'); // check if needed

    return this.http
      .get<FarmerDownloadListResultApiModel>(this.farmerApiUrl, { params: params })
      .pipe(
        map((apiModel: FarmerDownloadListResultApiModel) => {
          const farmers = apiModel.farmers.map((farmerApiModel) =>
          {
            return {
              contactNumber: farmerApiModel.contact_number,
              fieldSize: farmerApiModel.d_field_size,
              farmerBarangay: farmerApiModel.farmer_barangay,
              fieldName: farmerApiModel.field_name,
              firstName: farmerApiModel.first_name,
              gpxId: farmerApiModel.gpx_id,
              lastName: farmerApiModel.last_name,
              surveyDate: farmerApiModel.survey_date,
              verified: farmerApiModel.verified,
              verifiedFieldSize: farmerApiModel.verified_field_size,
            } as FarmerDownloadModel
          }
        );
          return {
            farmers: farmers,
            totalResultCount: apiModel.totalResultCount,
          } as FarmerDownloadListResultModel;
        })
      );
  }

  public queryFarmers(
    farmerFilter: FarmerFilterModel,
    pageInfo: PageInfoModel,
    roleId: number,
  ): Observable<FarmerListModel> {
    let params = new HttpParams();

    // QUICK FILTERS
    const quickFilterParamValue = this.getQuickFilterParamValue(farmerFilter);

    if (quickFilterParamValue) {
      params = params.append('filterCheckedKey', quickFilterParamValue);
    }

    const withQuickFilters =
      farmerFilter &&
      (farmerFilter.idGenerated ||
        farmerFilter.interviewedByMe ||
        farmerFilter.notVerifiedField ||
        farmerFilter.verifiedField);

    params = params.append('role_id', roleId.toString());

    params = params.append('isDownload', '0');

    params = params.append('isSortedByBrgy', '0'); // additional params required by endpoint

    if (farmerFilter) {
      params = withQuickFilters
        ? params.append('checkFilters', '1')
        : params.append('checkFilters', '0');

      if (farmerFilter.searchQuery) {
        params = params.append('searchQuery', farmerFilter.searchQuery);
      }

      if (farmerFilter.interviewedByMe) {
        params = params.append('interviewedByMe', '1');
      }

      if (farmerFilter.regionId) {
        params = params.append('filters', '1');

        if (farmerFilter.regionId) {
          params = params.append('region_id', farmerFilter.regionId.toString());
        }
        if (farmerFilter.provinceId) {
          params = params.append(
            'province_id',
            farmerFilter.provinceId.toString()
          );
        }
        if (farmerFilter.municipalId) {
          params = params.append(
            'municipality_id',
            farmerFilter.municipalId.toString()
          );
        }
        if (farmerFilter.barangayId && farmerFilter.barangayId !== -1) {
          params = params.append(
            'barangay_id',
            farmerFilter.barangayId.toString()
          );
        }
      } else {
        params = params.append('filters', '0');
      }

      if (farmerFilter.interviewDateFrom) {
        params = params.append(
          'fromDate',
          formatDate(farmerFilter.interviewDateFrom, 'yyyy-MM-dd', 'en-US')
        );
        params = params.append(
          'toDate',
          formatDate(farmerFilter.interviewDateTo, 'yyyy-MM-dd', 'en-US')
        );
      }
    }

    if (pageInfo) {
      if (pageInfo.pageIndex >= 0 && pageInfo.pageSize >= 1) {
        params = params.append('pageIndex', pageInfo.pageIndex.toString());
        params = params.append('pageSize', pageInfo.pageSize.toString());
      }
    } else {
      params = params.append('pageIndex', '0');
      params = params.append('pageSize', '5');
    }

    params = params.append('isAdmin', '0'); // check if needed

    return this.http
      .get<FarmerListResultApiModel>(this.farmerApiUrl, { params: params })
      .pipe(
        map((apiModel: FarmerListResultApiModel) => {
          return {
            farmers: apiModel.farmers.map((farmerApiModel) =>
              this.mapApiToModel(farmerApiModel)
            ),
            totalResultCount: apiModel.totalResultCount,
          } as FarmerListModel;
        })
      );
  }

  private getQuickFilterParamValue(farmerFilter: FarmerFilterModel) {
    const quickFilterArray = [];
    if (farmerFilter.interviewedByMe) {
      quickFilterArray.push(FarmerQuickFilterEnum.InterviewedByMe);
    }

    if (farmerFilter.verifiedField) {
      quickFilterArray.push(FarmerQuickFilterEnum.VerifiedField);
    }

    if (farmerFilter.notVerifiedField) {
      quickFilterArray.push(FarmerQuickFilterEnum.NotVerifiedField);
    }

    if (farmerFilter.idGenerated) {
      quickFilterArray.push(FarmerQuickFilterEnum.IDGenerated);
    }
    return quickFilterArray.join(',');
  }


  // start of get farmer info logic
  public getFarmerById(id: number): Observable<FarmerModel> {
      const url = `${this.farmerApiUrl}/${id}`;
      return this.http
        .get<FarmerApiModel>(url, {
          headers: this.headers
        })
        .pipe(
          map((response: any) => {
            const farmerApiDataResponse = { ...response };
            return farmerApiDataResponse;
          }),
          map((data: any) => {
            if (data.error) {
              throw {
                level: ErrorLevelEnum.Exception,
                message: 'An error occurred 0',
              };
            }
            return data as FarmerApiModel;
          }),
          map((farmerInfo: FarmerApiModel) => {
            return this.mapFarmerApiToFarmerModel(farmerInfo);
          }),
          catchError((err) => {
            console.log(err)
            throw {
              level: ErrorLevelEnum.Exception,
              message: 'An error occurred 1',
            };
          })
        )
  }
 

  // start edit farmers info submit action
  public updateFarmerInfo(farmerId: number, farmer: FarmerModel) {

    let farmerApiData = this.mapModeltoApi(farmer);
    farmerApiData.id = farmerId;
    return this.http.put(`${this.farmerApiUrl}/${farmerId}`, farmerApiData, {
      headers: this.headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
        map((response: any) => {
          const farmerApiDataResponse = { ...response.body };
          return farmerApiDataResponse;
        }),
        map((data: any) => {
          if (data.error) {
            throw {
              level: ErrorLevelEnum.Exception,
              message: 'An error occurred',
            };
          }
          return data as FarmerApiModel;
        }),
        map((data: FarmerApiModel) => {
          const model = {
            id: data.id,
          } as FarmerModel;
          return model;
        }),
        catchError((err) => {
          throw {
            level: ErrorLevelEnum.Exception,
            message: 'An error occurred',
          };
        })
      );
    
  }

  
}
