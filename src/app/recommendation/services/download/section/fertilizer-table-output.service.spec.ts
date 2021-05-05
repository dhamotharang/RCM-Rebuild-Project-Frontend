import { async, TestBed } from '@angular/core/testing';
import { KgToBagsPipe } from 'src/app/recommendation/pipe/kg-to-bags.pipe';
import { RouterTestingModule } from '@angular/router/testing';

import { FertilizerTableOutputService } from './fertilizer-table-output.service';
import { CapitalizePipe } from 'src/app/v2/shared/pipe/capitalize.pipe';

describe('FertilizerTableOutputService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: KgToBagsPipe,
          useValue: new KgToBagsPipe() 
        },
        {
          provide: CapitalizePipe,
          useValue: new CapitalizePipe() 
        }
      ]
    });
  }));

  it('should be created', () => {
    const service: FertilizerTableOutputService = TestBed.get(FertilizerTableOutputService);
    expect(service).toBeTruthy();
  });
});
