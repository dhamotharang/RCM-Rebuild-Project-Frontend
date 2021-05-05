import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FarmingPracticesRecommendationService } from './farming-practices-recommendation.service';

describe('FarmingPracticesRecommendationService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
  }));

  it('should be created', () => {
    const service: FarmingPracticesRecommendationService = TestBed.get(FarmingPracticesRecommendationService);
    expect(service).toBeTruthy();
  });
});
