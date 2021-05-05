import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FarmerService } from '../services/farmer.service';
import { AuthenticationService } from 'src/app/login/services/authentication.service';

import { EditFarmerComponent } from './edit-farmer.component';
import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

describe('EditFarmerComponent', () => {
  let storageServiceMock = {};
  let component: EditFarmerComponent;
  let fixture: ComponentFixture<EditFarmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFarmerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: FarmerService,
          useValue: {}
        },
        {
          provide: AuthenticationService,
          useValue: {
            loggedInUser: { } as UserLoginModel,
          }
        },
        {
          provide: Storage,
          useValue: storageServiceMock
        },
        {
          provide: DatePipe,
          useValue: {}
        },
        {
          provide: DecimalPipe,
          useValue: {}
        },
        {
          provide: ModalController,
          useValue: {},
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFarmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});