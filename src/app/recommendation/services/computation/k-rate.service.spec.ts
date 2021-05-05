import { TestBed } from '@angular/core/testing';

import { KRateService } from './k-rate.service';
import { WaterSource } from '../../enum/water-source.enum';
import { Season } from '../../enum/season.enum';

describe('KRateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let kRateService: KRateService;

  beforeEach(() => {
    kRateService = TestBed.get(KRateService);
  });

  it('kRateService be created', () => {
    expect(kRateService).toBeTruthy();
  });

  it('target yield multiplier', () => {
    const value = kRateService.getTargetYieldMultiplier(
      1, // soil fertility
      1 // straw
    );
    expect(value).toBeTruthy(0.12);
  });

  it('compute yield gain k2O rate', () => {
    const value = kRateService.calculateYieldGainK2ORate(
      3, // target yield
      1, // soil fertility
      1, // straw
    );

    expect(value).toBe(16); // raw value = 15.709090909090909
  });

  it('compute k2O from crop residue SET A & B', () => {
    const setA = kRateService.calculateK2OFromCropResidue(
      3, // target yield
      6, // previous yield
      1, // straw (manual - 50%)
      1, // previous crop (rice)
    );

    const setB = kRateService.calculateK2OFromCropResidue(
      3, // target yield
      6, // previous yield
      3, // straw (combine - 100%)
      1, // previous crop (rice)
    );

    expect(setA).toBe(49); // raw value = 48.959999999999994
    expect(setB).toBe(98); // raw value = 97.91999999999999
  });

  it('compute k2O from crop residue SET C & D', () => {
    const setC = kRateService.calculateK2OFromCropResidue(
      3, // target yield
      0, // previous yield (0 / NA)
      0, // straw (0 / NA)
      2, // previous crop (corn)
    );

    const setD = kRateService.calculateK2OFromCropResidue(
      3, // target yield
      0, // previous yield
      0, // straw (combine - 100%)
      3, // previous crop (legume)
    );

    expect(setC).toBe(40); // raw value = 40
    expect(setD).toBe(24); // raw value = 24.479999999999997
  });

});

describe('KRateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let kRateService: KRateService;

  beforeEach(() => {
    kRateService = TestBed.get(KRateService);
  });

  it('kRateService be created', () => {
    expect(kRateService).toBeTruthy();
  });

  it('target yield multiplier', () => {
    const value = kRateService.getTargetYieldMultiplier(
      1, // soil fertility
      1 // straw
    );
    expect(value).toBeTruthy(0.12);
  });

  it('compute yield gain k2O rate', () => {
    const value = kRateService.calculateYieldGainK2ORate(
      3, // target yield
      1, // soil fertility
      1, // straw
    );

    expect(value).toBe(16); // raw value = 15.709090909090909
  });

  it('compute k2O from crop residue SET A & B', () => {
    const setA = kRateService.calculateK2OFromCropResidue(
      3, // target yield
      6, // previous yield
      1, // straw (manual - 50%)
      1, // previous crop (rice)
    );

    const setB = kRateService.calculateK2OFromCropResidue(
      3, // target yield
      6, // previous yield
      3, // straw (combine - 100%)
      1, // previous crop (rice)
    );

    expect(setA).toBe(49); // raw value = 48.959999999999994
    expect(setB).toBe(98); // raw value = 97.91999999999999
  });

  it('compute k2O from crop residue SET C & D', () => {
    const setC = kRateService.calculateK2OFromCropResidue(
      3, // target yield
      0, // previous yield (0 / NA)
      0, // straw (0 / NA)
      2, // previous crop (corn)
    );

    const setD = kRateService.calculateK2OFromCropResidue(
      3, // target yield
      0, // previous yield
      0, // straw (combine - 100%)
      3, // previous crop (legume)
    );

    expect(setC).toBe(40); // raw value = 40
    expect(setD).toBe(24); // raw value = 24.479999999999997
  });

  it('compute k2O from water irrigation', () => {
    const set25 = kRateService.calculateK2OFromWaterIrrigation(
      WaterSource.IRRIGATED, // water source = irrigated
      new Date('4/1/2020'), // season = WET
    );
    const set10 = kRateService.calculateK2OFromWaterIrrigation(
      WaterSource.IRRIGATED, // water source = irrigated
      new Date('5/1/2020'), // season = DRY
    );
    const set0 = kRateService.calculateK2OFromWaterIrrigation(
      WaterSource.RAINFED, // water source = rainfed
      new Date('5/1/2020'), // season = WET
    );
    expect(set25).toBe(25);
    expect(set10).toBe(10);
    expect(set0).toBe(0);
  });

});
