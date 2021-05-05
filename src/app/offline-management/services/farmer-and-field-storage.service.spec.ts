import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';

import { FarmerAndFieldStorageService } from './farmer-and-field-storage.service';
import { OfflineStorageService } from './offline-storage.service';

describe('FarmerAndFieldStorageService', () => {
  let storageServiceMock = {};
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: OfflineStorageService,
        useValue: storageServiceMock
      }
    ]
  }));

  it('should be created', () => {
    const service: FarmerAndFieldStorageService = TestBed.inject(FarmerAndFieldStorageService);
    expect(service).toBeTruthy();
  });
});
