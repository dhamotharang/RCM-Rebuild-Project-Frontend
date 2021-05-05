import { TestBed } from '@angular/core/testing';

import { NRateService } from './n-rate.service';
import { OrganicFertilizerInputService } from './organic-fertilizer-input.service';
import { OrganicFertilizerRateModel } from '../../model/organic-fertilizer-rate.model';

describe('NRateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let service: NRateService;
  let organicFertService: OrganicFertilizerInputService;

  beforeEach(() => {
    service = TestBed.get(NRateService);
    organicFertService = TestBed.get(OrganicFertilizerInputService);
  });

  it('NRateService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('SET A: Standard, Wet Seeding, Inbred, Yes organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        4 //farm lot size
      );
    }

    const value = service.computeNRate(
      2, //soilFertility
      6, //targetYield
      0, //growthDuration
      2, //cropEstablishment
      1, //varietyType
      0, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(20);
    expect(value['nActiveTillering']).toBe(45.3);
    expect(value['nPanicleInitiation']).toBe(45.32499999999999);
    expect(value['nHeading']).toBe(0);
  });

  it('SET A: Standard, Wet Seeding, Inbred, No organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = false;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        0, //numberOfBags
        0, //weightOfBag
        0 //farm lot size
      );
    }
    const value = service.computeNRate(
      2, //soilFertility
      6, //targetYield
      0, //growthDuration
      2, //cropEstablishment
      1, //varietyType
      0, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(30);
    expect(value['nActiveTillering']).toBe(45.3);
    expect(value['nPanicleInitiation']).toBe(45.32499999999999);
    expect(value['nHeading']).toBe(0);
  });

  it('SET A: Standard, Wet Seeding, Hybrid, Yes organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        4 //farm lot size
      );
    }

    let value = service.computeNRate(
      2, //soilFertility
      7, //targetYield
      0, //growthDuration
      2, //cropEstablishment
      2, //varietyType
      0, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(30);
    expect(value['nActiveTillering']).toBe(53.2);
    expect(value['nPanicleInitiation']).toBe(53.112500000000054);
    expect(value['nHeading']).toBe(0);
  });

  it('SET A: Standard, Wet Seeding, Hybrid, No organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = false;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        0, //numberOfBags
        0, //weightOfBag
        0 //farm lot size
      );
    }

    let value = service.computeNRate(
      2, //soilFertility
      7, //targetYield
      0, //growthDuration
      2, //cropEstablishment
      2, //varietyType
      0, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(40);
    expect(value['nActiveTillering']).toBe(53.2);
    expect(value['nPanicleInitiation']).toBe(53.112500000000054);
    expect(value['nHeading']).toBe(0);
  });

  it('SET A: High, Wet Seeding, Inbred, Yes organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        4 //farm lot size
      );
    }

    let value = service.computeNRate(
      1, //soilFertility
      5, //targetYield
      0, //growthDuration
      2, //cropEstablishment
      1, //varietyType
      0, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(10);
    expect(value['nActiveTillering']).toBe(26);
    expect(value['nPanicleInitiation']).toBe(25.937500000000014);
    expect(value['nHeading']).toBe(0);
  });

  it('SET A: High, Wet Seeding, Inbred, No organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = false;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        0, //numberOfBags
        0, //weightOfBag
        0 //farm lot size
      );
    }

    let value = service.computeNRate(
      1, //soilFertility
      5, //targetYield
      0, //growthDuration
      2, //cropEstablishment
      1, //varietyType
      0, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(20);
    expect(value['nActiveTillering']).toBe(26);
    expect(value['nPanicleInitiation']).toBe(25.937500000000014);
    expect(value['nHeading']).toBe(0);
  });

  it('SET A: High, Wet Seeding, Hybrid, Yes organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        4 //farm lot size
      );
    }

    let value = service.computeNRate(
      1, //soilFertility
      5, //targetYield
      0, //growthDuration
      2, //cropEstablishment
      2, //varietyType
      0, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(10);
    expect(value['nActiveTillering']).toBe(26);
    expect(value['nPanicleInitiation']).toBe(25.937500000000014);
    expect(value['nHeading']).toBe(0);
  });

  it('SET A: High, Wet Seeding, Hybrid, No organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = false;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        0, //numberOfBags
        0, //weightOfBag
        0 //farm lot size
      );
    }

    let value = service.computeNRate(
      1, //soilFertility
      5, //targetYield
      0, //growthDuration
      2, //cropEstablishment
      2, //varietyType
      0, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(20);
    expect(value['nActiveTillering']).toBe(26);
    expect(value['nPanicleInitiation']).toBe(25.937500000000014);
    expect(value['nHeading']).toBe(0);
  });

  it('SET A: Fallow wet, Wet Seeding, Inbred, Yes organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        5 //farm lot size
      );
    }

    let value = service.computeNRate(
      3, //soilFertility
      5, //targetYield
      0, //growthDuration
      2, //cropEstablishment
      1, //varietyType
      0, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(0);
    expect(value['nActiveTillering']).toBe(0);
    expect(value['nPanicleInitiation']).toBe(35.937500000000014);
    expect(value['nHeading']).toBe(0);
  });

  it('SET A: Fallow wet, Wet Seeding, Hybrid', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        5 //farm lot size
      );
    }

    let value = service.computeNRate(
      3, //soilFertility
      4, //targetYield
      0, //growthDuration
      2, //cropEstablishment
      2, //varietyType
      0, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(0);
    expect(value['nActiveTillering']).toBe(0);
    expect(value['nPanicleInitiation']).toBe(24.25);
    expect(value['nHeading']).toBe(0);
  });

  it('SET B: Standard, Short duration, Manual transplanting, 10-14 days, Yes org fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        5 //farm lot size
      );
    }

    let value = service.computeNRate(
      2, //soilFertility
      3.5, //targetYield
      1, //growthDuration
      1, //cropEstablishment
      2, //varietyType
      1, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(10);
    expect(value['nActiveTillering']).toBe(0);
    expect(value['nPanicleInitiation']).toBe(39.50625000000002);
    expect(value['nHeading']).toBe(0);
  });

  it('SET B: Standard, Short duration, Manual transplanting, >= 23 days', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = false;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        5 //farm lot size
      );
    }

    let value = service.computeNRate(
      2, //soilFertility
      3.5, //targetYield
      1, //growthDuration
      1, //cropEstablishment
      2, //varietyType
      3, //seedlingAge
      organicFertilizer
    );

    expect(value['nEarly']).toBe(28.2);
    expect(value['nActiveTillering']).toBe(0);
    expect(value['nPanicleInitiation']).toBe(28.206250000000022);
    expect(value['nHeading']).toBe(0);
  });

  it('SET B: High, short duration, Manual transplanting, 15-22 days, No organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = false;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        0, //numberOfBags
        0, //weightOfBag
        0 //farm lot size
      );
    }

    let value = service.computeNRate(
      1, //soilFertility
      3.5, //targetYield
      1, //growthDuration
      1, //cropEstablishment
      2, //varietyType
      2, //seedlingAge
      organicFertilizer
    )

    expect(value['nEarly']).toBe(10);
    expect(value['nActiveTillering']).toBe(0);
    expect(value['nPanicleInitiation']).toBe(23.40625000000002);
    expect(value['nHeading']).toBe(0);
  });

  it('SET B: High, short duration, Manual transplanting, >= 23 days, Yes organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        4 //farm lot size
      );
    }

    let value = service.computeNRate(
      1, //soilFertility
      3.5, //targetYield
      1, //growthDuration
      1, //cropEstablishment
      2, //varietyType
      3, //seedlingAge
      organicFertilizer
    )

    expect(value['nEarly']).toBe(10);
    expect(value['nActiveTillering']).toBe(0);
    expect(value['nPanicleInitiation']).toBe(16.706250000000022);
    expect(value['nHeading']).toBe(0);
  });

  it('SET B: Fallow wet, short duration, Manual transplanting, 15-22 days, Yes organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        4 //farm lot size
      );
    }

    let value = service.computeNRate(
      3, //soilFertility
      3.2, //targetYield
      1, //growthDuration
      1, //cropEstablishment
      2, //varietyType
      2, //seedlingAge
      organicFertilizer
    )

    expect(value['nEarly']).toBe(0);
    expect(value['nActiveTillering']).toBe(0);
    expect(value['nPanicleInitiation']).toBe(0);
    expect(value['nHeading']).toBe(0);
  });

  it('SET B: Fallow wet, long duration, Manual transplanting, >= 23 days, Yes organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        4 //farm lot size
      );
    }

    let value = service.computeNRate(
      3, //soilFertility
      3.5, //targetYield
      1, //growthDuration
      1, //cropEstablishment
      2, //varietyType
      3, //seedlingAge
      organicFertilizer
    )

    expect(value['nEarly']).toBe(0);
    expect(value['nActiveTillering']).toBe(0);
    expect(value['nPanicleInitiation']).toBe(10);
    expect(value['nHeading']).toBe(0);
  });

});
