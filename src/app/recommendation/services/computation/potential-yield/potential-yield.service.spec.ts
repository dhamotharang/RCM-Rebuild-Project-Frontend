import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { PotentialYieldService } from './potential-yield.service';

describe('PotentialYieldService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    })
  );

  xit('should be created', () => {
    const service: PotentialYieldService = TestBed.get(PotentialYieldService);
    expect(service).toBeTruthy();
  });

  xit('should compute for the correct value', () => {
    const service: PotentialYieldService = TestBed.get(PotentialYieldService);

    service.computePotentialYield(
      3,
      296,
      2,
      new Date(),
      2,
      NaN,
      undefined,
      3,
      5.909302325581395,
      2,
      4.36,
      2
    );

    expect(Math.round(service.potentialYield)).toEqual(6);
  });
});
