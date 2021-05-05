import { TestBed } from '@angular/core/testing';

import { PRateService } from './p-rate.service';
import { PreviousStraw } from 'src/app/recommendation/enum/previous-straw.enum';
import { SoilFertility } from 'src/app/recommendation/enum/soil-fertility.enum';
import { WaterSource } from 'src/app/recommendation/enum/water-source.enum';
import { OrganicFertilizerInputService } from './organic-fertilizer-input.service';
import { OrganicFertilizerRateModel } from '../../model/organic-fertilizer-rate.model';
import { PreviousCrop } from 'src/app/recommendation/enum/previous-crop.enum';

describe('PRateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let pRateService: PRateService;
  let organicFertService: OrganicFertilizerInputService;

  beforeEach(() => {
    pRateService = TestBed.get(PRateService);
    organicFertService = TestBed.get(OrganicFertilizerInputService);
  });

  it('pRateService be created', () => {
    expect(pRateService).toBeTruthy();
  });

  it('get straw percentage', () => {
    const value = pRateService.getStrawPercentageByHarvestType(
      PreviousStraw.COMBINE, // harvestType - combine harvester
      PreviousCrop.RICE // previous crop - 1 rice
    );
    expect(value).toBe(100);
  });

  it('calculate p2o5 crop residue rate', () => {
    const value = pRateService.calculateP2O5CropResidueRate(
      PreviousCrop.RICE, // previous crop - 1 rice
      4.4, // previous yield
      PreviousStraw.COMBINE, // combine harvester
    );

    expect(value).toBe(8.184000000000001);
  });

  it('calculate p2o5 soil reserves rate', () => {
    const value = pRateService.calculateP2O5SoilReservesRate(
      4.4, // targetYield yield
      WaterSource.IRRIGATED, // irrigated
      SoilFertility.FALLOW, // soil fertility fallow wet
    );

    expect(value).toBe(10.314);
  });

  it('calculate targeted p2o5 rate', () => {
    const value = pRateService.calculateTargetedP2O5Rate(
      4.4 // targetYield yield
    );

    expect(value).toBe(27.22896);
  });

  it('calculate total p2o5 rate, Yes organic fert', () => {
    let organicFertilizer: OrganicFertilizerRateModel;
    const isOrganicApplied = true;

    if (isOrganicApplied) {
      organicFertilizer = organicFertService.calculateNutrientAmountFromAppliedOrganicFertilizer(
        25, //numberOfBags
        50, //weightOfBag
        4 //farm lot size
      );
    }

    const value = pRateService.calculateTotalP2O5Rate(
      4.4, //targetYield,
      WaterSource.IRRIGATED, //irrigated,
      SoilFertility.STANDARD, //soilFertility - standard (follows rcm rebuild mapping for sf),
      PreviousCrop.RICE, //previousCrop, 
      4.4, //previousYield,
      PreviousStraw.COMBINE, //harvestType,
      organicFertilizer
    );

    expect(value).toBe(10);
  });

});
