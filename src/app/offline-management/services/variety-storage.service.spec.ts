import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';

import { VarietyStorageService } from './variety-storage.service';

describe('VarietyStorageService', () => {
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
    const service: VarietyStorageService = TestBed.inject(VarietyStorageService);
    expect(service).toBeTruthy();
  });
});
