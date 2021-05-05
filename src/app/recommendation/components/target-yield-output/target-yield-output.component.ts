import { Component, OnInit, Input } from '@angular/core';
import { TargetYieldModel } from 'src/app/recommendation/model/target-yield.model';
import { FieldInfoRecommendationModel } from 'src/app/recommendation/model/field-info-recommendation.model';

@Component({
  selector: 'app-target-yield-output',
  templateUrl: './target-yield-output.component.html',
  styleUrls: ['./target-yield-output.component.scss'],
})
export class TargetYieldOutputComponent implements OnInit {

  private _dialect;
  @Input() public set dialectSelected(dialect: string) {
    this._dialect = dialect;
  }
  public get dialectSelected() {
    return this._dialect;
  }

  private _targetYield;
  @Input() public set targetYield(targetYield: TargetYieldModel) {
    this._targetYield = targetYield;

  }
  public get targetYield() {
    return this._targetYield;
  }

  private _fieldInfoRecommendation;
  @Input() public set fieldInfoRecommendation(fieldInfoRecommendation: FieldInfoRecommendationModel) {
    this._fieldInfoRecommendation = fieldInfoRecommendation;

  }
  public get fieldInfoRecommendation() {
    return this._fieldInfoRecommendation;
  } 


  constructor(
  ) { }

  ngOnInit() { }

}
