import { UserLoginModel } from './user-login.model';
import { ErrorApiModel } from './api/error-api.model';

export interface LoginResponseModel {
    data: UserLoginModel;
    error: {
        errors: ErrorApiModel[]
    };
}
