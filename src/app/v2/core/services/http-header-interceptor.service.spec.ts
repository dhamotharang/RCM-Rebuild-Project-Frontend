import { TestBed } from '@angular/core/testing';

import { HttpHeaderInterceptorService } from './http-header-interceptor.service';
import { AuthenticationService } from 'src/app/login/services/authentication.service';

describe('HttpHeaderInterceptorServiceService', () => {
  let authServiceStub = {};
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: AuthenticationService,
        useValue: authServiceStub
      }
    ]
  }));

  it('should be created', () => {
    const service: HttpHeaderInterceptorService = TestBed.get(HttpHeaderInterceptorService);
    expect(service).toBeTruthy();
  });
});
