import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { Observable, of, TimeoutError } from 'rxjs';
import {
  BarangayApiModel,
  MunicipalityApiModel,
  ProvinceApiModel,
  RegionApiModel,
} from '../../models/api';
import {
  DEFAULT_BARANGAY_ID,
  DEFAULT_BARANGAY_LABEL,
  DEFAULT_MUNICIPALITY_ID,
  DEFAULT_MUNICIPALITY_LABEL,
  DEFAULT_PROVINCE_ID,
  DEFAULT_PROVINCE_LABEL,
  DEFAULT_REGION_ID,
  DEFAULT_REGION_LABEL,
} from './values.mock';

@Injectable()
export class LocationInterceptorHttpMock implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url && request.url.indexOf(`/v1/rcmffr/regions`) >= 0) {
      return of(
        new HttpResponse({
          status: 200,
          body: [
            {
              region_id: DEFAULT_REGION_ID,
              region: DEFAULT_REGION_LABEL,
            },
          ] as RegionApiModel[],
        })
      );
    } else if (
      request.url &&
      request.url.indexOf(`/v1/rcmffr/provinces`) >= 0
    ) {
      return of(
        new HttpResponse({
          status: 200,
          body: [
            {
              province_id: DEFAULT_PROVINCE_ID,
              province: DEFAULT_PROVINCE_LABEL,
              region_id: DEFAULT_REGION_ID
            }, {
              province_id: 2,
              province: 'province 2',
              region_id: 2
            },
          ] as ProvinceApiModel[],
        })
      );
    } else if (
      request.url &&
      request.url.indexOf(`/v1/rcmffr/municipalities`) >= 0
    ) {
      return of(
        new HttpResponse({
          status: 200,
          body: [
            {
              municipality_id: DEFAULT_MUNICIPALITY_ID,
              municipality: DEFAULT_MUNICIPALITY_LABEL,
              province_id: DEFAULT_PROVINCE_ID,
            },
            {
              municipality_id: 2,
              municipality: 'municipality 2',
              province_id: 2,
            },
          ] as MunicipalityApiModel[],
        })
      );
    } else if (
      request.url &&
      request.url.indexOf(`/v1/rcmffr/barangays`) >= 0
    ) {
      if ( request.url.indexOf(`-99`) >= 0) {
        return of(
          new HttpResponse({
            status: 200,
            body: [] as BarangayApiModel[],
          })
        );
      } else {
        return of(
          new HttpResponse({
            status: 200,
            body: [
              {
                barangay_id: DEFAULT_BARANGAY_ID,
                barangay: DEFAULT_BARANGAY_LABEL,
                municipality_id: DEFAULT_MUNICIPALITY_ID
              },
              {
                barangay_id: 2,
                barangay: 'test-barangay-2',
                municipality_id: 2
              },
            ] as BarangayApiModel[],
          })
        );
      }
    }

    return next.handle(request);
  }
}
