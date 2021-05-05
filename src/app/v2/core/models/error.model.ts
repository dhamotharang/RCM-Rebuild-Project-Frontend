import { ErrorLevelEnum } from 'src/app/v2/core/enums/error-level.enum';

export interface ErrorModel {
    title?: string;
    message: string;
    level: ErrorLevelEnum;
    status?: number;
}