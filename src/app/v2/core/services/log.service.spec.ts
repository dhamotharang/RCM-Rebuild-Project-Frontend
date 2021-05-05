import { TestBed } from '@angular/core/testing';

import { LogService } from './log.service';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { HttpClient } from '@angular/common/http';

describe('LogService', () => {
  let authServiceStub = {

  }

  let httpClientStub = {

  }

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: AuthenticationService,
        useValue: authServiceStub
      },
      {
        provide: HttpClient,
        useValue: httpClientStub
      }
    ]
  }));

  it('should be created', () => {
    const service: LogService = TestBed.get(LogService);
    expect(service).toBeTruthy();
  });
});
