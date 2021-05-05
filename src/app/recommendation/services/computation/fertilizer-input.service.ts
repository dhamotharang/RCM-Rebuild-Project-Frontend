import { Injectable } from '@angular/core';
import { TimingAndFertilizerSourcesModel } from '../../model/timing-and-fertilizer-sources-model';
import { InitGrowthStageFertilizerRecommendationModel } from '../../model/growth-stage-fertilizer-recommendation-model';
import { FertilizerModel } from '../../model/fertilizer-model';
import { InitGrowthDuration } from '../../model/init-growth-duration';
import { FertilizerName } from '../../enum/fertilizer-name.enum';
import { GrowthStages } from '../../enum/growth-stages.enum';

@Injectable({
  providedIn: 'root'
})
export class FertilizerInputService {

  fertN: number = 0.14;
  fertP: number = 0.14;
  fertK: number = 0.14;
  nSource: number = 0.46;
  fertMOP: number = 0.6;
  earlyFertName: string = '14-14-14 with sulfur';


  earlyFert: any = 0;
  earlyUrea: any = 0;
  earlyMop: any = 0;
  activeFert: any = 0;
  pannicleFert: any = 0;
  mopFert: any = 0;
  headFert: any;

  earlyFert_disp: any = 0;
  earlyUrea_disp: any = 0;
  activeFert_disp: any = 0;
  pannicleFert_disp: any = 0;
  mopFert_disp: any = 0;
  mopEarlyFert_disp: any = 0;
  headFert_disp: any;

  constructor() { }

  compute(pRate: number,
    kRate: number,
    nb: number,
    at: number,
    pi: number,
    hd: number,
    useAmmosul: boolean,
    ha: number,
    gy14: number,
    varietyType: number) {

    if (kRate === 0) {
      this.fertN = 0.16;
      this.fertP = 0.2;
      this.fertK = 0;
      this.earlyFertName = '16-20-0 with sulfur';
    }

    this.nSource = 0.46;
    if (useAmmosul) {
      this.nSource = 0.21;
    }

    this.computeEarly(pRate, ha);
    this.computeEarlyUrea(pRate, nb, ha);
    this.computeActiveFert(nb, at, ha);
    this.computePannicleFert(pRate, pi, nb, at, ha);
    this.computeMOPFert(kRate, pRate, ha);
    this.computeHeadFert(hd, ha, gy14, varietyType);

    const fertilizeRecommendationModel: TimingAndFertilizerSourcesModel = ({
      growthStages: InitGrowthStageFertilizerRecommendationModel(),
      growthDuration: InitGrowthDuration()
    });

    //Early
    const earlyFertilizerSources = fertilizeRecommendationModel.growthStages[GrowthStages.EARLY].fertilizerSources;
    earlyFertilizerSources.push(this.getEarlyFertReco());
    earlyFertilizerSources.push(this.getEarlyUreaFertReco());
    earlyFertilizerSources.push(this.getEarlyMopFertReco(kRate));

    //Active Tillering
    const activeTilleringFertilizerSources = fertilizeRecommendationModel.growthStages[GrowthStages.ACTIVE_TILLERING].fertilizerSources;
    activeTilleringFertilizerSources.push(this.getActiveTilleringFertReco(useAmmosul));

    //Panicle Initiation
    const pannicleInitiationFertilizerSources = fertilizeRecommendationModel.growthStages[GrowthStages.PANNICLE_INITIATION].fertilizerSources;
    pannicleInitiationFertilizerSources.push(this.getPannicleInitiationFertReco(useAmmosul));
    pannicleInitiationFertilizerSources.push(this.getMopFertReco());

    //Heading
    const headingFertilizerSources = fertilizeRecommendationModel.growthStages[GrowthStages.HEADING].fertilizerSources;
    headingFertilizerSources.push(this.getHeadingFertReco(useAmmosul));
    
    fertilizeRecommendationModel.fertilizerName = this.getFertilizerName(kRate);
    return fertilizeRecommendationModel;
  }

  private getEarlyMopFertReco(kRate: number): FertilizerModel  {
    const earlyMopFertReco = {
      fertilizerSource: 'MOP (0-0-60)',
      fertilizerAmount: (kRate <= 40) ? this.mopEarlyFert_disp : null
    };
    return earlyMopFertReco;
  }

  private getEarlyUreaFertReco(): FertilizerModel {
    const earlyUreaFertReco = {
      fertilizerSource: 'Urea (46-0-0)',
      fertilizerAmount: (this.earlyUrea > 0) ? this.earlyUrea_disp : null
    };

    return earlyUreaFertReco;
  }

  private getEarlyFertReco(): FertilizerModel {
    return {
      fertilizerSource: this.earlyFertName,
      fertilizerAmount: this.earlyFert_disp
    };
  }

  private getActiveTilleringFertReco(useAmmosul: boolean): FertilizerModel {
    return {
      fertilizerSource: useAmmosul ? 'Ammosul' : 'Urea (46-0-0)',
      fertilizerAmount: this.activeFert_disp
    };
  }

  private getPannicleInitiationFertReco(useAmmosul: boolean): FertilizerModel {
    return {
      fertilizerSource: useAmmosul ? 'Ammosul' : 'Urea (46-0-0)',
      fertilizerAmount: this.pannicleFert_disp
    };
  }

