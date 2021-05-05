import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerDataPage } from './farmer-data.page';

describe('FarmerDataPage', () => {
  let component: FarmerDataPage;
  let fixture: ComponentFixture<FarmerDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerDataPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
