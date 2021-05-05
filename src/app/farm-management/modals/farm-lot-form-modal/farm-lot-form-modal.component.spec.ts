import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  NavParams,
  ModalController,
  AlertController,
  IonicModule,
} from '@ionic/angular';
import { DataService } from '../../../core/services/data.service';
import { LocationService } from '../../../core/services/location.service';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Role } from 'src/app/v2/core/enums/role.enum';
import { RouterTestingModule } from '@angular/router/testing';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { FarmLotFormModalComponent } from './farm-lot-form-modal.component';

describe('FarmLotFormModalComponent', () => {
  let component: FarmLotFormModalComponent;
  let fixture: ComponentFixture<FarmLotFormModalComponent>;

  let navParamsMock = {
    get: (paramName: string) => {
      switch (paramName) {
        case 'type':
          return 'add';
        case 'field_name_display':
          return 'test field name'; // POSSIBLE HTML QUERY INJECTION
      }
    },
  };
  let modalControllerMock = {};
  let dataServiceMock = {};
  let locationServiceMock = {};
  let alertControllerMock = {};
  let authServiceMock = {
    loggedInUser: {
      gao: Role.DATA_ADMIN,
    },
  };

  let offlineStorageServiceStub = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        IonicModule,
      ],
      providers: [
        {
          provide: NavParams,
          useValue: navParamsMock,
        },
        {
          provide: ModalController,
          useValue: modalControllerMock,
        },
        {
          provide: DataService,
          useValue: dataServiceMock,
        },
        {
          provide: LocationService,
          useValue: locationServiceMock,
        },
        {
          provide: AlertController,
          useValue: alertControllerMock,
        },
        {
          provide: AuthenticationService,
          useValue: authServiceMock,
        },
        {
          provide: OfflineStorageService,
          useValue: offlineStorageServiceStub,
        },
      ],
      declarations: [FarmLotFormModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmLotFormModalComponent);
    component = fixture.componentInstance;
    component.farmerInfo = {
      id: 0,
      farmerId: '123',
      firstName: 'aaa',
      lastName: 'aaa',
      middleName: 'aaa',
      isMiddleNameUnknown: false,
      suffixName: '',
      gender: 1,
      rsbsa: 1,
      rsbsaId: '123',
      farmerType: [1],
      otherFarmerType: '',
      otherFarmerTypeName: '',
      birthdate: new Date(),
      address: {
        regionId: 1,
        provinceId: 1,
        municipalityId: 1,
        barangayId: 1,
      },
      farmerPhotoBase64: 'aaa',
      dataPrivacyConsentBase64: 'aaa',
      farmerAssociation: 'aaa',
      contactInfo: {
        mobileNumber: '09999999999',
        phoneOwner: 1,
        otherPhoneOwner: '',
        alternativeMobileNumber: '',
        alternativePhoneOwner: 0,
        alternativeOtherPhoneOwner: '',
      },
      createdDate: new Date(),
      modifiedDate: new Date(),
      fullName: 'aaaabbb',
      farmLotCount: 0,

      offlineId: '',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
