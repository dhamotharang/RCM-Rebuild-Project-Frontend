import { TestBed } from '@angular/core/testing';

import { SeasonService } from './season.service';
import { Season } from '../../enum/season.enum';

describe('SeasonService', () => {
  let service: SeasonService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(SeasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return dry for May', () => {
    let date = new Date('2020-05-23');
    const season = service.computeSeason(date);
    expect(season).toEqual(Season.DRY);
  });
});
