import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogModel } from 'src/app/v2/core/models/log.model';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/login/services/authentication.service';

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

  log(service: string, method: string, error: string): Observable<LogModel> {
    let loggedInUser = this.authService.loggedInUser;

    let log = {
      service: service,
      method: method,
      error: error,
      userId: loggedInUser.userId,
      name: loggedInUser.firstName + ' ' + loggedInUser.lastName
    }
    return this.http.post<LogModel>(this.logUrl, log, this.httpOptions);
  }

  getLogs(): Observable<LogModel[]> {
    return this.http.get<LogModel[]>(this.logUrl);
  }
}
