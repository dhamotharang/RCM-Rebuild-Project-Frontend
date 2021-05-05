import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FarmerFilterModel } from '../../models/farmer-filter.model';

@Component({
  selector: 'app-download-farmer-list-modal',
  templateUrl: './download-farmer-list-modal.component.html',
  styleUrls: ['./download-farmer-list-modal.component.scss'],
})
export class DownloadFarmerListModalComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  @Input() public advancedFilterExpanded: boolean = false;

  @Input() public farmerFilter: FarmerFilterModel = {};
  public get downloadButtonDisabled() {
    if (this.farmerFilter.regionId) {
      return !(
        this.farmerFilter.regionId &&
        this.farmerFilter.provinceId &&
        this.farmerFilter.municipalId &&
        (this.farmerFilter.barangayId || this.farmerFilter.barangayId !== null)
      );
    }
    return true;
  }

  public download() {
    this.modalController.dismiss(this.farmerFilter);
  }
}
