import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from './authentication/authentication.service';
import { environment } from '../../../environments/environment';
import {  catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * @deprecated Use HttpHeaderInterceptorService in v2 folder instead
 */
@Injectable({
  providedIn: 'root'
})
export class HttpHeaderInterceptorService implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler, ): Observable<HttpEvent<any>> {

    if((req.url.indexOf(environment.farmerApi) >= 0) || (req.url.indexOf(environment.fieldApi) >= 0)) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.authService.userInfo.session_id)
      });
    }
    return next.handle(req);
  }
  
  constructor(private authService: AuthenticationService) { }
}