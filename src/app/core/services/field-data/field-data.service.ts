import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Field } from './field-data';


export class FieldData implements InMemoryDbService {
  createDb(){
    const fields: Field[]=[
      { id: 1, field_name: 'Field name 1', field_unit: '1', field_size: '1', field_member_org: '1', field_org_name: 'Test org', field_owner: '1', farm_lot_owner_given_name: "", farm_lot_owner_surname: "", farm_lot_owner_number: "" },
      { id: 2, field_name: 'Field name 2', field_unit: '1', field_size: '2', field_member_org: '1', field_org_name: 'Test org', field_owner: '1', farm_lot_owner_given_name: "", farm_lot_owner_surname: "", farm_lot_owner_number: "" },
      { id: 3, field_name: 'Field name 3', field_unit: '1', field_size: '3', field_member_org: '1', field_org_name: 'Test org', field_owner: '1', farm_lot_owner_given_name: "", farm_lot_owner_surname: "", farm_lot_owner_number: "" },
      { id: 4, field_name: 'Field name 4', field_unit: '1', field_size: '4', field_member_org: '1', field_org_name: 'Test org', field_owner: '1', farm_lot_owner_given_name: "", farm_lot_owner_surname: "", farm_lot_owner_number: "" }

    ];
    return {fields};
  }

  genId(fields: Field[]): number {
    return fields.length > 0 ? Math.max(...fields.map(field => field.id)) + 1 : 11
  }
}