import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFormControlDemoComponent } from './address-form-control-demo.component';

describe('AddressFormControlDemoComponent', () => {
  let component: AddressFormControlDemoComponent;
  let fixture: ComponentFixture<AddressFormControlDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressFormControlDemoComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormControlDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
