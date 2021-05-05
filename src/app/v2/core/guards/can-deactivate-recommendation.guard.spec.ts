import { TestBed, async, inject } from '@angular/core/testing';

import { CanDeactivateRecommendationGuard } from './can-deactivate-recommendation.guard';

describe('CanDeactivateRecommendationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateRecommendationGuard]
    });
  });

  it('should ...', inject([CanDeactivateRecommendationGuard], (guard: CanDeactivateRecommendationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
