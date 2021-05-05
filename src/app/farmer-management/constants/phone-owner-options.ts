import { PhoneOwner } from '../enums/phone-owner.enum';

export const PHONE_OWNER_OPTIONS = [
    {
        value: PhoneOwner.SELF,
        label: 'Self'
    },
    {
        value: PhoneOwner.SPOUSE,
        label: 'Spouse'
    },
    {
        value: PhoneOwner.SON_OR_DAUGHTER,
        label: 'Son or Daughter'
    },
    {
        value: PhoneOwner.OTHER_RELATIVE,
        label: 'Other Relative'
    },
    {
        value: PhoneOwner.NEIGHBOR,
        label: 'Neighbor'
    },
    {
        value: PhoneOwner.OTHERS,
        label: 'Others'
    },
]