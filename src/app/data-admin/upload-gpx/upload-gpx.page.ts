import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { AlertService } from './../../core/services/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { GpxFileUploaderService } from '../../core/services/gpx-file-uploader.service';
import { GpxFileUploadModel } from 'src/app/core/models/gpx-file-upload.model';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { ConfigurationService } from '../../v2/core/services/configuration.service';

@Component({
  selector: 'app-upload-gpx',
  templateUrl: './upload-gpx.page.html',
  styleUrls: ['./upload-gpx.page.scss'],
})
export class UploadGpxPage implements OnInit {
  public posted: boolean;
  public fileListMetadata: GpxFileUploadModel[] = [];
  public errors = [];
  public isUploading = false;
  public roleId: number;
  public loggedInUser: UserLoginModel;
  constructor(
    private gpxFileUploadService: GpxFileUploaderService,
    public alertService: AlertService,
    private authService: AuthenticationService,
    private configurationService: ConfigurationService
  ) {
    if (this.authService.isAuthenticated()) {
      this.loggedInUser = this.authService.loggedInUser;
      this.roleId = this.authService.loggedInUser.gao;
    }
  }

  ngOnInit() {
    this.fileListMetadata = [];
  }

  hasUploaded(uploaded: boolean) {
    this.isUploading = uploaded;
  }

  public async onFileChange(event: Event) {
    const numFiles = event.target['files'].length;
    const maxFiles = this.configurationService.getValue('maxGpxFiles');

    if (numFiles > maxFiles) {
      await this.alertService.alert(
          'Gpx Upload',
          'Upload max of ' + maxFiles + ' gpx files at a time only.',
          'Okay',
          '',
          ''
      );
    } else {
      this.posted = false;
      this.fileListMetadata = await this.gpxFileUploadService.getGpxMetadata(event);
    }
  }
}
