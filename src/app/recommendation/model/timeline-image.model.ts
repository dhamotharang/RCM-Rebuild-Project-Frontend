import { YesNo } from '../../v2/core/enums/yes-no.enum';
import { GrowthStageImageModel } from './growth-stage-image.model';
import { DayDurationModel } from './day-duration.model';

export interface TimelineImageModel {
    growthStages: GrowthStageImageModel[];
    growthDuration: number;
    hasSeedbed: boolean;
    use21DayOldSeedlingAge: boolean;
    showPracticeSafeAwd: YesNo;
    showKeepFloodedBelow5cm: YesNo;
    daysAfterLabel: string;
    maxDays: number;
    showHandWeed: YesNo;
    practiceSafeAwdLabel: string;
    seedBedLabel: string;
}
