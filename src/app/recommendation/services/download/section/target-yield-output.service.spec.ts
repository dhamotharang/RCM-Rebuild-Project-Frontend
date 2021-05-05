import { TestBed } from '@angular/core/testing';

import { TargetYieldOutputService } from './target-yield-output.service';

describe('TargetYieldOutputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TargetYieldOutputService = TestBed.get(TargetYieldOutputService);
    expect(service).toBeTruthy();
  });
});
