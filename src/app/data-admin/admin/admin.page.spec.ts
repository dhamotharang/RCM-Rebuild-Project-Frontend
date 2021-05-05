import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPage } from './admin.page';
import { UserService } from '../../core/services/user.service';
import { FarmerService } from '../../core/services/farmer.service';
import { DataHistoryService } from '../../v2/core/services/data-history.service';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminPage', () => {
  let component: AdminPage;
  let fixture: ComponentFixture<AdminPage>;

  beforeEach(async(() => {
    let userServiceStub = {};
    let farmerServiceStub = {};
    let dataHistoryServiceStub = {};
    let modalControllerStub = {};
    let authServiceStub = {
      isAuthenticated: () => true,
      loggedInUser: {
        officeAddress: ''
      }
    };

    TestBed.configureTestingModule({
      declarations: [ AdminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: UserService,
          useValue: userServiceStub
        }, {
          provide: FarmerService,
          useValue: farmerServiceStub
        }, {
          provide: DataHistoryService,
          useValue: dataHistoryServiceStub
        }, {
          provide: ModalController,
          useValue: modalControllerStub
        }, {
          provide: AuthenticationService,
          useValue: authServiceStub
        }
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
