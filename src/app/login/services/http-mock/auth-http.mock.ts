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
import { ErrorModel } from 'src/app/v2/core/models/error.model';
import { UserApiModel } from 'src/app/login/models/api/user-api.model';
import { ErrorLevelEnum } from 'src/app/v2/core/enums/error-level.enum';

@Injectable()
export class AuthHttpInterceptorMock implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url && request.url.indexOf(`/v1/rcmuser/login`) > -1) {
      if (request.body.indexOf('testuser') > -1) {
        return of(
          new HttpResponse({
            status: 200,
            body: {
              data: {
                user_id: 314,
                first_name: 'firstname',
                last_name: 'lastname',
                government_agency_office: 6,
                office_address: { region_id: 3, province_id: 1, municipality_id: 4 },
                mobile_number: '099999999',
                photo: '',
                operator_id: 'RU0000-00000',
                session_id: 'eyJ0eXAiOiJKV1'
              } as UserApiModel,
            },
          })
        );
      } else if (request.body.indexOf('timeouterror') > -1) {
        throw new TimeoutError;
      } else if (request.body.indexOf('noInternet') > -1) {
        throw {
          status: 0,
          message: 'No internet connection',
          level: ErrorLevelEnum.Validation,
        } as ErrorModel
      } else if (request.body.indexOf('invalid') > -1) {
        throw {
          status: 400,
          message: 'Invalid username or password',
          level: ErrorLevelEnum.Validation,
        } as ErrorModel
      } else {
        throw {
          status: 500,
          message: 'An error occurred. If error persists, report issue to RAS contact us page.',
          level: ErrorLevelEnum.Exception,
        } as ErrorModel
      }
    }

    return next.handle(request);
  }
}
