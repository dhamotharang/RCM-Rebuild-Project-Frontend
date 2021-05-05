import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCropManagementComponent } from './other-crop-management.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';
import { KgToBagsPipe } from 'src/app/recommendation/pipe/kg-to-bags.pipe';
import { MonthPipe } from 'src/app/recommendation/pipe/month.pipe';

describe('OtherCropManagementComponent', () => {
  let component: OtherCropManagementComponent;
  let fixture: ComponentFixture<OtherCropManagementComponent>;
  let datePipeMock = {};
  let kgToBagsPipeMock = {};
  let monthPipe = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, IonicModule, FormsModule, RouterTestingModule, HttpClientModule],
      declarations: [ OtherCropManagementComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: DatePipe,
          useValue: datePipeMock 
        },
        {
          provide: KgToBagsPipe,
          useValue: kgToBagsPipeMock 
        },
        {
          provide: MonthPipe,
          useValue: monthPipe 
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherCropManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
