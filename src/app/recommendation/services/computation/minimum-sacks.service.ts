import { Injectable } from '@angular/core';
import { MoistureContentInitial } from '../../enum/moisture-content-initial.enum';
import { MoistureContentFinal } from '../../enum/moisture-content-final.enum';
import { decimalPlaceRound, decimalRoundToNearest5 } from '../../../v2/helpers/round-decimal.helper';
import { A_TONNE } from '../../constant/field-unit.constant';
import { RoundUpPipe } from 'src/app/recommendation/pipe/round-up.pipe';

@Injectable({
  providedIn: 'root'
})
export class MinimumSacksService {

  private minSacks: number;
  constructor(
    private roundUp: RoundUpPipe
  ) { }

  minimumSackCompute(dryWeight: number, fieldSizeHectare: number, weightOfSack: number) {
    return ((dryWeight * A_TONNE * fieldSizeHectare) / ((weightOfSack * MoistureContentInitial.value) / MoistureContentFinal.value));
  }
  setMinimumSacks(dryWeight: number, fieldSizeHectare: number, weightOfSack: number) {

    const minimumSacks = this.minimumSackCompute(dryWeight, fieldSizeHectare, weightOfSack)

    this.minSacks = decimalPlaceRound(minimumSacks, 2);

    if (fieldSizeHectare >= 1) {
      this.minSacks = this.minimumSackCompute(decimalPlaceRound(dryWeight, 1), fieldSizeHectare, weightOfSack)

      if (Math.round(this.minSacks) > 9) {
        this.minSacks = Math.round(this.minSacks);
      } else {
        this.minSacks = decimalRoundToNearest5(this.minSacks);
      }
    }
  }

  getMinimumSacks() {
    return this.roundUp.transform(this.minSacks);
  }
}
