import { TestBed } from '@angular/core/testing';
import { BrowserUrlService } from 'src/app/v2/core/services/browser-url.service';

import { FarmerFilterService } from './farmer-filter.service';

describe('FarmerFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [
    {
      provide: BrowserUrlService,
      useValue: {
        
      }
    }
  ]}));

  it('should be created', () => {
    const service: FarmerFilterService = TestBed.get(FarmerFilterService);
    expect(service).toBeTruthy();
  });
});
