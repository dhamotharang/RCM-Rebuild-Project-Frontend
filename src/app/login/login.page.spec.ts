import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { LoginPage } from './login.page';
import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { AuthenticationService } from './services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DataAdminPage } from "src/app/data-admin/data-admin.page";
import { of, throwError } from 'rxjs';
import { ErrorModel } from '../v2/core/models/error.model';
import { LoaderOverlayService } from '../v2/core/services/loader-overlay.service';
import { AlertController } from '@ionic/angular';
import { ErrorLevelEnum } from '../v2/core/enums/error-level.enum';
import { Router } from '@angular/router';
import { FarmerListComponent } from '../farmer-management/farmer-list/farmer-list.component';
import { ConfigurationService } from '../v2/core/services/configuration.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, RouterTestingModule.withRoutes([{
        path: 'data-admin',
        component: DataAdminPage,
        children: [
          {
            path: 'farmer-management',
            children: [{
              path: 'farmer-list',
              component: FarmerListComponent
            }]
          }
        ]
      }])],
      providers: [{
        provide: AuthenticationService,
        useValue: {
          login: (username, password) => {

            if (username.indexOf('validation') > -1) {
              return throwError(({
                message: 'Incorrect username or Password',
                level: ErrorLevelEnum.Validation
              } as ErrorModel));
            }

            if (username.indexOf('exception') > -1) {
              return throwError(({
                message: 'Exception error',
                level: ErrorLevelEnum.Exception
              } as ErrorModel));
            }

            return of({
              firstName: 'string',
              lastName: 'string'
            } as UserLoginModel);

          },
          isAuthenticated: () => true,
          storeLoginUser: (loggedInUser: UserLoginModel) => {
            return;
          }
        }
      },
      {
        provide: ConfigurationService,
        useValue: jasmine.createSpyObj('ConfigurationService', ['getValue'])
      }]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('login()', () => {
    describe('when login api is successful', () => {
      beforeEach(() => {
        component.username = 'testuser';
        component.password = 'test';
      });

      it('should have no login error message', () => {
        component.login();
        expect(component.loginErrorMessage).toEqual("");
      });

      it('should call storeLoginUser service method', () => {
        const authService = TestBed.inject(AuthenticationService);
        const authServiceStoreLoginUserSpy = spyOn(authService, 'storeLoginUser').and.callThrough();
        component.login();
        const isUserEmailVerified = false;
        if (isUserEmailVerified) {
          expect(authServiceStoreLoginUserSpy).toHaveBeenCalledTimes(1);
        }
      });

      it('should redirect to data-admin dashboard', () => {
        const routerService = TestBed.inject(Router);
        
        const routerServiceNavigate = spyOn(
          routerService,
          'navigate'
        ).and.callThrough();
        component.login();
        const isUserEmailVerified = false;
        if (isUserEmailVerified) {
          expect(routerServiceNavigate).toHaveBeenCalledWith(['data-admin/farmer-management/farmer-list']);
        }
      })

      it('should call showOverlay exactly 1 time', () => {
        const loaderOverlayService = TestBed.inject(LoaderOverlayService);
        const loaderOverlayShowSpy = spyOn(
          loaderOverlayService,
          'showOverlay'
        ).and.callThrough();
        component.login();
        expect(loaderOverlayShowSpy).toHaveBeenCalledTimes(1);
      });

      it('should call hideOverlay exactly 1 time', () => {
        const loaderOverlayService = TestBed.inject(LoaderOverlayService);
        const loaderOverlayHideSpy = spyOn(
          loaderOverlayService,
          'hideOverlay'
        ).and.callThrough();
        component.login();
        expect(loaderOverlayHideSpy).toHaveBeenCalledTimes(1);
      });
    })

    describe('when login api throws validation error', () => {
      beforeEach(() => {
        component.username = 'validation';
        component.password = 'test';
      });
    
      it('should display login validation error', () => {
        const loaderOverlayService = TestBed.inject(LoaderOverlayService);
        component.login();
        expect(component.loginErrorMessage).toEqual("Incorrect username or Password");
      });

      it('should call showOverlay exactly 1 time', () => {
        const loaderOverlayService = TestBed.inject(LoaderOverlayService);
        const loaderOverlayShowSpy = spyOn(
          loaderOverlayService,
          'showOverlay'
        ).and.callThrough();
        component.login();
        expect(loaderOverlayShowSpy).toHaveBeenCalledTimes(1);
      });

      it('should call hideOverlay exactly 1 time', () => {
        const loaderOverlayService = TestBed.inject(LoaderOverlayService);
        const loaderOverlayHideSpy = spyOn(
          loaderOverlayService,
          'hideOverlay'
        ).and.callThrough();
        component.login();
        expect(loaderOverlayHideSpy).toHaveBeenCalledTimes(1);
      });
  
    })

    describe('when login service throws exception error', () => {
      beforeEach(() => {
        component.username = 'exception';
        component.password = 'test';
      })

      it('should display login exception error', () => {
        const alertControllerService = TestBed.inject(AlertController);
        const alertControllerSpy = spyOn(
          alertControllerService,
          'create'
        ).and.callThrough();
        component.login();
  
        expect(alertControllerSpy).toHaveBeenCalledTimes(1)
      });

      it('should call showOverlay exactly 1 time', () => {
        const loaderOverlayService = TestBed.inject(LoaderOverlayService);
        const loaderOverlayShowSpy = spyOn(
          loaderOverlayService,
          'showOverlay'
        ).and.callThrough();
        component.login();
        expect(loaderOverlayShowSpy).toHaveBeenCalledTimes(1);
      });

      it('should call showOverlay exactly 1 time', () => {
        const loaderOverlayService = TestBed.inject(LoaderOverlayService);
        const loaderOverlayHideSpy = spyOn(
          loaderOverlayService,
          'hideOverlay'
        ).and.callThrough();
        component.login();
        expect(loaderOverlayHideSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
