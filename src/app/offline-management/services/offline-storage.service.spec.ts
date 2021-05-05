import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';

import { OfflineStorageService } from './offline-storage.service';

describe('OfflineStorageService', () => {
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
    const service: OfflineStorageService = TestBed.inject(OfflineStorageService);
    expect(service).toBeTruthy();
  });
});
