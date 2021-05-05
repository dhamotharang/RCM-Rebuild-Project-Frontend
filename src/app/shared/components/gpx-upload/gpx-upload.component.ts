import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GpxFileUploaderService } from '../../../core/services/gpx-file-uploader.service';
import { GpxFileUploadModel } from 'src/app/core/models/gpx-file-upload.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gpx-upload',
  templateUrl: './gpx-upload.component.html',
  styleUrls: ['./gpx-upload.component.scss'],
})
export class GpxUploadComponent implements OnInit {
  public posted: boolean;
  @Input() public fileListMetadata: GpxFileUploadModel[] = [];
  @Input() public componentId: string;
  @Output() uploading = new EventEmitter<boolean>();

  constructor(
    private gpxFileUploaderService: GpxFileUploaderService,
    private router: Router
  ) { }

  ngOnInit() {}
  
  public viewGpx(fileMetaData: GpxFileUploadModel) {
    this.router.navigate(['/data-admin/gpx-upload/', fileMetaData.track.name], { 
      state: { data: fileMetaData } 
    });
  }

  ngOnChanges() {
    if (this.posted) {
      this.posted = false;
    }
  }

  public async uploadGpx() {
    let len = this.fileListMetadata.length;
    this.uploading.emit(true);
     
    for (let i = 0; i < len; i++) {
      this.fileListMetadata[i].computedArea = 'NA';

      if (this.fileListMetadata[i].valid) {
        this.fileListMetadata[i].uploading = true;
        
        try {
          this.fileListMetadata[i]['httpError'] = false;
          let res = await this.gpxFileUploaderService.uploadGpxFile(this.fileListMetadata[i], i).toPromise();
          this.fileListMetadata[res.index].success = res.valid;
          this.fileListMetadata[res.index].uploading = false;
          this.fileListMetadata[res.index].hasPosted = true;
          this.fileListMetadata[res.index].errors = res.errors;

          if (res.gpxData.length > 0) {
            this.fileListMetadata[res.index].computedArea = res.gpxData[0].verified_field_size;
            this.fileListMetadata[res.index].uploadDate = res.gpxData[0].verification_date;
          }
        }
        catch(e) {
          this.fileListMetadata[i]['httpError'] = true;
          this.fileListMetadata[i].success = false;
          this.fileListMetadata[i].errors = e;
        }
      }

      this.posted = true;
    }
    this.uploading.emit(false);
  }

  public get numberOfGPXFilesToUpload() {
    if (this.fileListMetadata.length) {
      return this.fileListMetadata.filter(gpxFile => {
        return gpxFile.valid
      }).length;
    }

    return 0;
  }

  public get isUploading(): boolean {
    const isUploading =  this.fileListMetadata.find((f) => f.uploading) != null;
    return isUploading;
  }

  public get hasPosted(): boolean {
    const hasPosted =  this.fileListMetadata.find((f) => f.hasPosted) != null;
    return hasPosted;
  }

}
