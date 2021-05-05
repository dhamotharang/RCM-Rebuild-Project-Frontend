import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { DataHistoryService } from 'src/app/v2/core/services/data-history.service';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FieldService } from 'src/app/farm-management/services/field.service';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import {
  DataHistoryModule,
  DataHistoryType,
} from 'src/app/v2/core/enums/data-history.enum';

@Component({
  selector: 'app-print-farmer-identification',
  templateUrl: './print-farmer-identification.component.html',
  styleUrls: ['./print-farmer-identification.component.scss'],
})
export class PrintFarmerIdentificationComponent implements OnInit {
  @Input() farmerInfo: FarmerApiModel;
  @Input() farmerFields: FarmApiModel[];
  @Input() roleId: number;
  public loggedInUser: UserLoginModel;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthenticationService,
    private dataHistoryService: DataHistoryService
  ) {
    if (this.authService.isAuthenticated()) {
      this.loggedInUser = authService.loggedInUser;
    }
  }

  ngOnInit() {
  }

  @ViewChild('downloadLink', { static: true }) public downloadLink: ElementRef;

  public dismissModal() {
    this.modalCtrl.dismiss();
  }

  public download(isFront: boolean) {
    const c = document.getElementById('farmer-id-canvas') as HTMLCanvasElement;

    let svgToRender;
    let face = 'front';

    if (isFront) {
      svgToRender = document.getElementById('front-id-svg');
    } else {
      face = 'back';
      svgToRender = document.getElementById('back-id-svg');
    }

    const ctx = c.getContext('2d');
    const xml = new XMLSerializer().serializeToString(svgToRender);
    var svg64 = btoa(xml);
    var b64Start = 'data:image/svg+xml;base64,';
    // prepend a "header"
    var image = new Image();
    var imgBase64 = b64Start + svg64;
    image.onload = () => {
      // clear canvas
      ctx.clearRect(0, 0, 420, 650);
      // draw image with SVG data to canvas
      ctx.drawImage(image, 0, 0, 420, 650);

      var url = c.toDataURL();

      const d = new Date();
      this.downloadLink.nativeElement.href = url;
      this.downloadLink.nativeElement.download = `FARMER-ID-${
        this.farmerInfo.farmer_id
      }-${face.toUpperCase()}-${d.getFullYear()}${d.getMonth()}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}.PNG`;
      this.downloadLink.nativeElement.click();
    }; // end async
    // start loading SVG data into in memory image
    image.src = imgBase64;
  }

  get dataHistoryTypeText() {
    return DataHistoryType;
  }
  get dataHistoryModuleText() {
    return DataHistoryModule;
  }

  public downloadAll() {
    this.download(true);
    this.download(false);

    this.dataHistoryService
      .logDataHistory(
        DataHistoryType.PRINTED,
        DataHistoryModule.FARMER_ID_CARD,
        this.farmerInfo
      )
      .subscribe();
    this.dismissModal();
  }
}
