import { Injectable } from '@angular/core';
import { SeasonService } from './season.service';
import { PreviousCrop } from '../../enum/previous-crop.enum';
import { SoilFertility } from '../../enum/soil-fertility.enum';
import { Season } from '../../enum/season.enum';
import { WaterSource } from '../../enum/water-source.enum';
import { LocationService } from 'src/app/core/services/location.service';


@Injectable({
  providedIn: 'root',
})
export class SoilFertilityService {
  constructor(
    private seasonSvc: SeasonService,
    private locationService: LocationService
  ) {}

  async computeSoilFertility(
    noOfCrops: number,
    sowingDate: Date,
    previousCrop: PreviousCrop,
    irrigation: WaterSource,
    municipalityId: number,
  ): Promise<SoilFertility> {
    const municipality = await this.locationService.getMunicipalityById(
      municipalityId,
    );

    const season = this.seasonSvc.computeSeason(sowingDate);

    let soilFertility = SoilFertility.STANDARD;

    if (municipality && municipality.soilFertility !== 0) {
      soilFertility = municipality.soilFertility;
    }

    if (noOfCrops === 1 && season === Season.DRY) {
      soilFertility = SoilFertility.FALLOW;
    }

    if (
      noOfCrops === 1 &&
      season === Season.DRY &&
      previousCrop === PreviousCrop.CORN
    ) {
      soilFertility = SoilFertility.HIGH;
    }

    if (
      noOfCrops === 1 &&
      season === Season.DRY &&
      irrigation === WaterSource.RAINFED
    ) {
      soilFertility = SoilFertility.HIGH;
    }

    if (
      noOfCrops === 1 &&
      season === Season.DRY &&
      irrigation === WaterSource.IRRIGATED &&
      previousCrop !== PreviousCrop.CORN
    ) {
      soilFertility = SoilFertility.FALLOW;
    }

    if (
      previousCrop === PreviousCrop.TOMATO ||
      previousCrop === PreviousCrop.TOBACCO
    ) {
      soilFertility = SoilFertility.STANDARD;
    }

    if (previousCrop === PreviousCrop.BELL_PEPPER_OR_EGGPLANT) {
      soilFertility = SoilFertility.HIGH;
    }

    return soilFertility;
  }
}
