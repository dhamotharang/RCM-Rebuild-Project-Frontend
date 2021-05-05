import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { AddressApiModel } from 'src/app/location/models/api';
import { FarmerContactApiModel } from './farmer-contact-api.model';

export interface FarmerApiModel {
    id: number;
    farmer_id: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    is_middle_name_unknown: boolean;
    suffix_name: string;
    sex: any; // string number
    birth_date: string;
    address: AddressApiModel;
    photo: string;
    data_privacy_consent: string;
    farmer_association: string;
    contact_info: FarmerContactApiModel;
    field_count?: number;
    created_at: Date;
    updated_at: Date;
    status: number;
    rsbsa: any; // string number
    rsbsa_id: string;
    farmer_type: string;
    other_farmer_type: string;
    fields: FarmApiModel[];
    offline_id?: string;
    upload_failed?: boolean; // view model
  }
