import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { KgToBagsPipe } from 'src/app/recommendation/pipe/kg-to-bags.pipe';

import { RecommendationSummaryComponent } from './recommendation-summary.component';

describe('RecommendationSummaryComponent', () => {
  let component: RecommendationSummaryComponent;
  let fixture: ComponentFixture<RecommendationSummaryComponent>;
  let datePipeMock = {};
  let kgToBagsPipeMock = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendationSummaryComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: DatePipe,
          useValue: datePipeMock 
        },
        {
          provide: KgToBagsPipe,
          useValue: kgToBagsPipeMock 
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
