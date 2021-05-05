import { TestBed } from '@angular/core/testing';

import { DataPrivacyService } from './data-privacy.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const httpClientStub = {

};

describe('DataPrivacyService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: HttpClient,
        useValue: httpClientStub
      }
    ]
  }));

  it('should be created', () => {
    const service: DataPrivacyService = TestBed.get(DataPrivacyService);
    expect(service).toBeTruthy();
  });
});
