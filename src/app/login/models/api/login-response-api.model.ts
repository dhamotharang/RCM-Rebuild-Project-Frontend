import { UserApiModel } from './user-api.model';
import { ErrorApiModel } from './error-api.model';

export interface LoginResponseApiModel {
    data: UserApiModel;
    error: {
        errors: ErrorApiModel[]
    };
}
