import { TestBed } from '@angular/core/testing';

import { DialectTranslationService } from './dialect-translation.service';

describe('DialectTranslationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialectTranslationService = TestBed.get(DialectTranslationService);
    expect(service).toBeTruthy();
  });
});
