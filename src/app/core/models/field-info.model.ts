import { APP_INITIALIZER } from '@angular/core';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';

export function InitFieldInfoModel(): FarmApiModel {
    return {
        id: 0,
        field_id: '',
        farmer_id: '',
        gpx_id: '',
        field_name: '',
        address: {
            region: '',
            region_code: '',
            region_id: 0,

            province: '',
            province_code: '',
            province_id: 0,

            municipality: '',
            municipality_code: '',
            municipality_id: 0,

            barangay: '',
            barangay_code: '',
            barangay_id: 0,
        },
        field_unit: 0,
        field_size: '',
        field_size_ha: 0,
        field_member_org: '',
        field_org_name: '',
        field_ownership: 0,
        status: 0,
        verified_field_size: 0,
        verification_date: new Date(),
        is_verified: 0,
        same_farmer_location: true,
        offlineFieldId: '',
        offlineFarmerId: ''
    }
}