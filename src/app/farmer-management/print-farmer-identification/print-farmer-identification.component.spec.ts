import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFarmerIdentificationComponent } from './print-farmer-identification.component';

describe('FarmerIdentificationComponent', () => {
  let component: PrintFarmerIdentificationComponent;
  let fixture: ComponentFixture<PrintFarmerIdentificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintFarmerIdentificationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintFarmerIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
