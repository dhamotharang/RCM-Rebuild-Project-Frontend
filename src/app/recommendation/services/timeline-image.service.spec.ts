import { CustomDialectTranslationPipe } from 'src/app/recommendation/pipe/custom-dialect-translation.pipe';
import { TestBed } from '@angular/core/testing';

import { TimelineImageService } from './timeline-image.service';

describe('TimelineImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ CustomDialectTranslationPipe ]
  }));

  it('should be created', () => {
    const service: TimelineImageService = TestBed.get(TimelineImageService);
    expect(service).toBeTruthy();
  });
});
