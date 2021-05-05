import { TestBed } from '@angular/core/testing';

import { GpxFileUploaderService } from './gpx-file-uploader.service';
import { ErrorService } from '../../v2/core/services/error.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GpxFileUploaderService', () => {
  const errorServiceMock = {};

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: ErrorService,
        useValue: errorServiceMock
      }
    ]
  }));

  // it('should be created', () => {
  //   const service: GpxFileUploaderService = TestBed.get(GpxFileUploaderService);
  //   expect(service).toBeTruthy();
  // });
});
