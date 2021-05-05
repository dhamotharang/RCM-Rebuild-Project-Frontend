import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';

import { PotentialYieldStorageService } from './potential-yield-storage.service';

describe('PotentialYieldStorageService', () => {
  let storageServiceMock = {};
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: Storage,
        useValue: storageServiceMock
      }
    ]
  }));

  it('should be created', () => {
    const service: PotentialYieldStorageService = TestBed.inject(PotentialYieldStorageService);
    expect(service).toBeTruthy();
  });
});
