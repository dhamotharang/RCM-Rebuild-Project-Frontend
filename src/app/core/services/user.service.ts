import { LocationFormModel } from 'src/app/location/models/location-form.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginAddress } from './../models/login-address.model';
import { UserLoginModel } from 'src/app/login/models/user-login.model';

@Injectable({ providedIn: 'root' })
export class UserService {

    private apiUrl = environment.userApi;

    constructor(private http: HttpClient) { }

    public getUsers(locationAddress: LocationFormModel) {

        let params = new HttpParams();

        if (locationAddress.regionId) {
            params = params.append('region_id', locationAddress.regionId.toString());
        }
        if (locationAddress.provinceId) {
            params = params.append('province_id', locationAddress.provinceId.toString());
        }
        if (locationAddress.municipalityId) {
            params = params.append('municipality_id', locationAddress.municipalityId.toString());
        }

        return this.http.get<UserLoginModel>(this.apiUrl, { params: params }).pipe(
            catchError(this.handleError)
          );

    }

    private handleError(error: any) {
        console.log(error);
        return throwError(error);
      }
}