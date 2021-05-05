import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GpxFileUploadModel } from '../models/gpx-file-upload.model';
import { GpxModel } from '../models/gpx.model';
import { environment } from 'src/environments/environment';
import { catchError, timeout } from 'rxjs/operators';
import { parseString } from 'xml2js';
import { FieldService } from 'src/app/farm-management/services/field.service';
import { ErrorService } from 'src/app/v2/core/services/error.service';
import { ConfigurationService } from '../../v2/core/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class GpxFileUploaderService {
  private readonly API_URL = environment.gpxApi;
  public posted: boolean;
  public fileListMetadata: GpxFileUploadModel[] = [];

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private fieldService: FieldService,
    private offlineStorage: OfflineStorageService,
    private configurationService: ConfigurationService
  ) { }

  private headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  private httpOptions = {
    headers: this.headers
  };

  public uploadGpxFile(gpxUploadModel: GpxFileUploadModel, index): Observable<any> {
    const maxTime = this.configurationService.getValue('uploadGpxTimeout');

    return this.http.post<GpxFileUploadModel>(`${this.API_URL}`, { gpx: gpxUploadModel, i: index }).pipe(
      timeout(maxTime),
      catchError(this.errorService.handleError('GpxService', 'uploadGpxFile'))
    );
  }

  public confirmGpx(gpxModels: GpxModel[]) {
    const url = `${this.API_URL}/${gpxModels[0].gpxId}`;
    return this.http.post<GpxModel>(url, { gpx: gpxModels }).pipe(
      catchError(this.errorService.handleError('GpxService', 'confirmGpx'))
    );
  }

  public getGpxData(gpx_id: string): Observable<GpxModel> {
    const url = `${this.API_URL}/${gpx_id}`;
    return this.http.get<GpxModel>(url, this.httpOptions).pipe(
      catchError(this.errorService.handleError('GpxService', 'getGpxData'))
    );
  }

  public getGpxInfo(gpxId: number): Observable<GpxModel> {
    return from(this.getGpxInfoAsync(gpxId));
  }

  public async getGpxInfoAsync(gpxId: number): Promise<GpxModel> {
    const isOfflineModeEnabled = await this.offlineStorage.getOfflineMode();

    if (isOfflineModeEnabled) {
      return null;
    } else {
      const url = `${this.fieldService.apiurl}/fields/${gpxId}`;
      return this.http.get<GpxModel>(url, this.httpOptions).pipe(
        catchError(this.errorService.handleError('GpxService', 'getGpxInfo'))
      ).toPromise();
    }
  }

  public deleteGpx(gpx_id: number): Observable<GpxModel> {
    const url = `${this.fieldService.apiurl}/fields/${gpx_id}/deleteGpx`;
    return this.http.put<GpxModel>(url, this.httpOptions).pipe(
      catchError(this.errorService.handleError('GpxService', 'deleteGpx'))
    );
  }

  public downloadGpx(gpx_id: string): Observable<any> {
    const url = `${this.fieldService.apiurl}/gpx/${gpx_id}`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      catchError(this.errorService.handleError('GpxService', 'deleteGpx'))
    );
  }

  public toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  public xmlToJson = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      parseString(reader.result as string, (err, result) => {
        resolve(result);
      });
    };
    reader.onerror = error => reject(error);
  });

  public async getGpxMetadata(event: Event) {
    this.posted = false;
    let fileList = (event.target as HTMLInputElement).files;
    this.fileListMetadata = [];
    let validXml = [];
    const fileLength = fileList.length;

    for (let i = 0; i < fileLength; i++) {
      let file = fileList[i];
      const fileJson = await this.xmlToJson(file) as any;
      const b64fileString = (await this.toBase64(file)) as string;
      const isGPXValid = this.isGPXFileValid(validXml[i], fileJson, file.name);

      this.fileListMetadata.push({
        fileName: file.name,
        base64String: b64fileString,
        dateTime: isGPXValid.valid ? new Date(fileJson.gpx.metadata[0].time[0]) : new Date(),
        success: true,
        uploading: false,
        hasPosted: false,
        valid: isGPXValid.valid,
        track: {
          name: isGPXValid.valid ? fileJson.gpx.trk[0].name[0] : isGPXValid.trackName,
          points: []
        },
        errors: isGPXValid.error,
        computedArea: '',
        overlapData: [],
        uploadDate: ''
      });

      if (isGPXValid.valid) {
        fileJson.gpx.trk[0].trkseg[0].trkpt.forEach(trackPoint => {
          let dateTime = trackPoint.time != undefined ? new Date(trackPoint.time[0]) : '';
          let elevation = trackPoint.ele != undefined ? Number.parseFloat(trackPoint.ele[0]) : 0;

          this.fileListMetadata[i].track.points.push({
            lat: Number.parseFloat(trackPoint.$.lat),
            lng: Number.parseFloat(trackPoint.$.lon),
            elevation: elevation,
            dateTime: dateTime
          });
        });
      }

    }

    return this.fileListMetadata;
  }

  private getDeepKeys(obj) {
    let keys = [];
    for(let key in obj) {
      keys.push(key);
      if(typeof obj[key] === "object") {
        const subKeys = this.getDeepKeys(obj[key]);
        keys = keys.concat(subKeys.map(function(subKey) {
          return subKey;
        }));
      }
    }
    return keys;
  }

  private isGPXFileValid(validXml, fileJson, fileName) {
    let error = [];
    let gpxFileValid = true;
    let trackName = "NA";
    const requiredTags = ["gpx", "metadata", "trk", "name", "trkseg", "trkpt"];
    const xmlTags = this.getDeepKeys(fileJson);
    validXml = true;

    for (let j = 0; j < requiredTags.length; j++) {
      if (!xmlTags.includes(requiredTags[j])) {
        validXml = false;
        gpxFileValid = false;
        error.push("GPX file is empty or corrupted.");
        break;
      }
    }

    if (validXml) {
      trackName = fileJson.gpx.trk[0].name[0];
      
      if (!this.isFileNameAndTrackNameMatch(fileName, trackName)) {
        error.push("GPX filename and track name do not match.");
        gpxFileValid = false;
      }

      const trackLength = fileJson.gpx.trk.length;
  
      if (trackLength > 1) {
        error.push("GPX file contains multiple tracks.");
        trackName = this.getTrackNames(trackName, trackLength, fileJson).join(", ");
        gpxFileValid = false;
      }
    }

    return {
      valid: gpxFileValid,
      error: error,
      trackName: trackName
    };
  }
  
  private getTrackNames(trackName, trackLength, fileJson) {
    trackName = [];
    for (let k = 0; k < trackLength; k++) {
      if (fileJson.gpx.trk[k].name && fileJson.gpx.trk[k].name[0]) {
        trackName.push(fileJson.gpx.trk[k].name[0]);
      }
    }

    return trackName;
  }

  public isFileNameAndTrackNameMatch(fileName, trackName) {
    const fileNameTemp = fileName.includes('Track_') ? fileName.slice(6, 23) : fileName;
    
    return trackName + '.gpx' === fileNameTemp;
  }
}
