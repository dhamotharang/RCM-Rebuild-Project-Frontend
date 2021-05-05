import { LocationFormModel } from "../../location/models/location-form.model";

export interface UserLoginModel {
    userId: number;
    firstName: string;
    lastName: string;
    profilePhotoUrl: string;
    gao: number;
    officeAddress: LocationFormModel;
    mobileNumber: string;
    operatorId: string;
    sessionToken: string;
    email: string;
    profession: number;
    otherProfession?: string;
}