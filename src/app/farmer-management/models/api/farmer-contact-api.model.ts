import { PhoneOwner } from 'src/app/farmer-management/enums/phone-owner.enum';

export interface FarmerContactApiModel {
    mobile_number: string;
    phone_owner: PhoneOwner | '0';
    other_phone_owner: string;
    alternative_mobile_number: string;
    alternative_phone_owner: string;
    alt_other_phone_owner: string;
  }