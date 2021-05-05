import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, map, take, timeout } from 'rxjs/operators';
import { UserApiModel } from '../models/api/user-api.model';
import { ErrorLevelEnum } from 'src/app/v2/core/enums/error-level.enum';
import { environment } from 'src/environments/environment';
import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { Role, RoleLabel } from 'src/app/v2/core/enums/role.enum';
import { OfficeAddressApiModel } from '../models/api/office-address-api.model';
import { NO_CONNECTION, BAD_REQUEST, REQUEST_TIMEOUT } from 'src/app/v2/core/constants/status-codes.constant';
import {ConfigurationService} from '../../v2/core/services/configuration.service';
import { LoginResponseApiModel } from '../models/api/login-response-api.model';
import { LoginResponseModel } from '../models/login-response.model';
import { UserAccessModel } from '../models/user-access.model';

// TO DO: Refactor. follow DRY
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private configurationService: ConfigurationService) {}

  public loggedInUser: UserLoginModel;

  public login(username: string, password: string): Observable<LoginResponseModel> {
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}/v1/rcmuser/login`,
        JSON.stringify({ username, password }),
        httpOptions
      )
      .pipe(
        timeout(this.configurationService.getValue('apiTimeout')),
        take(1),
        map((loginResponseApiModel: LoginResponseApiModel) => ({
          data: this.mapUserApiModel(loginResponseApiModel.data),
          error: loginResponseApiModel.error
        })),
        catchError((err) => {
          if (err.status == REQUEST_TIMEOUT || err instanceof TimeoutError) {
            throw {
              level: ErrorLevelEnum.Exception,
              message: 'Server takes too long to respond',
            };
          } else if (err.status == NO_CONNECTION) {
            throw {
              level: ErrorLevelEnum.Validation,
              message: 'No internet connection',
            };
          } else if (err.status == BAD_REQUEST) {
            throw {
              level: ErrorLevelEnum.Validation,
              message: 'Invalid username or password',
            };
          } else {
            throw {
              level: ErrorLevelEnum.Exception,
              message: 'An error occurred. If error persists, report issue to RAS contact us page.',
            };
          }
        })
      );
  }

  public storeLoginUser(loginUser: UserLoginModel) {
    localStorage.setItem('LOGGED_IN_USER', JSON.stringify(loginUser));
    this.loggedInUser = loginUser;
  }

  public isAuthenticated(): boolean {
    if (this.loggedInUser) {
      return true;
    } else {
      const sessionLoginUserJsonString = localStorage.getItem('LOGGED_IN_USER');
      if (sessionLoginUserJsonString) {
        const userSession = JSON.parse(sessionLoginUserJsonString);
        this.loggedInUser = userSession;
        return true;
      } else {
        return false;
      }
    }
  }

  private mapOfficeAddress(officeAddress: OfficeAddressApiModel) {
    if (officeAddress) {
      return {
        regionId: officeAddress.region_id,
        provinceId: officeAddress.province_id,
        municipalityId: officeAddress.municipality_id,
        barangayId: officeAddress.barangay_id
      };
    }

    return null;
  }

  private mapUserApiModel(userApiModel: UserApiModel): UserLoginModel {
    if (userApiModel) {
      return {
        userId: userApiModel.user_id,
        firstName: userApiModel.first_name,
        lastName: userApiModel.last_name,
        gao: userApiModel.government_agency_office,
        officeAddress: this.mapOfficeAddress(userApiModel.office_address),
        mobileNumber: userApiModel.mobile_number,
        profilePhotoUrl: userApiModel.photo,
        operatorId: userApiModel.operator_id,
        sessionToken: userApiModel.session_id,
        email: userApiModel.email,
        profession: userApiModel.profession,
        otherProfession: userApiModel.other_profession,
      };
    }

    return null;
  }

  public logout() {
    localStorage.clear();
    return;
  }

  public get isAdmin() {
    return this.isDataAdmin;
  }

  public get isNational() {
    return this.loggedInUser.gao === Role.NATIONAL;
  }

  public get isRegional() {
    return this.loggedInUser.gao === Role.REGIONAL;
  }

  public get isProvincial() {
    return this.loggedInUser.gao === Role.PROVINCIAL;
  }

  public get isMunicipal() {
    return this.loggedInUser.gao === Role.MUNICIPAL;
  }

  public get isRegionalDataAdmin() {
    return this.loggedInUser.gao === Role.REGIONAL_DATA_ADMIN;
  }

  public get isDataAdmin() {
    return this.loggedInUser.gao === Role.DATA_ADMIN;
  }

  public get isPublicUser() {
    return this.loggedInUser.gao === Role.PUBLIC;
  }

  public get accessLevelText() {
    let accessLevelLabel = "";

    switch (this.loggedInUser.gao) {
      case Role.NATIONAL:
        accessLevelLabel = RoleLabel.NATIONAL;
        break;
      case Role.REGIONAL:
        accessLevelLabel = RoleLabel.REGIONAL;
        break;
      case Role.PROVINCIAL:
        accessLevelLabel = RoleLabel.PROVINCIAL;
        break;
      case Role.MUNICIPAL:
        accessLevelLabel = RoleLabel.MUNICIPAL;
        break;
      case Role.PUBLIC:
        accessLevelLabel = RoleLabel.PUBLIC;
        break;
      case Role.DATA_ADMIN:
        accessLevelLabel = RoleLabel.DATA_ADMIN;
        break;
      case Role.REGIONAL_DATA_ADMIN:
        accessLevelLabel = RoleLabel.REGIONAL_DATA_ADMIN;
        break;
    }

    return accessLevelLabel;
  }

  public get userAccessState(): UserAccessModel {
    return {
      isAdmin: this.isAdmin,
      isNational: this.isNational,
      isRegional: this.isRegional,
      isProvincial: this.isProvincial,
      isMunicipal: this.isMunicipal,
      isRegionalDataAdmin: this.isRegionalDataAdmin,
      isDataAdmin: this.isDataAdmin,
      isPublicUser: this.isPublicUser
    }
  }

}
