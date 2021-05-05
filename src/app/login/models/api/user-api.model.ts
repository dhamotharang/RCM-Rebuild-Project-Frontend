import { OfficeAddressApiModel } from './office-address-api.model';

export interface UserApiModel {
  user_id: number;
  operator_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  email: string;
  birthday: string; // YYYY-MM-DD
  sex: number;
  profession: number;
  mobile_number: string;
  photo: string;
  office_address: OfficeAddressApiModel;
  government_agency_office: number;
  session_id: string;
  email_status: number;
  municipality_id: number;
  province_id: number;
  region_id: number;
  other_profession: string;
}
