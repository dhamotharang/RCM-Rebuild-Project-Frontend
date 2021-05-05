import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';
import { Dialect } from 'src/app/recommendation/enum/dialect.enum';

export interface SmsDialectModel {
    receiveSms?: number;
    dialect: Dialect;
    transplantingWillOccur?: YesNo;
    transplantingOccurLowerDate?: string;
    transplantingOccurUpperDate?: string;
}