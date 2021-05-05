import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert/alert.service';

describe('AuthGuard', () => {
  let authServiceStub = {
    isAuthenticated: () => true,
    loggedInUser: {
      gao: 1
    }
  }

  let routerServiceStub: any = {

  }

  let alertServiceStub: any = {

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ { provide: AuthGuard, useClass: AuthGuard },
        { provide: AuthenticationService, useValue: authServiceStub }, 
        { provide: Router, useValue: routerServiceStub },
        { provide: AlertService, useValue: alertServiceStub}]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
