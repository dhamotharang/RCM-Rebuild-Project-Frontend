import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { DataAdminPage } from './data-admin.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { PopoverController } from '@ionic/angular';
import { LocationFormModel } from 'src/app/location/models/location-form.model';
import { Router } from '@angular/router';
import { DataPrivacyPage } from './data-privacy/data-privacy.page';
import { FarmerService } from '../farmer-management/services/farmer.service';
import { ConfigurationService } from '../v2/core/services/configuration.service';

describe('DataAdmin Page', () => {
  let component: DataAdminPage;
  let fixture: ComponentFixture<DataAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataAdminPage],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'data-privacy',
            component: DataPrivacyPage,
          },
        ]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            isAuthenticated: () => true,
            storeLoginUser: (loggedInUser: UserLoginModel) => {
              return;
            },
            loggedInUser: {
              userId: 0,
              firstName: '',
              lastName: '',
              profilePhotoUrl: '',
              gao: 0,
              officeAddress: {} as LocationFormModel,
              mobileNumber: '',
              operatorId: '',
              sessionToken: '',
            } as UserLoginModel,
            isAdmin: true,
          },
        },
        {
          provide: ModalController,
          useValue: {
            create: () => {},
          },
        },
        {
          provide: OfflineStorageService,
          useValue: {},
        },
        {
          provide: PopoverController,
          useValue: {
            create: () => {},
          },
        },
        {
          provide: FarmerService,
          useValue: {},
        },
        {
          provide: ConfigurationService,
          useValue: jasmine.createSpyObj('ConfigurationService', ['getValue'])
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created create', () => {
    expect(component).toBeTruthy();
  });

  describe('mobile tab(s) navigation', () => {
    describe('when tab to dashboard is clicked', () => {
      it('should redirect to dashboard page', () => {
        const dashboardRouterLink = String(
          fixture.debugElement.nativeElement.querySelector(
            '.dashboard-route-mobile'
          ).outerHTML
        );
        expect(dashboardRouterLink).toContain('router-link');
        expect(dashboardRouterLink).toContain('/data-admin/farmer-management');
      });
    });

    describe('when tab to add farmer is clicked', () => {
      it('should show data privacy notice', () => {
        const modalControllerService = TestBed.inject(ModalController);
        const createModalController = spyOn(
          modalControllerService,
          'create'
        ).and.callThrough();
        component.dataPrivacy(false);
        expect(createModalController).toHaveBeenCalledTimes(1);
      });
    });

    describe('when tab to upload gpx is clicked', () => {
      it('should redirect to upload gpx page', () => {
        const uploadGpxRouterLink = String(
          fixture.debugElement.nativeElement.querySelector(
            '.gpx-upload-route-mobile'
          ).outerHTML
        );
        expect(uploadGpxRouterLink).toContain('router-link');
        expect(uploadGpxRouterLink).toContain('/data-admin/gpx-upload');
      });
    });

    describe('when tab to data privacy is clicked', () => {
      it('should show data privacy page', () => {
        const routerService = TestBed.inject(Router);

        const routerServiceNavigate = spyOn(
          routerService,
          'navigate'
        ).and.callThrough();
        component.dataPrivacyPage();
        expect(routerServiceNavigate).toHaveBeenCalledWith([
          '/data-admin/data-privacy',
        ]);
      });
    });
  });

  describe('mobile header navigation', () => {
    describe('when person-circle icon is clicked', () => {
      it('should show edit profile here balloon', () => {
        const popoverService = TestBed.inject(PopoverController);
        const popoverCreated = spyOn(
          popoverService,
          'create'
        ).and.callThrough();

        component.userProfileMobileMenu();
        expect(popoverCreated).toHaveBeenCalledTimes(1);
      });
    });

    describe('when caret-down-circle icon is clicked', () => {
      it('should show mobile menu balloon', () => {
        const popoverService = TestBed.inject(PopoverController);
        const popoverCreated = spyOn(
          popoverService,
          'create'
        ).and.callThrough();

        component.userProfileMobileMenu();
        expect(popoverCreated).toHaveBeenCalledTimes(1);
      });
    });
  });
});
