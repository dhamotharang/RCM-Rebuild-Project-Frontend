import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldCardItemComponent } from './field-card-item.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddressApiModel } from 'src/app/location/models/api';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';

describe('FieldCardItemComponent', () => {
  let component: FieldCardItemComponent;
  let fixture: ComponentFixture<FieldCardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldCardItemComponent ],
      imports: [
        MatTooltipModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldCardItemComponent);
    component = fixture.componentInstance;
    component.fieldInfo = {
      address: { } as AddressApiModel
    } as  FarmApiModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
