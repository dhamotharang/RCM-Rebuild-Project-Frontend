import { TestBed } from '@angular/core/testing';

import { ContactUsService } from './contact-us.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorService } from 'src/app/v2/core/services/error.service';

describe('ContactUsService', () => {
  let errorServiceMock = {};
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: ErrorService,
        useValue: errorServiceMock
      }
    ]
  }));

  it('should be created', () => {
    const service: ContactUsService = TestBed.get(ContactUsService);
    expect(service).toBeTruthy();
  });
});
