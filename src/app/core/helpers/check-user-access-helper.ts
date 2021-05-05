import { Role } from 'src/app/v2/core/enums/role.enum';

export function getEditAccess(gao) {
    let flag = false;

    if (gao === Role.DATA_ADMIN || gao === Role.REGIONAL_DATA_ADMIN) {
        flag = true;
    }

    return flag;
}