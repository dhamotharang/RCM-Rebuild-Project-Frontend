import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerFormComponent } from './farmer-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AlertController, ModalController, IonicModule } from '@ionic/angular';
import { FarmerService } from '../../../core/services/farmer.service';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Role } from 'src/app/v2/core/enums/role.enum';
import { BehaviorSubject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('FarmerFormComponent', () => {
  let component: FarmerFormComponent;
  let fixture: ComponentFixture<FarmerFormComponent>;
  
  let alertControllerMock = {};
  let modalControllerMock = {};
  let farmerServiceMock = {
    notify: new BehaviorSubject<{ status: string }>({ status: 'success' })
  };
  let authServiceMock = {
    loggedInUser: {
      gao: Role.DATA_ADMIN
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        IonicModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: AlertController,
          useValue: alertControllerMock
        }, {
          provide: ModalController,
          useValue: modalControllerMock
        }, {
          provide: FarmerService,
          useValue: farmerServiceMock
        }, {
          provide: AuthenticationService,
          useValue: authServiceMock
        }
      ],
      declarations: [ FarmerFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
