import { LocationFormModel } from 'src/app/location/models/location-form.model'
import { AffirmativeEnum } from 'src/app/v2/core/enums/affirmative.enum';
import { FarmerSex } from '../enums/farmer-sex.enum';
import { FarmerType } from '../enums/farmer-type.enum';
import { FarmerContactModel } from './farmer-contact.model';

export interface FarmerModel {
    id?: number;
    farmerId?: string;
    firstName: string;
    lastName: string;
    middleName: string;
    isMiddleNameUnknown: boolean;
    suffixName: string;
    gender: FarmerSex;
    rsbsa: AffirmativeEnum;
    rsbsaId: string;
    farmerType: FarmerType[];
    otherFarmerType: string;
    otherFarmerTypeName: string;
    birthdate: Date;
    address: LocationFormModel;
    farmerPhotoBase64: string;
    dataPrivacyConsentBase64: string;
    farmerAssociation?: string;
    contactInfo: FarmerContactModel;
    createdDate: Date;
    modifiedDate: Date;
    fullName?: string;
    farmLotCount?: number;
    
    //** id used for farmers created offline (GUID) */
    offlineId?: string;
}
