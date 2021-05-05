export interface MapCoordinates {
    lat:number;
    lng:number;
    elevation:number;
    dateTime:string;
}

export interface GpxModel {
    paths: MapCoordinates[];
    fillColor: string;
    strokeColor: string;
    errors: [];
    computedArea: number;
    overlapData: [];
    uploadDate: string;
    gpxId: string;
    status: number;
    gpxFile: File;
}