import { async, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { FarmerAndFieldInfoService } from './farmer-and-field-info.service';

describe('FarmerAndFieldInfoService', () => {
  let datePipeMock = {};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: DatePipe,
          useValue: datePipeMock 
        }
      ]
    });
  }));

  it('should be created', () => {
    const service: FarmerAndFieldInfoService = TestBed.get(FarmerAndFieldInfoService);
    expect(service).toBeTruthy();
  });
});
