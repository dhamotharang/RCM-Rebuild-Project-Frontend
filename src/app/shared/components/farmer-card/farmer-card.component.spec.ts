import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerCardComponent } from './farmer-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';

describe('FarmerCardComponent', () => {
  let component: FarmerCardComponent;
  let fixture: ComponentFixture<FarmerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTooltipModule],
      declarations: [ FarmerCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerCardComponent);
    component = fixture.componentInstance;
    component.farmerInfo = {
      photo: ''
    } as FarmerApiModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
