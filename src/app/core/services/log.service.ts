import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Log } from '../models/log';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication/authentication.service';

/**
 * @deprecated Use LogService in v2 folder instead
 */
@Injectable({
  providedIn: 'root'
})
export class LogService {

  private logUrl = environment.logApi;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  log(service: string, method: string, error: string): Observable<Log> {
    let userInfo = this.authService.userInfo;

    let log = {
      service: service,
      method: method,
      error: error,
      user_id: userInfo.user_id,
      name: userInfo.first_name + ' ' + userInfo.last_name
    }
    return this.http.post<Log>(this.logUrl, log, this.httpOptions);
  }

  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(this.logUrl);
  }
}
