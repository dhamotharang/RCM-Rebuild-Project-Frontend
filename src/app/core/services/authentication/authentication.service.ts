import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, Subject, observable, from, TimeoutError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first, map, take, catchError, timeout } from 'rxjs/operators';
import { AlertService } from '../alert/alert.service';
import { UserInfo } from '../../models/user-info.model';
import { Role } from '../../enum/role.enum';
import { environment } from '../../../../environments/environment';

const TOKEN_KEY = 'auth-token';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * @deprecated Use Authentication service in login module instead
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);
  public userInfo: UserInfo;
  public subject = new Subject<any>();
  // loaderToShow: any;

  constructor(
    private plt: Platform,
    private http: HttpClient,
    private alertService: AlertService,
  ) {
    // this.plt.ready().then(() => {
    //   this.checkToken();
    //   this.loadUser();
    // });
    
    this.checkToken();
    this.loadUser();
  }

  public checkToken() {
    if (sessionStorage.getItem(TOKEN_KEY)) {
      this.authenticationState.next(true);
    }

  }

  public loadUser() {

    if (JSON.parse(sessionStorage.getItem('USER_INFO'))) {
      this.userInfo = JSON.parse(sessionStorage.getItem('USER_INFO'));
    }
  }

  public login(username, password) {
    const req = {
      'username': username.toLowerCase(),
      'password': password
    };

    return this.http.post(environment.authApi, JSON.stringify(req), httpOptions)
      .pipe(
        take(1),
        timeout(5000),
        map((res: any) => {
          sessionStorage.setItem(TOKEN_KEY, res.data.session_id);
          this.authenticationState.next(true);
          this.subject.next(res.data);
          this.userInfo = this.setUserInfoModel(res.data);
          sessionStorage.setItem('USER_INFO', JSON.stringify(this.userInfo));
          return res;
        }),
        catchError((err) => {
          this.authenticationState.next(false);
          let errMsg = 'Username or password is incorrect!';
          const loginFailedHeader = `<h1><strong>Login Failed!</strong></h1><br/>`;
          const reportIssueToRas = `<br/>Please check your internet connection.<br/><br/> 
                                    <small>If error persist, report issue to RAS contact us page.</small>`;

          if (err.error != null) {
            errMsg = 'Error Status: ' + err.status;
          }

          // Handle error caused by internet interruption or requested endpoint has unaccessible file permission
          if (err.status === 0 || err.status === 403) {
            errMsg = 'An error was encountered while loading the page.';
          }

          // Handle 'timeout over' error
          if (err instanceof TimeoutError) {
            errMsg = 'Server connection timed out.';
            if(err.name === "TimeoutError"){ 
              errMsg = 'Browser connection timed out.';
            }
          }

          errMsg = loginFailedHeader + errMsg + reportIssueToRas
          this.alertService.error(errMsg);
          throw errMsg;
        })
      )
  }

  private setUserInfoModel(user: any) {
    const userInfo: UserInfo = {
      user_id: user.user_id,
      operator_id: user.operator_id,
      first_name: user.first_name,
      last_name: user.last_name,
      middle_name: user.middle_name,
      suffix: user.suffix,
      email: user.email,
      birthday: user.birthday,
      sex: user.sex,
      profession: user.profession,
      mobile_number: user.mobile_number,
      photo: user.photo,
      office_address:
      {
        region_id: user.office_address.region_id,
        province_id: user.office_address.province_id,
        municipality_id: user.office_address.municipality_id,
        barangay_id: user.office_address.barangay_id ? user.office_address.barangay_id : 0
      },
      government_agency_office: user.government_agency_office,
      session_id: user.session_id,
      email_status: user.email_status
    };

    return userInfo;
  }

  getLoginInfo(): Observable<any> {
    return this.subject.asObservable();
  }

  public logout() {
    sessionStorage.clear();
    this.authenticationState.next(false);
  }

  public isAuthenticated() {
    return this.authenticationState.value;
  }

  public get isAdmin() {
    return this.isDataAdmin;
  }

  public get isNational() {
    return this.userInfo.government_agency_office === Role.NATIONAL;
  }

  public get isRegional() {
    return this.userInfo.government_agency_office === Role.REGIONAL;
  }

  public get isProvincial() {
    return this.userInfo.government_agency_office === Role.PROVINCIAL;
  }

  public get isMunicipal() {
    return this.userInfo.government_agency_office === Role.MUNICIPAL;
  }

  public get isRegionalDataAdmin() {
    return this.userInfo.government_agency_office === Role.REGIONAL_DATA_ADMIN;
  }

  public get isDataAdmin() {
    return this.userInfo.government_agency_office === Role.DATA_ADMIN;
  }
}