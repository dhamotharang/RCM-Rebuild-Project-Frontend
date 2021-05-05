import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsPage } from './contact-us.page';
import { AlertService } from '../core/services/alert/alert.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastService } from '../v2/core/services/toast.service';
import {ConfigurationService} from '../v2/core/services/configuration.service';

describe('ContactUsPage', () => {
  let component: ContactUsPage;
  let fixture: ComponentFixture<ContactUsPage>;
  let alertServiceStub: any = {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactUsPage ],
      imports: [
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AlertService,
          useValue: alertServiceStub
        },
        {
          provide: ToastService,
          useValue: alertServiceStub
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
    fixture = TestBed.createComponent(ContactUsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
