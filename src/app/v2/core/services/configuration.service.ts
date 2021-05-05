import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { tap, mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private configuration: any;

  constructor(private http: HttpClient) { }

  public load(): Observable<void> {
    return this.http.get('/app/config.json')
        .pipe(
            tap((configuration: any) => this.configuration = configuration),
            mapTo(undefined)
        );
  }

  public getValue(key: string, defaultValue?: any): any {
    return this.configuration[key] || defaultValue;
  }

}
