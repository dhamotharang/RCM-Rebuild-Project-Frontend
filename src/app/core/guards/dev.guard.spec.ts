import { TestBed, async, inject } from '@angular/core/testing';

import { DevGuard } from './dev.guard';

describe('DevGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DevGuard]
    });
  });

  it('should ...', inject([DevGuard], (guard: DevGuard) => {
    expect(guard).toBeTruthy();
  }));
});
