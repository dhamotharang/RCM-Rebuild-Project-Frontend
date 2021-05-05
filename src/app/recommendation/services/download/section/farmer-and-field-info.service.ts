import { Injectable } from '@angular/core';
import { RecommendationSummary } from "src/app/recommendation/model/translation.model";

@Injectable({
  providedIn: 'root'
})
export class FarmerAndFieldInfoService {

  public farmersNameLabel: string;
  public farmersLotNameLabel: string;
  public farmersLotLocationLabel: string;
  public dateGeneratedLabel: string;
  public waterRegimeLabel: string;
  public cropEstablishmentLabel: string;
  public varietyLabel: string;
  public sowingDateLabel: string;

  constructor() { }

  public setLanguage(dialectTranslation: { RECOMMENDATION_SUMMARY: RecommendationSummary; }) {
    let recommendationSummaryDialect = dialectTranslation.RECOMMENDATION_SUMMARY;

    this.farmersNameLabel = recommendationSummaryDialect.FARMER_NAME;
    this.farmersLotNameLabel = recommendationSummaryDialect.FARM_LOT_NAME;
    this.farmersLotLocationLabel = recommendationSummaryDialect.FARM_LOT_LOCATION;
    this.dateGeneratedLabel = recommendationSummaryDialect.DATE_GENERATED;
    this.waterRegimeLabel = recommendationSummaryDialect.WATER_REGIME;
    this.cropEstablishmentLabel = recommendationSummaryDialect.CROP_ESTABLISHMENT;
    this.varietyLabel = recommendationSummaryDialect.VARIETY;
    this.sowingDateLabel = recommendationSummaryDialect.SOWING_DATE;
  }

  public pdfFormattedFarmerFieldInfo(
    farmerName: string,
    farmLotName: string,
    farmLotLocation: string,
    dateGenerated: string,
    waterRegime: string,
    cropEstablishment: string,
    variety: string,
    sowingDate: string
  ){
    return {
      'columns': [
        {
          'width': '50%',
          'text': this.farmersNameLabel + ': ' + farmerName + "\n" +
            this.farmersLotNameLabel + ': ' + farmLotName + "\n" +
            this.farmersLotLocationLabel + ': ' + farmLotLocation.replace(/<[^>]+>/g, '')
        },
        {
          'width': '50%',
          'text': this.dateGeneratedLabel + ': ' + dateGenerated + "\n" +
            this.waterRegimeLabel + ': ' + waterRegime + "\n" +
            this.cropEstablishmentLabel + ': ' + cropEstablishment + "\n" +
            this.varietyLabel + ': ' + variety + "\n" +
            this.sowingDateLabel + ': ' + sowingDate
        },
      ]
    };
  }

}
