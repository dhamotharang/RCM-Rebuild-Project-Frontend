import { Component, OnInit, Input } from '@angular/core';
import { FarmingRecommendationPracticesOutputModel } from 'src/app/recommendation/model/farming-recommendation-practices-output.model';
import { FertilizerDelay } from 'src/app/recommendation/enum/fertilizer-delay.enum';
import { QualitySeeds } from 'src/app/recommendation/enum/quality-seeds.enum';

@Component({
  selector: 'app-other-crop-management-output',
  templateUrl: './other-crop-management-output.component.html',
  styleUrls: ['./other-crop-management-output.component.scss'],
})
export class OtherCropManagementOutputComponent implements OnInit {

  private _dialect;
  @Input() public set dialectSelected(dialect: string) {
    this._dialect = dialect;
  }
  public get dialectSelected() {
    return this._dialect;
  }

  @Input() cropEstablishment: string;
  @Input() activeTilleringHighDisplay: number;
  @Input() panicleInitiationLowDisplay: number;
  @Input() panicleInitiationHighDisplay: number;
  @Input() selectedFarmsize: number;

  private _farmingPractices: FarmingRecommendationPracticesOutputModel;
  @Input() public set farmingPractices(value: FarmingRecommendationPracticesOutputModel) {
    this._farmingPractices = value;
  }

  public get farmingPractices(): FarmingRecommendationPracticesOutputModel {
    return this._farmingPractices;
  }

  public fertilizerDelay = FertilizerDelay;
  public qualitySeedsValue = QualitySeeds;
  constructor() { }

  public get qualitySeedsLowerLimit() {
    if (this.farmingPractices) {
      return this.farmingPractices.qualitySeedsLowerLimit;
    }
  }

  public get qualitySeedsUpperLimit() {
    if (this.farmingPractices) {
      return this.farmingPractices.qualitySeedsUpperLimit;
    }
  }


  ngOnInit() { }

}
