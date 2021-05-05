import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ErrorModel } from 'src/app/v2/core/models/error.model';

import { AuthenticationService } from './authentication.service';
import { AuthHttpInterceptorMock } from './http-mock/auth-http.mock';
import { ErrorLevelEnum } from 'src/app/v2/core/enums/error-level.enum';
import { Role } from 'src/app/v2/core/enums/role.enum';
import { UserLoginModel } from '../models/user-login.model';
import {ConfigurationService} from '../../v2/core/services/configuration.service';

describe('AuthenticationService', () => {

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthHttpInterceptorMock,
          multi: true
        },
        {
          provide: ConfigurationService,
          useValue: jasmine.createSpyObj('ConfigurationService', ['getValue'])
        }
      ]
    })
  );

  it('should be created', () => {
    const service: AuthenticationService = TestBed.inject(AuthenticationService);
    expect(service).toBeTruthy();
  });

  describe('login() http response', () => {
    describe('when http request is successful', () => {
      it('should return correct login', fakeAsync(async () => {
        const service: AuthenticationService = TestBed.inject(AuthenticationService);
        const res = await service.login('testuser', 'test').toPromise();
        expect(res.data.firstName).toBeTruthy();
        expect(res.data.operatorId).toEqual('RU0000-00000');
      }));
    });

    describe('when http request throws a validation error', () => {
      it('should throw invalid credentials', fakeAsync(async () => {
        const service: AuthenticationService = TestBed.inject(AuthenticationService);
        try {
          const res = await service.login('invalid', 'test').toPromise();
        } catch (e) {
          const err = e as ErrorModel;
          expect(err.level).toEqual(ErrorLevelEnum.Validation);
          expect(err.message).toEqual('Invalid username or password');
        }
      }));
    });

    describe('when http request throws a no internet error', () => {
      it('should throw no internet connection', fakeAsync(async () => {
        const service: AuthenticationService = TestBed.inject(AuthenticationService);
        try {
          const res = await service.login('noInternet', 'test').toPromise();
        } catch (e) {
          const err = e as ErrorModel;
          expect(err.level).toEqual(ErrorLevelEnum.Validation);
          expect(err.message).toEqual('No internet connection');
        }
      }));
    });

    describe('when http request throws an unknown/general exception error', () => {
      it('should throw exception error', fakeAsync(async () => {
        const service: AuthenticationService = TestBed.inject(AuthenticationService);
        try {
          const res = await service.login('exception', 'test').toPromise();
        } catch (e) {
          const err = e as ErrorModel;
          expect(err.level).toEqual(ErrorLevelEnum.Exception);
          expect(err.message).toEqual('An error occurred. If error persists, report issue to RAS contact us page.');
        }
      }));
    });

    describe('when http request throws a timeout exception error', () => {
      it('should throw timeout exception error', fakeAsync(async () => {
        const service: AuthenticationService = TestBed.inject(AuthenticationService);
        try {
          const res = await service.login('timeouterror', 'test').toPromise();
        } catch (e) {
          const err = e as ErrorModel;
          expect(err.level).toEqual(ErrorLevelEnum.Exception);
          expect(err.message).toEqual('Server takes too long to respond');
        }
      }));
    });

  });

  describe('Identify user role', () => {

    const loggedInUser: UserLoginModel = {
      userId: 314,
      firstName: 'firstname',
      lastName: 'lastname',
      officeAddress: {
        regionId: 3,
        provinceId: 1,
        municipalityId: 4,
        barangayId: 1
      },
      mobileNumber: '099999999',
      profilePhotoUrl: '',
      operatorId: 'RU0000-00000',
      sessionToken: 'eyJ0eXAiOiJKV1',
      gao: 0,
      email: 'name@mail.com',
      profession: 6,
      otherProfession: 'AEW'
    };

    describe('when user has data admin role', () => {
      it('should have data admin access level', () => {
        const authenticationService: AuthenticationService = TestBed.inject(AuthenticationService);

        loggedInUser.gao = Role.DATA_ADMIN;
        authenticationService.loggedInUser = loggedInUser;

        expect(authenticationService.isDataAdmin).toBeTruthy();

      });
    });


    describe('when user has regional data admin role', () => {
      it('should have regional data admin access level', () => {
        const authenticationService: AuthenticationService = TestBed.inject(AuthenticationService);

        loggedInUser.gao = Role.REGIONAL_DATA_ADMIN;
        authenticationService.loggedInUser = loggedInUser;

        expect(authenticationService.isRegionalDataAdmin).toBeTruthy();

      });
    });


    describe('when user has regional role', () => {
      it('should have regional user  access level', () => {
        const authenticationService: AuthenticationService = TestBed.inject(AuthenticationService);

        loggedInUser.gao = Role.REGIONAL;
        authenticationService.loggedInUser = loggedInUser;

        expect(authenticationService.isRegional).toBeTruthy();

      });
    });


    describe('when user has provincial role', () => {
      it('should have provincial user access level', () => {
        const authenticationService: AuthenticationService = TestBed.inject(AuthenticationService);

        loggedInUser.gao = Role.PROVINCIAL;
        authenticationService.loggedInUser = loggedInUser;

        expect(authenticationService.isProvincial).toBeTruthy();

      });
    });


    describe('when user has municipal role', () => {
      it('should have municipal user access level', () => {
        const authenticationService: AuthenticationService = TestBed.inject(AuthenticationService);

        loggedInUser.gao = Role.MUNICIPAL;
        authenticationService.loggedInUser = loggedInUser;

        expect(authenticationService.isMunicipal).toBeTruthy();

      });
    });

    describe('when user has national role', () => {
      it('should have national user access level', () => {
        const authenticationService: AuthenticationService = TestBed.inject(AuthenticationService);

        loggedInUser.gao = Role.NATIONAL;
        authenticationService.loggedInUser = loggedInUser;

        expect(authenticationService.isNational).toBeTruthy();

      });
    });

  });


});
