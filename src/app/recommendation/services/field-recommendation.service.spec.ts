import { TestBed } from '@angular/core/testing';

import { FieldRecommendationService } from './field-recommendation.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorService } from '../../v2/core/services/error.service';

describe('FieldRecommendationService', () => {
  let errorServiceMock = {};
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: ErrorService,
        useValue: errorServiceMock
      }
    ]
  }));

  // it('should be created', () => {
  //   const service: FieldRecommendationService = TestBed.get(FieldRecommendationService);
  //   expect(service).toBeTruthy();
  // });
});
