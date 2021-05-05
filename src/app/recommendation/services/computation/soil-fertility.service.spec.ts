import { SoilFertility } from '../../enum/soil-fertility.enum';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { SoilFertilityService } from './soil-fertility.service';
import { WaterSource } from '../../enum/water-source.enum';
import { SeasonService } from './season.service';
import { LocationService } from '../../../core/services/location.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { of } from 'rxjs';

describe('SoilFertilityService', () => {
  let service: SoilFertilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        {
          provide: SeasonService,
          useValue: new SeasonService()
        },{
          provide: LocationService,
          useValue: {getMunicipalityById: (id) => {
            of({soilFertility: 0})
          }}
        },{ provide: OfflineStorageService, useValue: {
          
        }}
      ]
    });
    TestBed.configureTestingModule({});
    service = TestBed.get(SoilFertilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return Fallow for noOfCrops = 1 and dry season', async () => {
    const soilFertility = await service.computeSoilFertility(
      1,
      new Date('2020-05-22'),
      1,
      WaterSource.IRRIGATED,
      1
    );
    expect(soilFertility).toEqual(SoilFertility.FALLOW);
  });

  it('should return High for noOfCrops = 1, dry season and rainfed', async () => {
    const soilFertility = await service.computeSoilFertility(
      1,
      new Date('2020-05-22'),
      1,
      WaterSource.RAINFED,
      1
    );
    expect(soilFertility).toEqual(SoilFertility.HIGH);
  });
});
