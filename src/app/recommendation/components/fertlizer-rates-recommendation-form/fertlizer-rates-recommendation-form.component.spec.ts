import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { FertlizerRatesRecommendationFormComponent } from './fertlizer-rates-recommendation-form.component';
import { IrrigationLabelPipe } from 'src/app/recommendation/pipe/irrigation-label.pipe';
import { MonthPipe } from 'src/app/recommendation/pipe/month.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NPKRateOutputModel } from 'src/app/recommendation/model/npk-rate-output.model';

describe('FertlizerRatesRecommendationFormComponent', () => {
  let component: FertlizerRatesRecommendationFormComponent;
  let fixture: ComponentFixture<FertlizerRatesRecommendationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, IonicModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        FertlizerRatesRecommendationFormComponent,
        IrrigationLabelPipe,
        MonthPipe,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      FertlizerRatesRecommendationFormComponent
    );
    component = fixture.componentInstance;
    component.npkRateOutput = {} as NPKRateOutputModel;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
