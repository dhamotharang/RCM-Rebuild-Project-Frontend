export class Field {
    constructor(
        public id = 0,
        public field_name = '',
        public field_unit = '',
        public field_size = '',
        public field_member_org = '',
        public field_org_name = '',
        public field_owner = '',
        public farm_lot_owner_given_name,
        public farm_lot_owner_surname,
        public farm_lot_owner_number
    ) {}
}