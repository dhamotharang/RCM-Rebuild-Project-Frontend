import { LoaderOverlayService } from 'src/app/v2/core/services/loader-overlay.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ErrorModel } from 'src/app/v2/core/models/error.model';
import { ErrorLevelEnum } from 'src/app/v2/core/enums/error-level.enum';
import { AlertNotificationService } from 'src/app/v2/core/services/alert-notification.service';
import { ConfigurationService } from '../v2/core/services/configuration.service';
import { LoginResponseModel } from './models/login-response.model';
import {EmailStatus} from '../core/enum/email-status.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  public version;
  private unsubscribe = new Subject<any>();
  public loginErrorMessage: string;
  public username: string;
  public password: string;

  constructor(
    private authService: AuthenticationService,
    private alertNotificationService: AlertNotificationService,
    private router: Router,
    private loaderOverlayService: LoaderOverlayService,
    private configurationService: ConfigurationService
  ) {
    const isUserLoggedIn = this.authService.isAuthenticated();
    if (isUserLoggedIn) {
      this.router.navigate(['data-admin/farmer-management/farmer-list']);
    }

    this.version = this.configurationService.getValue('version');
  }

  ionViewWillEnter() {
    this.loginErrorMessage = "";
  }

  ionViewDidLeave() {
    this.loaderOverlayService.hideOverlay();
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
 
  public ngOnInit() {
  }

  public login() {
    if (this.username && this.password) {
      this.loaderOverlayService.showOverlay();
      this.loginErrorMessage = '';
      this.authService.login(this.username, this.password)
      .pipe(take(1))
      .subscribe((loginResponse: LoginResponseModel) => {
        this.loaderOverlayService.hideOverlay();
        if (loginResponse.error.errors.length > 0) {
          loginResponse.error.errors.forEach(error => {
            if (error.code === EmailStatus.RECENTLY_SEND) {
              this.loginErrorMessage = error.message;
            }
          });
        } else {
          this.authService.storeLoginUser(loginResponse.data);
          this.router.navigate(['data-admin/farmer-management/farmer-list']);
        }
      }, (error: ErrorModel) => {
        if (error.level === ErrorLevelEnum.Validation) {
          this.loginErrorMessage = error.message;
        } else {
          this.alertNotificationService.showAlert(error.message);
        }
        this.loaderOverlayService.hideOverlay();
      });
    }
  }
}
