import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { Component, OnInit, Input } from '@angular/core';
import { GpxModel } from 'src/app/core/models/gpx.model';
import { GpxFileUploaderService } from 'src/app/core/services/gpx-file-uploader.service';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Role } from 'src/app/v2/core/enums/role.enum';
import { ConfigurationService } from '../../../v2/core/services/configuration.service';

@Component({
  selector: 'app-gpx-map',
  templateUrl: './gpx-map.component.html',
  styleUrls: ['./gpx-map.component.scss'],
})
export class GpxMapComponent implements OnInit {
  @Input() public mapLatitude: number;
  @Input() public mapLongitude: number;
  @Input() public gpxModels: GpxModel[];
  @Input() public errors = [];
  @Input() public overlapData: [];
  @Input() public gpxId: string;

  public uploadDate: string;
  public lat: number;
  public long: number;
  public mapType;
  private loggedInUser: UserLoginModel;

  constructor(
    private gpxFileUploaderService: GpxFileUploaderService,
    private authService: AuthenticationService,
    public alertService: AlertService,
    private configurationService: ConfigurationService
  ) {
    this.mapType = this.configurationService.getValue('mapType');
    if (this.authService.isAuthenticated()) {
      this.loggedInUser = authService.loggedInUser;
    }
  }

  ngOnInit() {
    this.errors = this.gpxModels[0].errors;
    this.overlapData = this.gpxModels[0].overlapData;
    this.gpxId = this.gpxModels[0].gpxId;
  }

  public confirmOverlap() {
    if (this.isDataAdmin()) {
      this.gpxFileUploaderService.confirmGpx(this.gpxModels).subscribe((res: GpxModel) => {
        const gpxModel = {
          paths: [],
          computedArea: res['gpxData'].verified_field_size,
          uploadDate: '',
          gpxId: res['gpxData'].gpx_id,
          fillColor: '#86cff2',
          strokeColor: '#00ffff'
        } as GpxModel;
  
        res['gpxData'].track_points.forEach((trk: any) => {
          gpxModel.paths.push({lat: Number.parseFloat(trk.lat), lng: Number.parseFloat(trk.lng), elevation: Number.parseFloat(trk.elevation), dateTime: (trk.dateTime)});
        });
  
        this.lat = this.mapLatitude;
        this.long = this.mapLongitude;
        this.errors = [];
        this.overlapData = [];
        
        this.gpxModels = [gpxModel];
      });
  
      this.alertService.alert(
        'Gpx Overlap',
        'Gpx data updated!',
        'Okay',
        '',
        ''
      );
    } else {
      this.alertService.alert(
        'Gpx Overlap',
        'Insufficient privileges!',
        'Okay',
        '',
        ''
      );
    }
    
  }

  public isDataAdmin() {
    const GAO = this.loggedInUser.gao;
    return GAO === Role.REGIONAL_DATA_ADMIN || GAO === Role.DATA_ADMIN;
  }

}
