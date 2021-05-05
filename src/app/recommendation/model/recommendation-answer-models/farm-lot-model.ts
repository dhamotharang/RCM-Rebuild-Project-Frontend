import { WaterSource } from '../../enum/water-source.enum';
import { DaProject } from '../../enum/da-project.enum';
import { YesNo } from '../../../v2/core/enums/yes-no.enum';

export interface FarmLotModel {
    farmLotName: string;

    farmLotAddress: string;

    farmLotRegionId: number;
    farmLotProvinceId: number;
    farmLotMunicipalityId: number;
    farmLotBarangayId: number;

    isSelectedWholeFarmLotSize: YesNo;
    specifiedFarmLotSizeUnit: number;
    specifiedFarmLotSize: number;

    daProject: DaProject;
    specifiedDaProject: string;
    waterSource: WaterSource;

    isUsingPumpPoweredEquipment: YesNo;
    hasPumpSupplyAccess: YesNo;
}
