import { TestBed } from '@angular/core/testing';

import { OrganicFertilizerInputService } from './organic-fertilizer-input.service';

describe('OrganicFertilizerInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let organicFertilizerInputService: OrganicFertilizerInputService;

  beforeEach(() => {
    organicFertilizerInputService = TestBed.get(OrganicFertilizerInputService);
  });

  it('OrganicFertilizerInputService be created', () => {
    expect(organicFertilizerInputService).toBeTruthy();
  });

  it('calculate nutrient amounts from applied organic fertilizer per ha', () => {
    const value = organicFertilizerInputService.calculateNutrientAmountFromAppliedOrganicFertilizer(
      25, // number of bags
      50, // weight of bag
      4 // farm lot size
    );

    expect(value.organicNRate).toBe(10);
    expect(value.organicPRate).toBe(5.874999999999999);
    expect(value.organicKRate).toBe(15);

  });

});
