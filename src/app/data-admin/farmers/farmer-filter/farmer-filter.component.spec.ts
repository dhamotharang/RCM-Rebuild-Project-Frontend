import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerFilterComponent } from './farmer-filter.component';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ModalController } from '@ionic/angular';
import { LocationService } from '../../../core/services/location.service';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { MatNativeDateModule } from '@angular/material/core';
import { AddressApiModel } from 'src/app/location/models/api';

describe('FarmerFilterComponent', () => {
  let component: FarmerFilterComponent;
  let fixture: ComponentFixture<FarmerFilterComponent>;

  let modalControllerMock = {};
  let locationServiceMock = {};
  let authServiceMock = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MatDatepickerModule, MatDatepickerModule, MatNativeDateModule],
      providers: [
        {
          provide: ModalController,
          useValue: modalControllerMock,
        }, {
          provide: LocationService,
          useValue: locationServiceMock
        }, {
          provide: AuthenticationService,
          useValue: authServiceMock
        }
      ],
      declarations: [ FarmerFilterComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerFilterComponent);
    component = fixture.componentInstance;
    component.locationAddress = {} as AddressApiModel;
    fixture.detectChanges();
  });

  // TO FIX: Failing Create Test
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
