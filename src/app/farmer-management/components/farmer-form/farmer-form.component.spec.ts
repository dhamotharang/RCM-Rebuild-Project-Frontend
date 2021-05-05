import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FarmerFormComponent } from './farmer-form.component';
import { AlertNotificationService } from 'src/app/v2/core/services/alert-notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import {ConfigurationService} from '../../../v2/core/services/configuration.service';

describe('FarmerFormComponent', () => {
  let component: FarmerFormComponent;
  let fixture: ComponentFixture<FarmerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: DatePipe,
          useValue: {}
        },
        {
          provide: AlertNotificationService,
          useValue: {}
        },
        {
            provide: OfflineStorageService,
            useValue: {}
        },
        {
          provide: ConfigurationService,
          useValue: jasmine.createSpyObj('ConfigurationService', ['getValue'])
        }
      ]
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
