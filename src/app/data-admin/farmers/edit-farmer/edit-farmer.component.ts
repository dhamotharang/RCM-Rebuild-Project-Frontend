import { OfficeAddressApiModel } from 'src/app/login/models/api/office-address-api.model';
import { AlertService } from './../../../core/services/alert/alert.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FarmerInfoTempModel } from '../../../core/models/farmer-info.model';
import { take, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FarmerService } from '../../../core/services/farmer.service';
import { FarmerFormComponent } from '../farmer-form/farmer-form.component';
import { HttpEventType } from '@angular/common/http';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { AddressApiModel } from 'src/app/location/models/api';

@Component({
  selector: 'app-edit-farmer',
  templateUrl: './edit-farmer.component.html',
  styleUrls: ['./edit-farmer.component.scss'],
})
export class EditFarmerComponent implements OnInit {

  public farmerId: number;
  public farmerInfo: FarmerInfoTempModel;
  public progress = 0;

  @ViewChild('farmerForm', { static: true }) farmerForm: FarmerFormComponent;

  public constructor(
    private route: ActivatedRoute,
    private farmerService: FarmerService,
    private router: Router,
    public alertService: AlertService
  ) { }

  public ngOnInit() {

    this.farmerId = parseInt(this.route.snapshot.paramMap.get('id'));

    this.farmerService.getFarmerInfo(this.farmerId)
      .pipe(
        take(1),
        map((farmerInfo: FarmerApiModel) => {
          const tempFarmerInfo: FarmerInfoTempModel = {
            ...farmerInfo,
            address: this.mapOfficeAddress(farmerInfo.address)
          };
          return tempFarmerInfo;
        }),
      ).subscribe((res: FarmerInfoTempModel) => {
        this.farmerInfo = res;
      });

  }

  private mapOfficeAddress(address: AddressApiModel) {
    if (address) {
      return {
        regionId: address.region_id,
        provinceId: address.province_id,
        municipalityId: address.municipality_id,
        barangayId: address.barangay_id
      };
    }
    return null;
  }

  public onFarmerUpdate(farmer: FarmerApiModel) {
    farmer.farmer_id = this.farmerInfo.farmer_id;
    this.farmerService.updateFarmer(farmer).subscribe(
      x => {
        if(x.type === HttpEventType.Response) {
          if((x.body as any).error !== undefined) {
            this.alertService.alert(
              'Edit Farmer',
              'Failed to Edit! ' + (x.body as any).error,
              'Okay',
              '',
              ''
            );
            this.farmerService.notify.next({status: 'error'});
          } else {
            this.progress = 0;
            this.farmerService.notify.next({status: 'success'});
            this.alertService.alert(
              'Edit Farmer',
              'Edit Successful!',
              'Okay',
              '',
              this.navigateToFarmerHelper.bind(this)
            );
          }
        }

        if(x.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((x.loaded / x.total) * 100);
        }
      }
      , err => {
        this.alertService.alert(
          'Edit Farmer',
          'Failed to Edit! ' + err,
          'Okay',
          '',
          this.navigateToFarmerHelper.bind(this)
        )
        this.farmerService.notify.next({status: 'error'});
      }
    );
  }

  public navigateToFarmerHelper() {
    this.router.navigate(['/data-admin/farmers', this.farmerId]);
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  onCancel() {
    this.router.navigate(['/data-admin/farmers', this.farmerId]);
  }
  
  private initializeFarmerInfo() {
    return {
      id: null,
      farmer_id: 'RU4033-00001',
      first_name: '',
      last_name: '',
      middle_name: '',
      suffix_name: '',
      sex: 0,
      birth_date: '',
      address:
      {
        region: 'Calabarzon',
        region_code: '1024',
        region_id: 0,

        province: 'Laguna',
        province_code: '102',
        province_id: 0,

        municipality: 'Los Banos',
        municipality_code: '10',
        municipality_id: 0,

        barangay: 'Maahas',
        barangay_code: '1',
        barangay_id: 0
      },
      photo: '',
      farmer_association: '',
      contact_info:
      {
        mobile_number: '',
        phone_owner: '',
        other_phone_owner: '',
        alternative_mobile_number: '',
        alternative_phone_owner: '',
        alt_other_phone_owner: ''
      },
      created_at: new Date()
    };
  }


}
