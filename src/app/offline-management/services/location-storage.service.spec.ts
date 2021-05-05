import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';

import { LocationStorageService } from './location-storage.service';

describe('LocationStorageService', () => {
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
    const service: LocationStorageService = TestBed.inject(LocationStorageService);
    expect(service).toBeTruthy();
  });
});
