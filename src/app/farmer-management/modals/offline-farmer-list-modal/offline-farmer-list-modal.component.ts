import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { FarmerModel } from 'src/app/farmer-management/models/farmer.model';

@Component({
  selector: 'app-offline-farmer-list-modal',
  templateUrl: './offline-farmer-list-modal.component.html',
  styleUrls: ['./offline-farmer-list-modal.component.scss'],
})
export class OfflineFarmerListModalComponent implements OnInit {

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  @Input() public isGridView: boolean;
  @Input() public isListView: boolean;
  @Input() public farmerList: FarmerModel[] = [];

  public handleClose() {
    this.modalController.dismiss();
  }

}
