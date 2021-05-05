import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { VarietyService } from './variety.service';

describe('VarietyService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    })
  );

  // it('should be created', () => {
  //   const service: VarietyService = TestBed.get(VarietyService);
  //   expect(service).toBeTruthy();
  // });
});
