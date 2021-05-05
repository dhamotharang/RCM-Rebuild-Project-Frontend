export interface GpxTrackPoint {
    lat: number;
    lng: number;
    dateTime: any;
    elevation: number;
}

export interface GpxTrack {
    name: string;
    points: GpxTrackPoint[];
}

export interface GpxFileUploadModel {
    fileName: string;
    base64String: string;
    track: GpxTrack;
    dateTime: Date;        
    success: boolean,
    uploading: boolean,
    hasPosted: boolean,
    valid: boolean,
    errors: any[],
    computedArea: string;
    overlapData: [];
    uploadDate: string;
}