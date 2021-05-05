import { PhoneOwner } from '../enums/phone-owner.enum';

export interface FarmerContactModel {
    mobileNumber: string,
    phoneOwner: PhoneOwner;
    otherPhoneOwner: string;
    alternativeMobileNumber: string;
    alternativePhoneOwner: PhoneOwner;
    alternativeOtherPhoneOwner: string;
}