  private getMopFertReco(): FertilizerModel {
    return {
      fertilizerSource: 'MOP or 0-0-60',
      fertilizerAmount: this.mopFert_disp
    };
  }

  private getHeadingFertReco(useAmmosul: boolean): FertilizerModel {
    return {
      fertilizerSource: useAmmosul ? 'Ammosul' : 'Urea (46-0-0)',
      fertilizerAmount: this.headFert_disp
    };
  }

  private getFertilizerName(kRate: number) {
    if(kRate === 0) {
      return FertilizerName.AMMONIUM_PHOSPHATE;
    } else {
      return FertilizerName.COMPLETE_FERTILIZER;
    }
  }


  computeEarly(pRate: number, ha: number) {
    this.earlyFert_disp = 0;
    this.earlyFert = 0
    if (pRate > 0) {
      this.earlyFert = pRate / this.fertP;
      let fert1s = this.getFertRaw(this.earlyFert, ha);
      this.earlyFert_disp = this.checkPerHa(fert1s, this.earlyFert, ha);
    }
  }

  computeEarlyUrea(pRate: number, nb: number, ha: number) {
    this.earlyUrea_disp = 0;
    this.earlyUrea = 0
    if (pRate <= 0) {
      this.earlyUrea = nb / this.nSource;
      let fert2s = this.getFertRaw(this.earlyUrea, ha);
      this.earlyUrea_disp = this.checkPerHa(fert2s, this.earlyUrea, ha);
    }
  }

  computeActiveFert(nb: number, at: number, ha: number) {
    this.activeFert_disp = 0;
    this.activeFert = 0;
    if ((nb - (this.earlyFert * this.fertN)) < 0) {
      this.activeFert = (at + (nb - (this.earlyFert * this.fertN))) / this.nSource;
    } else {
      this.activeFert = at / this.nSource;
    }

    let fert3s = this.getFertRaw(this.activeFert, ha);
    this.activeFert_disp = this.checkPerHa(fert3s, this.activeFert, ha);
  }

  computePannicleFert(pRate: number, pi: number, nb: number, at: number, ha: number) {
    this.pannicleFert_disp = 0;
    this.pannicleFert = 0;
    if (pRate <= 0) { //two splits
      this.pannicleFert = pi / this.nSource;
    } else if (!at) {
      this.pannicleFert = (pi + (nb - (this.earlyFert * this.fertN))) / this.nSource;
    } else {
      if ((nb - (this.earlyFert * this.fertN)) > 0) {
        this.pannicleFert = (pi + (nb - (this.earlyFert * this.fertN))) / this.nSource;
      } else {
        this.pannicleFert = pi / this.nSource;
      }
    }

    let fert4s = this.getFertRaw(this.pannicleFert, ha);
    this.pannicleFert_disp = this.checkPerHa(fert4s, this.pannicleFert, ha);
  }

  computeMOPFert(kRate: number, pRate: number, ha: number) {
    this.mopFert_disp = 0;
    this.mopFert = 0;

    if (kRate < 41) {
      if ((kRate - (this.earlyFert * this.fertN)) > 8) {
        this.mopFert = (kRate - (this.earlyFert * this.fertN)) / this.fertMOP;
      } else {
        this.mopFert = 0;
      }
      
      if (pRate == 0) {
        this.earlyMop = kRate / this.fertMOP;
      }
    } else {
      let k1 = kRate;
      let k2OSplit = 0;
      if (kRate > 40) {
        k1 = kRate / 2;
        k2OSplit = k1;
      }

      if ((k1 - (this.earlyFert * this.fertN)) < 0) {
        this.mopFert = (k2OSplit + (k1 - (this.earlyFert * this.fertN))) / this.fertMOP;
      } else {
        this.mopFert = k2OSplit / this.fertMOP;
      }

      if (pRate == 0) {
        this.earlyMop = k2OSplit / this.fertMOP;
      }
    }

    if (pRate == 0) {
      this.mopFert = 0;
    }

    let fert5 = this.getFertRaw(this.earlyMop, ha);
    this.mopEarlyFert_disp = this.checkPerHa(fert5, this.earlyMop, ha);

    let fert5s = this.getFertRaw(this.mopFert, ha);
    this.mopFert_disp = this.checkPerHa(fert5s, this.mopFert, ha);
  }

  computeHeadFert(hd: number, ha: number, gy14: number, varietyType: number) {
    this.headFert = hd / this.nSource;

    let fert6s = this.getFertRaw(this.headFert, ha);
    let testHeading = varietyType === 2 && gy14 >= 7.5;
    this.headFert_disp = testHeading ? this.checkPerHa(fert6s, this.headFert, ha) : 0;
  }

  //from data manipulation service
  checkPerHa(val, val1, ha) {

    let val2 = val1 * ha;
    if (val2 < 10 * ha) {
      val2 = 0;
    }

    return val >= 1 ? val : Math.round(val2 * 100) / 100;
  }

  getFertRaw(fertVal, ha) {
    return this.round((fertVal * ha), 2);
  }

  round(value, decimals) {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }

}
