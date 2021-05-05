import { FieldInfoRecommendationModel } from '../field-info-recommendation.model';
import { TargetYieldModel } from '../target-yield.model';
import { FertlizerRatesFormOutputModel } from '../fertlizer-rates-form-output.model';
import { TimingAndFertilizerSourcesModel } from '../timing-and-fertilizer-sources-model';
import { OtherCropManagementModel } from '../other-crop-management.model';
import { FarmingRecommendationPracticesOutputModel } from '../farming-recommendation-practices-output.model';
import { Language } from 'src/app/recommendation/enum/language.enum';
import { SmsDialectModel } from 'src/app/recommendation/model/sms-dialect.model';

export interface FieldRecommendationApiModel {
    fieldInfoModel: FieldInfoRecommendationModel;
    targetYieldModel: TargetYieldModel;
    fertlizerRatesModel: FertlizerRatesFormOutputModel;
    timingSplittingModel: TimingAndFertilizerSourcesModel;
    otherCropManagementModel: OtherCropManagementModel;
    farmingPracticesModel: FarmingRecommendationPracticesOutputModel;
    pdfFile: string;
    temporaryRefId?: string;
    dateGenerated?: string;
    refId?: number;
    farmerId: string;
    previousSelectedLanguage?: Language;
    farmLotId?: string;
    sowingDate?: string;
    smsDialectModel: SmsDialectModel;
}
