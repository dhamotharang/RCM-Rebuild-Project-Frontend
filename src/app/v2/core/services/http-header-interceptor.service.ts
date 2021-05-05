import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpHeaderInterceptorService implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler, ): Observable<HttpEvent<any>> {
    if(
      (
        req.url.indexOf(environment.farmerApi) >= 0) ||
        (
          req.url.indexOf(environment.fieldApi) >= 0
            && req.url.indexOf('regions') === -1
            && req.url.indexOf('provinces') === -1
            && req.url.indexOf('municipalities') === -1
            && req.url.indexOf('barangays') === -1
            && req.url.indexOf('contact-us') === -1
        )
      ) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.authService.loggedInUser.sessionToken)
      });
    }
    return next.handle(req);
  }
  
  constructor(private authService: AuthenticationService) { }
}