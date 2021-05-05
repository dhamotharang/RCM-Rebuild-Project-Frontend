
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FarmerContactApiModel } from 'src/app/farmer-management/models/api/farmer-contact-api.model';
import { LocationFormModel } from 'src/app/location/models/location-form.model';

export interface FarmerInfoTempModel {
    id: number;
    farmer_id: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    suffix_name: string;
    sex: number;
    birth_date: string;
    address: LocationFormModel;
    photo: string;
    data_privacy_consent: string;
    farmer_association: string;
    contact_info: FarmerContactApiModel;
    field_count?: number;
    created_at: Date;
    updated_at: Date;
    status: number;
    rsbsa: number;
    rsbsa_id: string;
    farmer_type: string;
    other_farmer_type?: string;
    fields: FarmApiModel[];
}
