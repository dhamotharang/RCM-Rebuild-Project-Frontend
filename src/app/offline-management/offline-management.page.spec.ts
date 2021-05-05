import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

import { OfflineManagementPage } from './offline-management.page';
import { FarmerService } from '../farmer-management/services/farmer.service';
import { OfflineStorageService } from './services/offline-storage.service';
import { FarmerAndFieldStorageService } from './services/farmer-and-field-storage.service';
import { of } from 'rxjs';
import { VarietyService } from '../recommendation/services/variety.service';

describe('OfflineManagementPage', () => {
  let storageServiceMock = {};
  let component: OfflineManagementPage;
  let fixture: ComponentFixture<OfflineManagementPage>;
  let httpClientStub = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfflineManagementPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        DecimalPipe,
        {
          provide: OfflineStorageService,
          useValue: storageServiceMock,
        },
        {
          provide: HttpClient,
          useValue: httpClientStub,
        },
        {
          provide: FarmerService,
          useValue: {},
        },
        {
          provide: VarietyService,
          useValue: {},
        },
        {
          provide: FarmerAndFieldStorageService,
          useValue: {
            getFarmerData: () => {
              return of(null).toPromise();
            },
            getFarmerDataLocation: () => {
              return of(null).toPromise();
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
