export interface FarmerFilterModel {
    // quick filters
    searchQuery?: string;
    interviewedByMe?: boolean;
    verifiedField?: boolean;
    notVerifiedField?: boolean;
    idGenerated?: boolean;

    // advanced filters
    regionId?: number;
    provinceId?: number;
    municipalId?: number;
    barangayId?: number;
    interviewDateFrom?: Date;
    interviewDateTo?: Date;

    // not used for actual filtering
    regionName?: string;
    provinceName?: string;
    municipalityName?: string;
    barangayName?: string;
}