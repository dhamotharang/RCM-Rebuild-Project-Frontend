import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AlertService', () => {
  let routerServiceStub = {
    events: of(new Promise((resolve, reject) => {
      setTimeout(() => resolve(null));
    }))
  }
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: Router,
        useValue: routerServiceStub
      }
    ]
  }));

  it('should be created', () => {
    const service: AlertService = TestBed.get(AlertService);
    expect(service).toBeTruthy();
  });
});
