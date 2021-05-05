import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerFieldInfoComponent } from './farmer-field-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FarmerService } from '../../../core/services/farmer.service';
import { Location } from '@angular/common';
import { ModalController, ToastController } from '@ionic/angular';
import { GpxModel } from '../../../core/models/gpx.model';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Role } from 'src/app/v2/core/enums/role.enum';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { FieldService } from 'src/app/farm-management/services/field.service';

describe('FarmerFieldInfoComponent', () => {
  let component: FarmerFieldInfoComponent;
  let fixture: ComponentFixture<FarmerFieldInfoComponent>;

  let modalControllerMock = {};
  let fieldServiceMock = {
    getGpx: () => {
      const gpdModel = {
        paths: []
      } as GpxModel;
      return of(gpdModel);
    },
    getFarmerField: (fieldId: number) => {
      const farmerField = {} as FarmApiModel;

      return of(farmerField);
    }
  };
  let farmerServiceMock = {
    getFarmerInfo: (farmerId: number) => {
      const farmerModelMock = {
        first_name: 'name mock'
      } as FarmerApiModel;
      return of(farmerModelMock);

    }
  };
  let locationMock = {};
  let toastControllerMock = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: FieldService,
          useValue: fieldServiceMock
        },
        {
          provide: FarmerService,
          useValue: farmerServiceMock
        }, {
          provide: Location,
          useValue: locationMock
        }, {
          provide: ModalController,
          useValue: modalControllerMock
        }, {
          provide: ToastController,
          useValue: toastControllerMock
        }, {
          provide: AuthenticationService,
          useValue: {
            loggedInUser: {
              gao: Role.DATA_ADMIN
            },
            isAuthenticated: () => true,
          }
        }
      ],
      declarations: [ FarmerFieldInfoComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerFieldInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
