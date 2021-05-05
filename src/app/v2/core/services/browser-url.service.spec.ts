import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BrowserUrlService } from './browser-url.service';

describe('BrowserUrlService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule
    ]
  }));

  it('should be created', () => {
    const service: BrowserUrlService = TestBed.inject(BrowserUrlService);
    expect(service).toBeTruthy();
  });
});
