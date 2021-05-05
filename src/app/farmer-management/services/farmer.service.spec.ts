import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';

import { FarmerService } from './farmer.service';

describe('FarmerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: DatePipe,
        useValue: {}
      },
      {
        provide: OfflineStorageService,
        useValue: {}
      }]
  }));

  it('should be created', () => {
    const service: FarmerService = TestBed.inject(FarmerService);
    expect(service).toBeTruthy();
  });
});
