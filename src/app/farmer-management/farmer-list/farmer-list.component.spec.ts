import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { PageInfoModel } from 'src/app/v2/core/models/page-info.model';
import { BrowserUrlService } from 'src/app/v2/core/services/browser-url.service';
import { FarmerFilterModel } from '../models/farmer-filter.model';
import { FarmerService } from '../services/farmer.service';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { FarmerListComponent } from './farmer-list.component';
import { LocationService } from 'src/app/location/service/location.service';
import { ConfigurationService } from '../../v2/core/services/configuration.service';
import { FieldService } from "src/app/farm-management/services/field.service";

describe('FarmerListComponent', () => {
  let storageServiceMock = {
    get: () => {
      
    }
  };
  let component: FarmerListComponent;
  let fixture: ComponentFixture<FarmerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FarmerListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: FarmerService,
          useValue: {
            queryFarmers: (farmerFilter: FarmerFilterModel, pageInfo: PageInfoModel, roleId: number, isDownload?: boolean) => {
              return of([]);
            }
          },
        },
        {
          provide: ConfigurationService,
          useValue: jasmine.createSpyObj('ConfigurationService', ['getValue'])
        },
        {
          provide: AuthenticationService,
          useValue: {
            loggedInUser: {
              gao: 6,
              officeAddress: {
                regionId: 1,
                provinceId: 1,
                municipalityId: 1,
                barangayId: 1
              }
            }
          }
        },
        {
          provide: BrowserUrlService,
          useValue: {
            getQueryStringValue: (key: string) => {
              return '';
            },
            upsertQueryParam : (key: string, value: string) => {
              // do nothing
              return;
            }
          }
        },
        {
          provide: Storage,
          useValue: storageServiceMock
        },
        {
          provide: LocationService,
          useValue: {
            getLocationName: (regionId, provinceId, municipalId, barangayId?) => {
              return {}
            }
          }
        },
        {
          provide: FieldService,
          useValue: {
          }
        },
        {
          provide: ModalController,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {},
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
