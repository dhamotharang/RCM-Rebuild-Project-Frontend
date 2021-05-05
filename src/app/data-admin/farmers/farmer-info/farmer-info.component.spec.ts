import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerInfoComponent } from './farmer-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FarmerService } from '../../../core/services/farmer.service';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FieldService } from 'src/app/farm-management/services/field.service';

describe('FarmerInfoComponent', () => {
  let component: FarmerInfoComponent;
  let fixture: ComponentFixture<FarmerInfoComponent>;

  let farmerServiceMock = {
    getFarmerInfo: (farmerId:number) => {
      let farmerInfo = {
        address: {
          
        }
      } as FarmerApiModel;
      return of(farmerInfo);
    }
  };
  let fieldServiceMock = {
    getFields: (farmerId: number) => {
      let fields = [] as FarmApiModel[];
      return of(fields);
    }
  };
  let modalControllerMock = {};
  let authServiceMock = {
    isAuthenticated: () => true,
    loggedInUser: {}
  };

  let datePipeMock = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: FarmerService,
          useValue: farmerServiceMock
        }, {
          provide: FieldService,
          useValue: fieldServiceMock
        }, {
          provide: ModalController,
          useValue: modalControllerMock
        }, {
          provide: AuthenticationService,
          useValue: authServiceMock
        },
        {
          provide: DatePipe,
          useValue: datePipeMock 
        }
      ],
      declarations: [ FarmerInfoComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
