import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import QRCode from 'qrcode'
import { LocationService } from '../../../core/services/location.service';
import { FieldOwner } from '../../../v2/core/enums/field-ownership.enum';
import { PERSON_ICON_BASE64IMG } from 'src/app/recommendation/constant/person-icon-constant';
import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';

@Component({
  selector: 'app-farmer-identification',
  templateUrl: './farmer-identification.component.html',
  styleUrls: ['./farmer-identification.component.scss'],
})
export class FarmerIdentificationComponent implements OnInit {
  @Input() face: string = 'front';
  @Input() loggedInUser: UserLoginModel;

  private _farmerInfo: FarmerApiModel;
  public addressLine1 = '';
  public addressLine2 = '';
  
  @Input() public set farmerInfo(value: FarmerApiModel) {
    this._farmerInfo = value;

    const qrInfo = `${this._farmerInfo.farmer_id}, ${this.farmerInfo.birth_date}`

    let farmerBarangay = '';

    this.locationService.getBarangay(this.farmerInfo.address.barangay_id).subscribe(async (barangay) => {
      farmerBarangay = barangay.barangay;
      const farmerMunicipality = await this.locationService.getMunicipalityById(this.farmerInfo.address.municipality_id);
      const farmerProvince = await this.locationService.getProvinceById(this.farmerInfo.address.province_id);
      const tempAddressLine1 = `Address: ${farmerBarangay}, ${farmerMunicipality ? farmerMunicipality.label : ''}`;
      if (tempAddressLine1.length > 30) {
        this.addressLine1 = `Address: ${farmerBarangay}`;
        this.addressLine2 = `${farmerMunicipality ? farmerMunicipality.label : ''}, ${farmerProvince ? farmerProvince.label : ''}`;
      } else {
        this.addressLine1 = `Address: ${farmerBarangay}, ${farmerMunicipality ? farmerMunicipality.label : ''}`;
        this.addressLine2 = `${farmerProvince ? farmerProvince.label : ''}`;
      }
    });

    const first_name = this.farmerInfo.first_name;
    const middle_name = this.farmerInfo.middle_name ? this.farmerInfo.middle_name : "";
    const last_name = this.farmerInfo.last_name;
    const tempNameLine1 = `${first_name} ${middle_name} ${last_name}`;
    
    if (tempNameLine1.length > 22) {
      this.nameLine1 = `${first_name}`;
      this.nameLine2 = `${middle_name} ${last_name}`;
    } else {
      this.nameLine1 = `${first_name} ${middle_name}`;
      this.nameLine2 = `${last_name}`;
    }

    QRCode.toDataURL(qrInfo)
      .then(url => {
        this.farmerInfoQr = url;
      })
      .catch(err => {
        console.error(err)
      })
  }

  public nameLine1: string;

  public nameLine2: string;
    

  @ViewChild('frontIdSvg', { static: true }) public frontIdSvg: ElementRef;
  @ViewChild('downloadLink', { static: true }) public downloadLink: ElementRef;
  
  public get farmerInfo(): FarmerApiModel {
    return this._farmerInfo;
  }

  public farmerInfoQr: string;

  constructor(private locationService: LocationService) {
  }

  get fieldOwnerText() { return FieldOwner; }

  ngOnInit() {
    if (this.farmerFields && this.farmerFields.length > 3) {
      this.farmerFields.length = 3;
    }
  }

  public get farmerPhoto(): string{
    return this.farmerInfo && this.farmerInfo.photo ? this.farmerInfo.photo : PERSON_ICON_BASE64IMG;
  }

  public get isFront(): boolean {
    return this.face === 'front';
  }

  public get isBack(): boolean {
    return this.face === 'back';
  }

  public get cellphoneNumber(): string {
    return this.farmerInfo ? `Cellphone no: ${this.farmerInfo.contact_info.mobile_number}` : '';
  }

  @Input() public farmerFields: FarmApiModel[] = [];

  public getTransformValue(i: number) {
    return `translate(0,${30 + (40 * i)})`
  }

  public getFieldName(field: FarmApiModel): string {
    return field && field.field_name.length < 10 ? field.field_name : null;
  }

  public getFieldNameLine1(field: FarmApiModel): string
  {
    if (field) {
      const max = Math.min(field.field_name.length, 9);
      return !this.getFieldName(field) ? field.field_name.substring(0, max) : null;
    }
    return null;
  }

  public getFieldNameLine2(field: FarmApiModel): string
  {
    if (field) {
      const max = Math.min(field.field_name.length, 18);
      return !this.getFieldName(field) ? field.field_name.substring(9, max) : null;
    }

    return null;
  }

  public getSizeInfo(field: FarmApiModel) {
    return field ? field.field_size_ha : null;
  }

  public getFieldId(field: FarmApiModel) {
    if (field) {
      return field.field_id.split("-");
    }
    
    return null;
  }

  get getBottomInfoTransformValue(): string {
    return `translate(0,${30 + (40 * this.farmerFields.length)})`
  }

  get contactPersonInfoLine1(): string {
    return this.loggedInUser ? `${this.loggedInUser.firstName}` : '';
  }

  get contactPersonInfoLine2(): string {
    return this.loggedInUser ? `${this.loggedInUser.lastName}` : '';
  }

  get contactPersonInfoTranslateValue(): string {
    return `translate(0,${30 + (40 * this.farmerFields.length) + 20})`
  }

  get forRCMUseLabelTranslateValue(): string {
    
    return `translate(0,${30 + (40 * this.farmerFields.length) + 50})`
  }

  get contactPersonNumber(): string {
    return `Cellphone no: ${this.loggedInUser.mobileNumber}`;
  }

  public get field1(): FarmApiModel {
    return this.farmerFields && this.farmerFields.length > 0 ? this.farmerFields[0] : null;
  }

  public get field2(): FarmApiModel {
    return this.farmerFields && this.farmerFields.length > 1 ? this.farmerFields[1] : null;
  }

  public get field3(): FarmApiModel {
    return this.farmerFields && this.farmerFields.length > 2 ? this.farmerFields[2] : null;
  }

  public download() {
    const c = document.getElementById('farmer-id-canvas') as HTMLCanvasElement;

    let svgToRender;

    if (this.isFront) {
      svgToRender = document.getElementById('front-id-svg');
    } else {
      
      svgToRender = document.getElementById('back-id-svg');
    }

    const ctx = c.getContext("2d");
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
        this.downloadLink.nativeElement.download = `FARMER-ID-${this.farmerInfo.farmer_id}-${this.face.toUpperCase()}-${d.getFullYear()}${d.getMonth()}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}.PNG`;
        this.downloadLink.nativeElement.click();
    }; // end async
    // start loading SVG data into in memory image
    image.src = imgBase64;
    
  }


}
