import { TestBed } from '@angular/core/testing';

import { RecommendationValidityNoteService } from './recommendation-validity-note.service';

describe('RecommendationValidityNoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecommendationValidityNoteService = TestBed.get(RecommendationValidityNoteService);
    expect(service).toBeTruthy();
  });
});
