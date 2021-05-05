import { TestBed } from '@angular/core/testing';

import { OtherManagementOutputService } from './other-management-output.service';

describe('OtherManagementOutputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OtherManagementOutputService = TestBed.get(OtherManagementOutputService);
    expect(service).toBeTruthy();
  });
});
