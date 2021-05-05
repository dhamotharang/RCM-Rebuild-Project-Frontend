import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { RecommendationPage } from './recommendation-page.component';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';

describe('FieldRecommendationComponent', () => {
  let component: RecommendationPage;
  let fixture: ComponentFixture<RecommendationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        IonicModule,
        RouterModule.forRoot([]),
      ],
      declarations: [RecommendationPage],
      providers: [{provide: OfflineStorageService, useValue: {}}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
