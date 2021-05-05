import { WaterSource } from '../enum/water-source.enum';
import { YesNo } from '../../v2/core/enums/yes-no.enum';

export interface FieldInfoRecommendationModel {
    field_id: string;
    farmerId: string;
    farmLotName: string;
    regionId: number;
    region: string;
    provinceId: number;
    province: string;
    municipalityId: number;
    municipality: string;
    barangayId: number;
    barangay: string;
    selectedFarmSize: number;
    daProject: number;
    specifiedDaProject?: string;
    waterSource: WaterSource;
    useGasolineDieselOrElectricity?: YesNo;
    hasAccessToPump?: YesNo;
    isSelectedWholeFarmLotSize: YesNo;
    specifiedFarmLotSizeUnit?: number;
    specifiedFarmLotSize?: number;
    farmLotAddress: string;
    offlineFieldId?: string;
}
