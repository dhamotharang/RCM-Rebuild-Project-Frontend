import { Component, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { GpxModel } from 'src/app/core/models/gpx.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GpxFileUploadModel } from 'src/app/core/models/gpx-file-upload.model';

@Component({
  selector: 'app-gpx-info',
  templateUrl: './gpx-info.component.html',
  styleUrls: ['./gpx-info.component.scss'],
})
export class GpxInfoComponent implements OnInit {
  public loadingInfo: boolean;
  public gpxModels: GpxModel[] = [];
  public lat: number;
  public long: number;
  public gpxId: string;
  public calculatedArea: number;
  public errors: [];
  public overlapData: [];
  public uploadDate: string;
  public fileMetadata: GpxFileUploadModel[];

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    let tempData = this.router.getCurrentNavigation().extras.state;
    if (tempData && tempData.data !== undefined) {
      this.fileMetadata = tempData.data;
    }
  }

  ngOnInit() {

    this.loadingInfo = true;
    this.activatedRoute.params.subscribe(params => {
      this.gpxId = params['id'];
    });

    if (this.fileMetadata) {
      this.loadingInfo = false;

      const gpxModel = {
        paths: [],
        errors: this.fileMetadata['errors'],
        computedArea: this.fileMetadata['computedArea'],
        overlapData: this.fileMetadata['overlapData'],
        uploadDate: this.fileMetadata['dateTime'],
        gpxId: this.gpxId,
        gpxFile: this.fileMetadata['base64String']
      } as GpxModel;

      this.fileMetadata['track'].points.forEach((trk: any) => {
        gpxModel.paths.push({
          lat: Number.parseFloat(trk.lat), 
          lng: Number.parseFloat(trk.lng), 
          elevation: Number.parseFloat(trk.elevation), 
          dateTime: (trk.dateTime)
        });
      });

      gpxModel.fillColor = '#ffcccb';
      gpxModel.strokeColor = '#FF0000';

      this.gpxModels = [gpxModel];

      let error = Object.entries(gpxModel.errors);
      let lenError = error.length;
      let lenPath = gpxModel.paths.length;

      if (lenError == 0 || lenPath != 0) {
        this.lat = this.fileMetadata['track'].points[0].lat;
        this.long = this.fileMetadata['track'].points[0].lng;
      }

      let flag = lenError > 0 ? true : false;
      
      if (flag && this.fileMetadata['errors']['error'][0]['error_id'] == 7) {

        let overlapData = this.fileMetadata['errors']['error_overlap_data'];

        const overlapGpxModel = {
          paths: [],
          errors: this.fileMetadata['errors'],
          computedArea: overlapData[0].area.area_poly1,
          overlapData: this.fileMetadata['overlapData'],
          uploadDate: this.fileMetadata['dateTime'],
          gpxId: overlapData[0].gpx_id,
          gpxFile: this.fileMetadata['base64String']
        } as GpxModel;
  
        overlapData[0]['overlap_coords'].forEach((trk: any) => {
          overlapGpxModel.paths.push({
            lat: Number.parseFloat(trk.lat), 
            lng: Number.parseFloat(trk.lng), 
            elevation: Number.parseFloat(trk.elevation), 
            dateTime: (trk.dateTime)
          });
        });
  
        overlapGpxModel.fillColor = '#86cff2';
        overlapGpxModel.strokeColor = '#00ffff';

        this.gpxModels.push(overlapGpxModel);
      }

    } else {
      this.location.back();
    }
  }

  public backClicked() {
    this.location.back();
  }

}
