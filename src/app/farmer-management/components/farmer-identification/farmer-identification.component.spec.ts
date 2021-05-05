import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerIdentificationComponent } from './farmer-identification.component';
import { LocationService } from '../../../core/services/location.service';
import { BarangayModel } from 'src/app/core/models/barangay.model';
import { of } from 'rxjs';
import { AddressApiModel } from 'src/app/location/models/api';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';

describe('FarmerIdentificationComponent', () => {
  let component: FarmerIdentificationComponent;
  let fixture: ComponentFixture<FarmerIdentificationComponent>;

  let locationService = {
    getBarangay: (barangayId: number) => {
      let barangay = {} as BarangayModel;
      return of(barangay);
    },
    municipalities: [
      {
        id: 1,
        label: 'test municipality'
      }
    ],
    barangays: [
      {
        id: 1,
        label: 'test barangay'
      }
    ],
    provinces: [
      {
        id: 1,
        label: 'test province'
      }
    ],
    regions: [
      {
        id: 1,
        label: 'test region'
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LocationService,
          useValue: locationService
        }
      ],
      declarations: [ FarmerIdentificationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));


  describe('Create component with required values', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(FarmerIdentificationComponent);
      component = fixture.componentInstance;
      component.farmerInfo = {
        photo: '',
        contact_info: {
          mobile_number: ''
        },
        address: {
          barangay_id: 1,
          municipality_id: 1,
          province_id: 1,
          region_id: 1
        } as AddressApiModel
      } as FarmerApiModel;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('isFront should be true', () => {
      expect(component.isFront).toBeTruthy();
    });

    it('isBack should be true', () => {
      expect(component.isBack).toBeFalsy();
    });
    
  })
  
});
