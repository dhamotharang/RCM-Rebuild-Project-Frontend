import { Component, OnInit, Input } from '@angular/core';
import { TimingAndFertilizerSourcesModel } from 'src/app/recommendation/model/timing-and-fertilizer-sources-model';
import { FieldInfoRecommendationModel } from 'src/app/recommendation/model/field-info-recommendation.model';
import { EARLY_SEEDLING_AGE_LABEL, MIDDLE_SEEDLING_AGE, MIDDLE_SEEDLING_AGE_LABEL, LATE_SEEDLING_AGE_LABEL } from 'src/app/recommendation/constant/seedling-age.constant';
import { CAPITALIZE_DAYS_AFTER_SOWING, CAPITALIZE_DAYS_AFTER_EMERGENCE, CAPITALIZE_DAYS_AFTER_TRANSPLANTING } from 'src/app/recommendation/constant/label-days-after-crop-establishment.constant';

@Component({
  selector: 'app-fertilizer-resources-output',
  templateUrl: './fertilizer-resources-output.component.html',
  styleUrls: ['./fertilizer-resources-output.component.scss'],
})
export class FertilizerResourcesOutputComponent implements OnInit {

  public daysAfterLabel = '';
  public seedlingAgeOutputTableLabel = '';

  private _dialect;
  @Input() public set dialectSelected(dialect: string) {
    this._dialect = dialect;
  }
  public get dialectSelected() {
    return this._dialect;
  }

  private _fertilizerRecommendationModel;
  @Input() public set fertilizerRecommendationModel(fertilizerRecommendationModel: TimingAndFertilizerSourcesModel) {
    this._fertilizerRecommendationModel = fertilizerRecommendationModel;
    if(fertilizerRecommendationModel) {
      this.daysAfterLabel = this.getDaysAfterLabel();
      this.seedlingAgeOutputTableLabel = this.getSeedlingAgeOutputTableLabel();
    }
  }
  public get fertilizerRecommendationModel() {
    return this._fertilizerRecommendationModel;
  }

  private _fieldInfoRecommendation;
  @Input() public set fieldInfoRecommendation(fieldInfoRecommendation: FieldInfoRecommendationModel) {
    this._fieldInfoRecommendation = fieldInfoRecommendation;

  }
  public get fieldInfoRecommendation() {
    return this._fieldInfoRecommendation;
  }

  public getDaysAfterLabel(): 'SOWING'|'EMERGENCE'|'TRANSPLANTING' {
    const daysAfterLabel = this.fertilizerRecommendationModel.daysAfterLabel;
    switch(daysAfterLabel) {
      case CAPITALIZE_DAYS_AFTER_SOWING:
        return 'SOWING';
      case CAPITALIZE_DAYS_AFTER_EMERGENCE:
        return 'EMERGENCE';
      case CAPITALIZE_DAYS_AFTER_TRANSPLANTING:
        return 'TRANSPLANTING';
    }
  }

  public getSeedlingAgeOutputTableLabel(): 'EARLY_SEEDLING_AGE'|'MIDDLE_SEEDLING_AGE'|'LATE_SEEDLING_AGE' {
    const seedlingAgeOutputTableLabel = this.fertilizerRecommendationModel.seedlingAgeOutputTableLabel;
    switch(seedlingAgeOutputTableLabel) {
      case EARLY_SEEDLING_AGE_LABEL + ' seedling':
        return 'EARLY_SEEDLING_AGE';
      case MIDDLE_SEEDLING_AGE_LABEL + ' seedling':
        return 'MIDDLE_SEEDLING_AGE';
      case LATE_SEEDLING_AGE_LABEL + ' seedling':
        return 'LATE_SEEDLING_AGE';
    }
  }

  constructor() { }

  ngOnInit() { }

}
