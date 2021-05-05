import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCropManagementOutputComponent } from './other-crop-management-output.component';

describe('OtherCropManagementOutputComponent', () => {
  let component: OtherCropManagementOutputComponent;
  let fixture: ComponentFixture<OtherCropManagementOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherCropManagementOutputComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherCropManagementOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
