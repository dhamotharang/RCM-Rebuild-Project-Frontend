import { Injectable } from '@angular/core';
import { ContactUsModel } from '../models/contact-us.model';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from 'src/app/v2/core/services/error.service';
import { environment } from 'src/environments/environment';
import { REQUEST_TIMEOUT, NO_CONNECTION } from 'src/app/v2/core/constants/status-codes.constant';
import { TimeoutError } from 'rxjs';
import { ErrorLevelEnum } from 'src/app/v2/core/enums/error-level.enum';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  private apiUrl = `${environment.apiBaseUrl}/v1/rcmffr/api/contact-us`;

  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
  private httpOptions = {
    headers: this.headers,
  };
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  public submitInquiry(contactUsModel: ContactUsModel) {
    return this.http
      .post<{id: number}>(this.apiUrl, JSON.stringify(contactUsModel), this.httpOptions)
      .pipe(
        catchError(err => {
          if (err.status == REQUEST_TIMEOUT || err instanceof TimeoutError) {
            throw {
              level: ErrorLevelEnum.Exception,
              message: 'Server takes too long to respond. Please try again',
            };
          } else if (err.status == NO_CONNECTION) {
            throw {
              level: ErrorLevelEnum.Exception,
              message: 'No internet connection.',
            };
          } else {
            throw {
              level: ErrorLevelEnum.Exception,
              message: 'An error occurred. Please try again.',
            };
          }
        })
      );
  }
}
