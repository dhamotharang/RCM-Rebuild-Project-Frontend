import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { AddressFormComponent } from './address-form.component';

describe('AddressFormComponent', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('empty data', () => {
  //   it('should expect disabled form', () => {
  //     component.formGroup = new FormGroup({
  //       region: new FormControl(null, []),
  //       province: new FormControl(null, []),
  //       municipality: new FormControl(null, []),
  //       barangay: new FormControl(null, []),
  //     });
  
  //     component.data = {
  //       regions: [],
  //       provinces: [],
  //       municipalities: [],
  //       barangays: []
  //     }

  //     // expect(component.formGroup.get('region').disabled === true).toBeTruthy();
  //     expect(component.formGroup.get('province').disabled === true).toBeTruthy();
  //     expect(component.formGroup.get('municipality').disabled === true).toBeTruthy();
  //     expect(component.formGroup.get('barangay').disabled === true).toBeTruthy();
  //   });
  // })

});
