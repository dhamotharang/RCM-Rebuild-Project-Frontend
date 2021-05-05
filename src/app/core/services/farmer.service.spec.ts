import { TestBed } from '@angular/core/testing';

import { FarmerService } from './farmer.service';
import { IErrorService, ErrorService } from '../../v2/core/services/error.service';
import { HttpClient } from '@angular/common/http';

describe('FarmerService', () => {
  const errorServiceStub: IErrorService = {
    handleError: (service: string, method: string) => {
      // do something
    }
  }

  let httpClientStub = {

  }
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: HttpClient,
        useValue: httpClientStub
      },
      {
        provide: ErrorService,
        useValue: errorServiceStub
      }
    ]
  }));

  // it('should be created', () => {
  //   const service: FarmerService = TestBed.get(FarmerService);
  //   expect(service).toBeTruthy();
  // });
});
