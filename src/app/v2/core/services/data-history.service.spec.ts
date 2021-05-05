import { TestBed, async } from '@angular/core/testing';

import { DataHistoryService } from './data-history.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ErrorService } from 'src/app/v2/core/services/error.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';

describe('DataHistoryService', () => {


  beforeEach(async(() => {
    let serviceStub = {
      get: of({})
    }

    let errorServiceStub = {

    }

    let offlineStorageStub = {

    }
    TestBed.configureTestingModule({
    providers: [
      { provide: HttpClient, useValue: serviceStub},
      { provide: ErrorService, useValue: errorServiceStub},
      { provide: OfflineStorageService, useValue: offlineStorageStub}
    ]
  })}));

  it('should be created', () => {
    const service: DataHistoryService = TestBed.get(DataHistoryService);
    expect(service).toBeTruthy();
  });
});
