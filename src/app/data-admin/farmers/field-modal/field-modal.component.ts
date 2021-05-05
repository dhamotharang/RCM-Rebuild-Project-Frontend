import { AlertService } from './../../../core/services/alert/alert.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { FarmLotFormModalComponent } from 'src/app/farm-management/modals/farm-lot-form-modal/farm-lot-form-modal.component';
import { FieldService } from 'src/app/farm-management/services/field.service';

@Component({
  selector: 'app-field-modal',
  templateUrl: './field-modal.component.html',
  styleUrls: ['./field-modal.component.scss'],
})
export class FieldModalComponent implements OnInit {
    public fields: FarmApiModel[]=[];
    public idtodelete: number;
    public farmerInfo: FarmerApiModel;
    @Input() farmerId: number;
    public farmer_id: number;
   
    constructor(
      private dataService: FieldService,
      private modalController: ModalController,
      private route: ActivatedRoute,
      public alertService: AlertService
    ) { }
  
    getFields(){
      this.dataService.getFields(this.farmer_id).subscribe(data => {
        this.fields = data;
      });
    }
  
    deleteField(event) {
      let target = event.target;
      let id = target.attributes.id.value;
      
      this.dataService.deleteField(id).subscribe(data => {
        this.getFields();
      });
    }
  
    searchDeleteField() {
      if (this.idtodelete) {
        this.dataService.deleteField(this.idtodelete).subscribe(data => {
          this.getFields();
        });
      }
    }
  
    async openModal() {
      const modal = await this.modalController.create({
        component: FarmLotFormModalComponent,
        componentProps: {
          fields: this.fields,
          farmer_id: this.farmer_id
        }
      });
  
      modal.onDidDismiss()
        .then((field) => {
          if (field["data"]) {
            field["data"].farmer_id = this.farmer_id;
            this.fields.push(field["data"]);
            this.alertService.alert(
              'Add Farm Lot',
              'Successfully added farm lot!',
              'Okay',
              '',
              ''
            );
            this.getFields();
          }
      });
  
      return modal.present();
    }
   
    ngOnInit() {
      this.farmer_id = parseInt(this.route.snapshot.paramMap.get('id'));
      this.getFields();
    }

}
