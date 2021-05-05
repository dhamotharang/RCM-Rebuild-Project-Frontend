import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }

  createDb() {

    const farmer = [{
      id: 1,
      farmer_id: 'RU4033-00001',
      first_name: 'Lucky',
      last_name: 'Somosot',
      middle_name: 'R',
      suffix_name: 'brown',
      sex: 'Male',
      birth_date: '2000-02-22',
      address:
      {
        region: 'Calabarzon',
        region_code: '1024',
        region_id: '1',

        province: 'Laguna',
        province_code: '102',
        province_id: '1',

        municipality: 'Los Banos',
        municipality_code: '10',
        municipality_id: '2',

        barangay: 'Maahas',
        barangay_code: '19534',
        barangay_id: '19534'
      },
      photo: '',
      farmer_association: 'Magsasaka',
      contact_info:
      {
        mobile_number: '9838383888',
        phone_owner: '1',
        alternative_mobile_number: '9838383888',
        alternative_phone_owner: '1'
      }
    },
    {
      id: 2,
      farmer_id: 'RU4033-00001',
      first_name: 'Jerome',
      last_name: 'Vila',
      middle_name: 'R',
      suffix_name: 'brown',
      sex: 'Male',
      birth_date: '2000-02-22',
      address:
      {
        region: 'Calabarzon',
        region_code: '1024',
        region_id: '1',

        province: 'Laguna',
        province_code: '102',
        province_id: '1',

        municipality: 'Los Banos',
        municipality_code: '10',
        municipality_id: '2',

        barangay: 'Maahas',
        barangay_code: '1',
        barangay_id: '19534'
      },
      photo: '',
      farmer_association: 'Magsasaka',
      contact_info:
      {
        mobile_number: '9838383888',
        phone_owner: '1',
        alternative_mobile_number: '9838383888',
        alternative_phone_owner: '1'
      }
    }];

    const fields: FarmApiModel[]=[
      // { id: 1, field_id: 1, farmer_id: 1, field_name: 'Field name 1', field_unit: '1', field_size: '1', field_member_org: '1', field_org_name: 'Test org', field_ownership: 1, farm_lot_owner_given_name: "", farm_lot_owner_surname: "", farm_lot_owner_number: "" },
      // { id: 2, field_id: 2, farmer_id: 1, field_name: 'Field name 2', field_unit: '1', field_size: '2', field_member_org: '1', field_org_name: 'Test org', field_ownership: 1, farm_lot_owner_given_name: "", farm_lot_owner_surname: "", farm_lot_owner_number: "" },
      // { id: 3, field_id: 3, farmer_id: 2, field_name: 'Field name 3', field_unit: '1', field_size: '3', field_member_org: '1', field_org_name: 'Test org', field_ownership: 1, farm_lot_owner_given_name: "", farm_lot_owner_surname: "", farm_lot_owner_number: "" }

    ];

    return { farmer, fields };
  }

  genId(fields: FarmApiModel[]): number {
    return fields.length > 0 ? Math.max(...fields.map(field => field.id)) + 1 : 11
  }
}
