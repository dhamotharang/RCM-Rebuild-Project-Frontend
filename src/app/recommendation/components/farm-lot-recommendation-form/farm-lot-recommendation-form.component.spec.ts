import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmLotRecommendationFormComponent } from './farm-lot-recommendation-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { SharedModule } from 'src/app/v2/shared/shared.module';

describe('FarmLotRecommendationFormComponent', () => {
  let component: FarmLotRecommendationFormComponent;
  let fixture: ComponentFixture<FarmLotRecommendationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, IonicModule, RouterTestingModule, SharedModule],
      declarations: [ FarmLotRecommendationFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmLotRecommendationFormComponent);
    component = fixture.componentInstance;

    component.fieldInfo = {
      field_size_ha: 0.4
    } as FarmApiModel

    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component.fieldInfo).toBeTruthy();
  //   expect(component).toBeTruthy();
  // });
});
