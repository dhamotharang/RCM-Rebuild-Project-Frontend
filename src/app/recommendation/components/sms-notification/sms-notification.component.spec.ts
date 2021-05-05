import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsNotificationComponent } from './sms-notification.component';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('SmsNotificationComponent', () => {
  let component: SmsNotificationComponent;
  let fixture: ComponentFixture<SmsNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    	imports: [
    	          ReactiveFormsModule,
    	          IonicModule,
    	          MatDatepickerModule,
    	          RouterTestingModule,
    	          TranslateModule.forRoot()
    	        ],
      declarations: [ SmsNotificationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
