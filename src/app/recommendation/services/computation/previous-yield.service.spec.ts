import { TestBed } from '@angular/core/testing';
import { PreviousYieldService } from './previous-yield.service';
import { WaterSource } from 'src/app/recommendation/enum/water-source.enum';
import { Establishment } from 'src/app/recommendation/enum/establishment.enum';
import { ProvinceModel } from 'src/app/location/models';

describe('Previous Yield Service', () => {

let service: PreviousYieldService;
beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(PreviousYieldService)
})

it('Previous Yield Should Be 3.97', () => {
    const irrigation = WaterSource.IRRIGATED;
    const sowingDate = new Date('2020-06-09');
    const growthDuration = 2;
    const cropEstablishment = Establishment.MANUAL;
    const noOfCrops = 2;
    const provinceQuarterYield: ProvinceModel = {
        id: 26,
        label: "Quezon",
        regionId: 26,
        cornAvg: 1.7,
        irrigated1stq: 3.64,
        irrigated2ndq: 3.61,
        irrigated3rdq: 3.89,
        irrigated4thq: 3.67,
        irrigatedDry: 3.7,
        irrigatedWet: 3.7,
        rainfed1stq: 2.62,
        rainfed2ndq: 2.49,
        rainfed3rdq: 2.97,
        rainfed4thq: 2.74,
        rainfedDry: 2.8,
        rainfedWet: 2.3,
    };
    
    const previousYield = service.computePreviousYield(irrigation, sowingDate, growthDuration, cropEstablishment, noOfCrops, provinceQuarterYield);

    expect(previousYield).toEqual(3.89);
});

});
