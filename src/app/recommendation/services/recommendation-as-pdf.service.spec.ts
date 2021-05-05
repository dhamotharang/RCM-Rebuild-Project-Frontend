import { async, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { KgToBagsPipe } from 'src/app/recommendation/pipe/kg-to-bags.pipe';
import { RouterTestingModule } from '@angular/router/testing';

import { RecommendationAsPdfService } from './recommendation-as-pdf.service';

describe('RecommendationAsPdfService', () => {
  let datePipeMock = {};
  let kgToBagsPipeMock = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
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
    });
  }));

  // it('should be created', () => {
  //   const service: RecommendationAsPdfService = TestBed.get(RecommendationAsPdfService);
  //   expect(service).toBeTruthy();
  // });
});
