import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmManagementPage } from './farm-management.page';

describe('FarmManagementPage', () => {
  let component: FarmManagementPage;
  let fixture: ComponentFixture<FarmManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmManagementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
