import { TestBed } from '@angular/core/testing';

import { TargetYieldService } from './target-yield.service';
import { Season } from '../enum/season.enum';
import { WaterSource } from '../enum/water-source.enum';
import { VarietyType } from '../enum/variety-type.enum';
import { Establishment } from '../enum/establishment.enum';

describe('TargetYieldService', () => {
  let service: TargetYieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.get(TargetYieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Seed rate should be equal to 50 kg/ha', () => {
    let kilogram = 100;
    let fieldSizeHectare = 2;
    let seedRate = service.computeSeedRate(kilogram, fieldSizeHectare);
    expect(seedRate).toEqual(50);
  });

  it('Reported Yield Should be 2.5 t/ha', () => {
    let noOfSacks = 100;
    let weightOfSack = 50;
    let fieldSizeHectare = 2;
    let reportedYield = service.computeReportYield(noOfSacks, weightOfSack, fieldSizeHectare);
    expect(reportedYield).toEqual(2.5);
  });

  it('Max Reported Yield Should be 12.5 t/ha for DRY Season, IRRIGATED and HYBRID', () => {
    let season = Season.DRY;
    let waterSource = WaterSource.IRRIGATED;
    let varietyType = VarietyType.HYBRID;

    let maxReportedYield = service.computeMaxReportYield(season, waterSource, varietyType);
    expect(maxReportedYield).toEqual(12.5);
  });

  it('Max Reported Yield Should be 11 t/ha for DRY Season, IRRIGATED and INBRED', () => {
    let season = Season.DRY;
    let waterSource = WaterSource.IRRIGATED;
    let varietyType = VarietyType.INBRED;

    let maxReportedYield = service.computeMaxReportYield(season, waterSource, varietyType);
    expect(maxReportedYield).toEqual(11);
  });

  it('Max Reported Yield Should be 11 t/ha for DRY Season, RAINFED and HYBRID', () => {
    let season = Season.DRY;
    let waterSource = WaterSource.RAINFED;
    let varietyType = VarietyType.HYBRID;

    let maxReportedYield = service.computeMaxReportYield(season, waterSource, varietyType);
    expect(maxReportedYield).toEqual(11);
  });

  it('Max Reported Yield Should be 9.5 t/ha for DRY Season, RAINFED and INBRED', () => {
    let season = Season.DRY;
    let waterSource = WaterSource.RAINFED;
    let varietyType = VarietyType.INBRED;

    let maxReportedYield = service.computeMaxReportYield(season, waterSource, varietyType);
    expect(maxReportedYield).toEqual(9.5);
  });







  it('Max Reported Yield Should be 13 t/ha for Wet Season, IRRIGATED and HYBRID', () => {
    let season = Season.WET;
    let waterSource = WaterSource.IRRIGATED;
    let varietyType = VarietyType.HYBRID;

    let maxReportedYield = service.computeMaxReportYield(season, waterSource, varietyType);
    expect(maxReportedYield).toEqual(13);
  });

  it('Max Reported Yield Should be 11.5 t/ha for Wet Season, IRRIGATED and INBRED', () => {
    let season = Season.WET;
    let waterSource = WaterSource.IRRIGATED;
    let varietyType = VarietyType.INBRED;

    let maxReportedYield = service.computeMaxReportYield(season, waterSource, varietyType);
    expect(maxReportedYield).toEqual(11.5);
  });

  it('Max Reported Yield Should be 11.5 t/ha for Wet Season, RAINFED and HYBRID', () => {
    let season = Season.WET;
    let waterSource = WaterSource.RAINFED
    let varietyType = VarietyType.HYBRID;
  
    let maxReportedYield = service.computeMaxReportYield(season, waterSource, varietyType);
    expect(maxReportedYield).toEqual(11.5);
  });

  it('Max Reported Yield Should be 10 t/ha for Wet Season, RAINFED and INBRED', () => {
    let season = Season.WET;
    let waterSource = WaterSource.RAINFED
    let varietyType = VarietyType.INBRED;

    let maxReportedYield = service.computeMaxReportYield(season, waterSource, varietyType);
    expect(maxReportedYield).toEqual(10);
  });

  it('Farmer Normal Yield Should be 2.238372093023256 t/ha 14% mc', () => {
    let noOfSacks = 100;
    let weightOfSack = 50;
    let fieldSizeHectare = 2;
    let farmerNormalYield = service.computeFarmerNormalYield(noOfSacks, weightOfSack, fieldSizeHectare);
    expect(farmerNormalYield).toEqual(2.238372093023256);
  });

  //September 23, 2020 = 105 days
  it('Estimated Harvest Month Should be September for Sowing Date of June 10, 2020, Growth Duration 1, Manual and Mechanical', () => {
    let sowingDate = new Date('2020-06-10');
    let growthDuration = 1;
    let establishment = Establishment.MANUAL;
    let estimatedHarvestMonth = service.estimateHarvestMonth(sowingDate, growthDuration, establishment);
    expect(estimatedHarvestMonth).toEqual('SEPTEMBER');

    let establishmentTwo = Establishment.MECHANICAL;
    let estimatedHarvestMonthTwo = service.estimateHarvestMonth(sowingDate, growthDuration, establishmentTwo);
    expect(estimatedHarvestMonthTwo).toEqual('SEPTEMBER');
    
  });

  //October 3, 2020 = 115 days
  it('Estimated Harvest Month Should be October for Sowing Date of June 10, 2020, Growth Duration 2, Manual and Mechanical', () => {
    let sowingDate = new Date('2020-06-10');
    let growthDuration = 2;
    let establishment = Establishment.MANUAL;
    let estimatedHarvestMonth = service.estimateHarvestMonth(sowingDate, growthDuration, establishment);
    expect(estimatedHarvestMonth).toEqual('OCTOBER');

    let establishmentTwo = Establishment.MECHANICAL;
    let estimatedHarvestMonthTwo = service.estimateHarvestMonth(sowingDate, growthDuration, establishmentTwo);
    expect(estimatedHarvestMonthTwo).toEqual('OCTOBER');
  });

  //November 2, 2020 = 125 days
  it('Estimated Harvest Month Should be October for Sowing Date of June 29, 2020, Growth Duration 3, Manual and Mechanical', () => {
    let sowingDate = new Date('2020-06-29');
    let growthDuration = 3;
    let establishment = Establishment.MANUAL;
    let estimatedHarvestMonth = service.estimateHarvestMonth(sowingDate, growthDuration, establishment);
    expect(estimatedHarvestMonth).toEqual('NOVEMBER');

    let establishmentTwo = Establishment.MECHANICAL;
    let estimatedHarvestMonthTwo = service.estimateHarvestMonth(sowingDate, growthDuration, establishmentTwo);
    expect(estimatedHarvestMonthTwo).toEqual('NOVEMBER');
  });

  //September 13, 2020 = 95 days
  it('Estimated Harvest Month Should be September for Sowing Date of June 10, 2020, Growth Duration 1, WET and DRY', () => {
    let sowingDate = new Date('2020-06-10');
    let growthDuration = 1;
    let establishment = Establishment.WET;
    let estimatedHarvestMonth = service.estimateHarvestMonth(sowingDate, growthDuration, establishment);
    expect(estimatedHarvestMonth).toEqual('SEPTEMBER');

    let establishmentTwo = Establishment.DRY;
    let estimatedHarvestMonthTwo = service.estimateHarvestMonth(sowingDate, growthDuration, establishmentTwo);
    expect(estimatedHarvestMonthTwo).toEqual('SEPTEMBER');
    
  });


  //September 23, 2020 = 105 days
  it('Estimated Harvest Month Should be September for Sowing Date of June 10, 2020, Growth Duration 2, WET and DRY', () => {
    let sowingDate = new Date('2020-06-10');
    let growthDuration = 2;
    let establishment = Establishment.WET;
    let estimatedHarvestMonth = service.estimateHarvestMonth(sowingDate, growthDuration, establishment);
    expect(estimatedHarvestMonth).toEqual('SEPTEMBER');

    let establishmentTwo = Establishment.DRY;
    let estimatedHarvestMonthTwo = service.estimateHarvestMonth(sowingDate, growthDuration, establishmentTwo);
    expect(estimatedHarvestMonthTwo).toEqual('SEPTEMBER');
    
  });


  //October 3, 2020 = 115 days
  it('Estimated Harvest Month Should be September for Sowing Date of June 10, 2020, Growth Duration 3, WET and DRY', () => {
    let sowingDate = new Date('2020-06-10');
    let growthDuration = 3;
    let establishment = Establishment.WET;
    let estimatedHarvestMonth = service.estimateHarvestMonth(sowingDate, growthDuration, establishment);
    expect(estimatedHarvestMonth).toEqual('OCTOBER');

    let establishmentTwo = Establishment.DRY;
    let estimatedHarvestMonthTwo = service.estimateHarvestMonth(sowingDate, growthDuration, establishmentTwo);
    expect(estimatedHarvestMonthTwo).toEqual('OCTOBER');
    
  });

});
