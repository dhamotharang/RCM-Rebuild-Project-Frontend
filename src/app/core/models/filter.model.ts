import { FarmerQuickFilterEnum } from '../../farmer-management/enums/filter.enum';

/** @deprecated use model under farmer management module */
export interface FarmerFilterModel {
  region: string;
  region_id: number;
  province: string;
  province_id: number;
  municipality: string;
  municipality_id: number;
  barangay: string;
  barangay_id: number;
  fromDate: string;
  toDate: string;
}

export interface FilterModel {
  name: string;
  key: number;
  keyName?: string;
  active: boolean;
  isDisplayed?: boolean;
}

export function InitFilters(
  interviewedByMe: boolean,
  verifiedField: boolean,
  notVerifiedField: boolean,
  idGenerated: boolean
): FilterModel[] {
  return [
    {
      name: 'Interviewed By Me',
      key: FarmerQuickFilterEnum.InterviewedByMe,
      keyName: 'interviewedByMe',
      active: interviewedByMe,
    },
    {
      name: 'Verified Field',
      key: FarmerQuickFilterEnum.VerifiedField,
      keyName: 'verifiedField',
      active: verifiedField,
      isDisplayed: true,
    },
    {
      name: 'Not Verified Field',
      key: FarmerQuickFilterEnum.NotVerifiedField,
      keyName: 'notVerifiedField',
      active: notVerifiedField,
      isDisplayed: true,
    },
    {
      name: 'ID Generated',
      key: FarmerQuickFilterEnum.IDGenerated,
      keyName: 'idGenerated',
      active: idGenerated,
    },
  ];
}
