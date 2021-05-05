import { TestBed } from '@angular/core/testing';

import { GrowthDurationService } from './growth-duration.service';

describe('GrowthDurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let service: GrowthDurationService;

  beforeEach(() => {
    service = TestBed.get(GrowthDurationService);
  });

  it('GrowthDurationService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('SET A: 3 splits, irrigated', () => {

    let value = service.computeGD(
      1, //cropEstablishment Manual transplanting
      1, //growthDuration 101-110 days
      1, //seedlingAge 10-14 days
      true, //activeTillering 3 splits
      2, //irrigation irrigated ecosystem
    );

    expect(value['earlyLow']).toBe('Basal');
    expect(value['earlyHigh']).toBe(10);

    expect(value['activeTilleringLow']).toBe(20);
    expect(value['activeTilleringHigh']).toBe(24);
    
    expect(value['panicleInitiationLow']).toBe(34);
    expect(value['panicleInitiationHigh']).toBe(38);

    expect(value['headingLow']).toBe(58);
    expect(value['headingHigh']).toBe(64);

    expect(value['harvestLow']).toBe(87);
    expect(value['harvestHigh']).toBe(96);
  });

  it('SET B: 2 splits', () => {

    let value = service.computeGD(
      1, //cropEstablishment Manual transplanting
      1, //growthDuration 101-110 days
      1, //seedlingAge 10-14 days
      false, //activeTillering 2 splits
      2, //irrigation irrigated ecosystem
    );

    expect(value['earlyLow']).toBe('Basal');
    expect(value['earlyHigh']).toBe(10);

    expect(value['activeTilleringLow']).toBe(null);
    expect(value['activeTilleringHigh']).toBe(null);
    
    expect(value['panicleInitiationLow']).toBe(32);
    expect(value['panicleInitiationHigh']).toBe(36);

    expect(value['headingLow']).toBe(58);
    expect(value['headingHigh']).toBe(64);

    expect(value['harvestLow']).toBe(87);
    expect(value['harvestHigh']).toBe(96);
  });

  it('SET C: 3 splits, rainfed', () => {

    let value = service.computeGD(
      1, //cropEstablishment Manual transplanting
      1, //growthDuration 101-110 days
      3, //seedlingAge >= 23 days
      true, //activeTillering 3 splits
      3, //irrigation rainfed ecosystem
    );

    expect(value['earlyLow']).toBe('Basal');
    expect(value['earlyHigh']).toBe(5);

    expect(value['activeTilleringLow']).toBe(14);
    expect(value['activeTilleringHigh']).toBe(20);
    
    expect(value['panicleInitiationLow']).toBe(26);
    expect(value['panicleInitiationHigh']).toBe(32);

    expect(value['headingLow']).toBe(50);
    expect(value['headingHigh']).toBe(56);

    expect(value['harvestLow']).toBe(79);
    expect(value['harvestHigh']).toBe(88);
  });

});