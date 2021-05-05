import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';

import { UploadFarmerAndFieldOfflineStorageService } from './upload-farmer-and-field-offline-storage.service';
import { RecommendationStorageService } from "src/app/recommendation/services/recommendation-storage.service";

describe('UploadFarmerAndFieldOfflineStorageService', () => {
  let service: UploadFarmerAndFieldOfflineStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Storage,
          useValue: {}
        },
        {
          provide: HttpClient,
          useValue: {}
        },
        {
          provide: DatePipe,
          useValue: {}
        },
        {
          provide: DecimalPipe,
          useValue: {}
        },
        {
          provide: OfflineStorageService,
          useValue: {}
        }
      ]
    });
    service = TestBed.inject(UploadFarmerAndFieldOfflineStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
