import { TestBed, async, inject } from '@angular/core/testing';

import { DataAdminGuard } from './data-admin.guard';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { Role } from '../enum/role.enum';

describe('DataAdminGuard for DATA_ADMIN role', () => {
  let authServiceHub = {
    userInfo: {
      government_agency_office: Role.DATA_ADMIN
    }
  }

  let routerServiceStub: any = {

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataAdminGuard, 
        { 
          provide: AuthenticationService,
          useValue: authServiceHub
        },
        {
          provide: Router,
          useValue: routerServiceStub
        }]
    });
  });

  it('should be injected successfully', inject([DataAdminGuard], (guard: DataAdminGuard) => {
    expect(guard).toBeTruthy();
  }));

  
  it('canActivate should return true', inject([DataAdminGuard], (guard: DataAdminGuard) => {
    expect(guard.canActivate()).toBeTruthy();
  }));
});


describe('DataAdminGuard for REGIONAL_DATA_ADMIN role', () => {
  let authServiceHub = {
    userInfo: {
      government_agency_office: Role.REGIONAL_DATA_ADMIN
    }
  }

  let routerServiceStub: any = {

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataAdminGuard, 
        { 
          provide: AuthenticationService,
          useValue: authServiceHub
        },
        {
          provide: Router,
          useValue: routerServiceStub
        }]
    });
  });

  it('should be injected successfully', inject([DataAdminGuard], (guard: DataAdminGuard) => {
    expect(guard).toBeTruthy();
  }));

  
  it('canActivate should return true', inject([DataAdminGuard], (guard: DataAdminGuard) => {
    expect(guard.canActivate()).toBeTruthy();
  }));
});



describe('DataAdminGuard for MUNICIPAL role', () => {
  let authServiceHub = {
    userInfo: {
      government_agency_office: Role.MUNICIPAL
    }
  }

  let routerServiceStub: any = {
    parseUrl: () => {
      return false
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataAdminGuard, 
        { 
          provide: AuthenticationService,
          useValue: authServiceHub
        },
        {
          provide: Router,
          useValue: routerServiceStub
        }]
    });
  });

  it('should be injected successfully', inject([DataAdminGuard], (guard: DataAdminGuard) => {
    expect(guard).toBeTruthy();
  }));

  
  it('canActivate should return false', inject([DataAdminGuard], (guard: DataAdminGuard) => {
    expect(guard.canActivate()).toBeFalsy();
  }));
});

