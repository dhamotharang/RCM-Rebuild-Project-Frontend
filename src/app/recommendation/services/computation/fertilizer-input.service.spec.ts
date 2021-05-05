import { TestBed } from '@angular/core/testing';

import { FertilizerInputService } from './fertilizer-input.service';

describe('FertilizerInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let service: FertilizerInputService;

  beforeEach(() => {
    service = TestBed.get(FertilizerInputService);
  });

  it('FertilizerInputService be created', () => {
    expect(service).toBeTruthy();
  });

  it('Fertilizer Recommendation Model', () => {
    let value = service.compute(
      27.5909814, // P rate
      26, // K rate
      20, // N Early
      37.5, // N Active Tillering
      37.4375, // N Panicle Initiatino
      20, // N Heading
      false, // use of ammosul
      1.4567, // field size
      7.5, // gy14 = target yield?
      2 // variety_type
    );

    expect(value.growthStages[0].growthStageName).toBe('Early');
    expect(value.growthStages[0].fertilizerSources[0].fertilizerSource).toBe('14-14-14 with sulfur');
    expect(value.growthStages[0].fertilizerSources[0].fertilizerAmount).toBe(287.08);

    expect(value.growthStages[1].growthStageName).toBe('Active Tillering');
    expect(value.growthStages[1].fertilizerSources[0].fertilizerSource).toBe('Urea (46-0-0)');
    expect(value.growthStages[1].fertilizerSources[0].fertilizerAmount).toBe(94.71);

    expect(value.growthStages[2].growthStageName).toBe('Panicle Initiation');
    expect(value.growthStages[2].fertilizerSources[0].fertilizerSource).toBe('Urea (46-0-0)');
    expect(value.growthStages[2].fertilizerSources[0].fertilizerAmount).toBe(118.55);

    expect(value.growthStages[3].growthStageName).toBe('Heading');
    expect(value.growthStages[3].fertilizerSources[0].fertilizerSource).toBe('Urea (46-0-0)');
    expect(value.growthStages[3].fertilizerSources[0].fertilizerAmount).toBe(63.33);
  });

});
