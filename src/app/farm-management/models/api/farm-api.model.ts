import { AddressApiModel } from 'src/app/location/models/api';

export interface FarmApiModel {
    id: number,
    field_id: string,
    farmer_id: string,
    gpx_id: string,
    field_name: string,
    address?: AddressApiModel,
    field_unit: number,
    field_size: string,
    field_size_ha: number,
    field_member_org: string,
    field_org_name?: string,
    field_ownership: number,
    farm_lot_owner_given_name?: string,
    farm_lot_owner_surname?: string,
    farm_lot_owner_number?: string,
    status: number,
    verified_field_size: number,
    verification_date: Date,
    is_verified: number,
    same_farmer_location: boolean,
    offlineFieldId: string,
    offlineFarmerId: string,
    recommendations?: any[] // view model?
}
