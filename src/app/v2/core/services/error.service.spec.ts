import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { LogService } from 'src/app/v2/core/services/log.service';

describe('ErrorService', () => {
  let logServiceStub = {};

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: LogService,
        useValue: logServiceStub
      }
    ]
  }));

  it('should be created', () => {
    const service: ErrorService = TestBed.get(ErrorService);
    expect(service).toBeTruthy();
  });
});
