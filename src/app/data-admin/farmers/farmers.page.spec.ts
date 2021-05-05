import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmersPage } from './farmers.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FarmerService } from '../../core/services/farmer.service';
import { ModalController, AlertController } from '@ionic/angular';
import { LocationService } from '../../core/services/location.service';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { of } from 'rxjs';
import { BarangayModel } from '../../core/models/barangay.model';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { ConfigurationService } from '../../v2/core/services/configuration.service';

describe('FarmersPage', () => {
  let component: FarmersPage;
  let fixture: ComponentFixture<FarmersPage>;

  let farmerServiceMock = {
    getFarmerList: (roleId: string, locationAddress: string, isAdmin: boolean, query?: string, pageIndex?: number, pageSize?: number, withFilters?: boolean, fromDate?:Date, toDate?: Date, filterCheckKey?: string ) => {
      let fList = [{
        address: {
          barangay: ''
        }
      }] as FarmerApiModel[];
      return of(fList);
    }
  };
  let modalControllerMock = {};
  let alertControllerMock = {};
  let locationServiceMock = {
    getBarangay: (barangay: string) => {
      let barangayModel = {} as BarangayModel;

      return of(barangayModel);
    }
  };
  let authServiceMock = {
    isAuthenticated: () => true,
    loggedInUser: {
      address: {

      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: FarmerService,
          useValue: farmerServiceMock
        }, {
          provide: ModalController,
          useValue: modalControllerMock
        }, {
          provide: AlertController,
          useValue: alertControllerMock
        }, {
          provide: LocationService,
          useValue: locationServiceMock
        }, {
          provide: AuthenticationService,
          useValue: authServiceMock
        },
        {
          provide: OfflineStorageService,
          useValue: {}
        },
        {
          provide: ConfigurationService,
          useValue: jasmine.createSpyObj('ConfigurationService', ['getValue'])
        }
      ],
      declarations: [ FarmersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
