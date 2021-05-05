import { AlertService } from './../../../core/services/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { FarmerService } from '../../../core/services/farmer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';

@Component({
  selector: 'app-add-farmer',
  templateUrl: './add-farmer.component.html',
  styleUrls: ['./add-farmer.component.scss'],
})
export class AddFarmerComponent implements OnInit {
  public farmerInfo: FarmerApiModel;
  public genFarmerID: number;
  public progress = 0;
  constructor(
    private farmerService: FarmerService,
    private router: Router,
    private route: ActivatedRoute,
    public alertService: AlertService
  ) {
   }

  ngOnInit() { }

  public onFarmerAdd(farmer: FarmerApiModel) {
    console.log(farmer);
    this.farmerService.addFarmer(farmer).subscribe(
      x => {
        if(x.type === HttpEventType.Response) {
          if((x.body as any).error !== undefined) {
            this.alertService.alert(
              'Add Farmer', 
              'Failed to Save!' + (x.body as any).error, 
              'Okay', 
              '', 
              ''
            );
            this.farmerService.notify.next({status: 'error'});
          } else {
            this.genFarmerID = x.body.id;
            this.progress = 0;
            this.farmerService.notify.next({status: 'success'});
            this.alertService.alert(
              'Add Farmer', 
              'Save Successful!', 
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
          'Add Farmer', 
          'Failed to Save!' + err, 
          'Okay', 
          '', 
          this.navigateToFarmerHelper.bind(this)
        );
        this.farmerService.notify.next({status: 'error'})
      }
    );
  }

  public navigateToFarmerHelper() {
    this.router.navigate(['/data-admin/farmers', this.genFarmerID]);
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

}
