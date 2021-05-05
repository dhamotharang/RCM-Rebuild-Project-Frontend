import { FarmLotModel } from './recommendation-answer-models/farm-lot-model';
import { FertilizerRatesModel } from './recommendation-answer-models/fertilizer-rates-model';
import { OtherCropManagementModel } from './recommendation-answer-models/other-crop-management-model';
import { SetTargetYieldModel } from './recommendation-answer-models/set-target-yield-model';
import { TimingAndFertilizerSourcesModel } from './timing-and-fertilizer-sources-model';
import { FarmingRecommendationPracticesOutputModel } from './farming-recommendation-practices-output.model';
import { Language } from '../enum/language.enum';
import { SmsDialectModel } from 'src/app/recommendation/model/sms-dialect.model';
import { PhoneOwner } from 'src/app/farmer-management/enums/phone-owner.enum';

export interface RecommendationModel {
    farmLot: FarmLotModel;
    setTargetYield: SetTargetYieldModel;
    fertilizerRates: FertilizerRatesModel;
    timingSplitting: TimingAndFertilizerSourcesModel;
    otherCropManagement: OtherCropManagementModel;
    farmingPractices: FarmingRecommendationPracticesOutputModel;
    refId: number;
    dateGenerated: Date;
    pdfFile: string;
    temporaryReferenceId?: string;
    previousSelectedLanguage?: Language;
    smsAndDialect?: SmsDialectModel;
    phoneOwner?: PhoneOwner;
}
