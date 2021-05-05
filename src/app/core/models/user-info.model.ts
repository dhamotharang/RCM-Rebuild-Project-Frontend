import { LoginAddress } from './login-address.model';
import { Role } from '../enum/role.enum';

/**
 * @deprecated Use UserLoginModel in Login module instead
 */
export interface UserInfo {
    user_id: number;
    operator_id: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    suffix: string,
    email: string;
    birthday: string;
    sex: string;
    profession: string;
    mobile_number: string;
    photo: string;
    office_address: LoginAddress;
    government_agency_office: number;
    session_id: string;
    email_status: number;
}