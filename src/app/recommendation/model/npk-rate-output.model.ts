import { KSplitModel } from './k-split.model';
import { NRateModel } from './n-rate.model';

export class NPKRateOutputModel {
  constructor (
    public nRateModel: NRateModel,
    public totalNRate: number,
    public totalPRate: number,
    public totalKRate: number,
    public kSplit: KSplitModel,
    public showNPKRate: boolean
  ) {}
}
