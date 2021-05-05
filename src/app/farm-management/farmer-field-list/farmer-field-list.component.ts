import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FarmLotFormModalComponent } from '../modals/farm-lot-form-modal/farm-lot-form-modal.component';
import { ToastService } from 'src/app/v2/core/services/toast.service';
import { Router } from '@angular/router';
import { FarmerModel } from 'src/app/farmer-management/models/farmer.model';

@Component({
  selector: 'app-farmer-field-list',
  templateUrl: './farmer-field-list.component.html',
  styleUrls: ['./farmer-field-list.component.scss'],
})
export class FarmerFieldListComponent implements OnInit {
  public farmer_id: number;

  @Input() public set fieldList(value: FarmApiModel[]) {
    if (value) {
      const fields = [];
      value.forEach((f: FarmApiModel) => {
        const field = { ...f };
        fields.push(field);
      });

      this._fieldList = fields;
    }
  }

  @Input() farmerInfo: FarmerModel;

  constructor(
    private modalController: ModalController,
    private toastService: ToastService,
    private router: Router,
  ) {}

  private _fieldList: FarmApiModel[];
  public get fieldList(): FarmApiModel[] {
    return this._fieldList;
  }

  get fieldNameDisplay(): string {
    return this.farmerInfo.firstName.charAt(0) + this.farmerInfo.lastName;
  }

  async addFieldModal() {
    const modal = await this.modalController.create({
      component: FarmLotFormModalComponent,
      componentProps: {
        fields: this.fieldList,
        farmer_id: this.farmerInfo.farmerId,
        farmerInfo: this.farmerInfo,
        field_name: this.fieldNameDisplay,
        type: 'add',
      },
    });

    modal.onDidDismiss().then(field => {
      if (field['data']) {
        field['data'].farmer_id = this.farmer_id;
        this.fieldList.push(field['data']);
        this.toastService.showSuccessToast('Farm Lot was added successfully!');
        this.fieldList.sort((a, b) => b.id - a.id);
      }
    });

    return modal.present();
  }

  @Output() public selectField = new EventEmitter<any>();

  ngOnInit() {}

  public listType = 'grid';

  public get isGrid(): boolean {
    return this.listType === 'grid';
  }

  public get isList(): boolean {
    return this.listType === 'table';
  }

  public onListTypeChange(e: Event, listType: string) {
    e.preventDefault();
    this.listType = listType;
  }

  public onFieldSelected(field: FarmApiModel) {
    if(field.field_id){
      this.router.navigate(['data-admin', 'farmers', this.farmerInfo.id, 'field', field.id]);
    }else{
      const farmerId = this.farmerInfo.id ? this.farmerInfo.id : this.farmerInfo.offlineId;
      this.router.navigate(['data-admin', 'farmers', farmerId, 'field', field.offlineFieldId]);
    }

    this.modalController.dismiss();
  }

  public onCancel(){
    this.modalController.dismiss();
  }
}
