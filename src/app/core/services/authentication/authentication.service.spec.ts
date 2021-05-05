import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../alert/alert.service';

describe('AuthenticationService', () => {
  let platformServiceStub = {
    ready: () => new Promise((resolve, reject) => {
      setTimeout(() => resolve());
    })
  }

  let httpClientStub = {

  }

  let alertServiceStub = {

  }

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: Platform,
        useValue: platformServiceStub
      },
      {
        provide: HttpClient,
        useValue: httpClientStub
      }, {
        provide: AlertService,
        useValue: alertServiceStub
      }
    ]
  }));

  it('should be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });
});
