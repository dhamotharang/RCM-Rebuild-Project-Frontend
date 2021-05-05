import { LocationFormModel } from 'src/app/location/models/location-form.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcmFormLocationComponent } from './rcm-form-location.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationService } from '../../../../core/services/location.service';
import { AuthenticationService } from '../../../../core/services/authentication/authentication.service';
import { of } from 'rxjs';
import { AddressApiModel } from 'src/app/location/models/api';

describe('RcmFormLocationComponent', () => {
  let component: RcmFormLocationComponent;
  let fixture: ComponentFixture<RcmFormLocationComponent>;
  let authServiceMock = {};
  let locationServiceMock = {
    loadLocationLookups: () => of({}),
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: LocationService,
          useValue: locationServiceMock
        }, {
          provide: AuthenticationService,
          useValue: authServiceMock
        }
      ],
      declarations: [ RcmFormLocationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcmFormLocationComponent);
    component = fixture.componentInstance;
    component.address = null as AddressApiModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
