import { TestBed, async, inject } from '@angular/core/testing';

import { AllUserGuard } from './all-user.guard';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Router } from '@angular/router';

describe('AllUserGuard', () => {
  let authServiceHub = {
    loggedInUser: {
      gao: 1
    }
  }

  let routerServiceStub: any = {

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllUserGuard, { provide: AuthenticationService, useValue: authServiceHub }, 
      {
        provide: Router,
        useValue: routerServiceStub
      }]
    });
  });

  it('should ...', inject([AllUserGuard], (guard: AllUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
