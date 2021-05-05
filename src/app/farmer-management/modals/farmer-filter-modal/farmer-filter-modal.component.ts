import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BrowserUrlService } from 'src/app/v2/core/services/browser-url.service';
import { FarmerFilterModel } from '../../models/farmer-filter.model';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';

@Component({
  selector: 'app-farmer-filter-modal',
  templateUrl: './farmer-filter-modal.component.html',
  styleUrls: ['./farmer-filter-modal.component.scss'],
})
export class FarmerFilterModalComponent implements OnInit {
  constructor(
    private modalController: ModalController, 
    private browserUrlService: BrowserUrlService,
    public offlineStorageService: OfflineStorageService,
  ) {}

  public isOfflineModeEnabled = false;

  ngOnInit() {}

  async ionViewDidEnter() {
    this.isOfflineModeEnabled = await this.offlineStorageService.getOfflineMode();
  }

  private _farmerFilter: FarmerFilterModel;

  @Input() set farmerFilter(value: FarmerFilterModel) {
    this._farmerFilter = { ...value };
  }

  get farmerFilter(): FarmerFilterModel {
    return this._farmerFilter;
  }

  public search() {
    // clear filter params
    this.browserUrlService.removeQueryParams([
      'regionId',
      'provinceId',
      'municipalId',
      'barangayId',
      'interviewedByMe',
      'verifiedField',
      'notVerifiedField',
      'idGenerated',
      'interviewDateFrom',
      'interviewDateTo',
    ]);
    this.modalController.dismiss(this.farmerFilter);
  }

  public get searchButtonDisabled() {
    if (this.farmerFilter.regionId) {
      return !(
        this.farmerFilter.regionId &&
        this.farmerFilter.provinceId &&
        this.farmerFilter.municipalId &&
        (this.farmerFilter.barangayId || this.farmerFilter.barangayId !== null)
      );
    }
    return false;
  }
}
