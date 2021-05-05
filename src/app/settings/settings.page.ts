import { Component, OnInit } from '@angular/core';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { AlertNotificationService } from '../v2/core/services/alert-notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(
    public offlineStorage: OfflineStorageService,
    private alertNotificationService: AlertNotificationService
  ) {}

  private _offlineModeEnabled;

  public get offlineModeEnabled() {
    return this._offlineModeEnabled;
  }

  public set offlineModeEnabled(value: boolean) {
    this.offlineStorage.setOfflineMode(value);
    this._offlineModeEnabled = value;
  }

  async ngOnInit() {
    this.offlineModeEnabled = await this.offlineStorage.getOfflineMode();
  }

  public async checkInterviewData(event: Event) {
    const isOfflineChecked = (event.target as HTMLInputElement).checked;
    if (isOfflineChecked) {
      const offlineFarmerLocation = await this.offlineStorage.get(
        'FARMER_LOCATION_STORAGE_KEY'
      );
      if (!offlineFarmerLocation) {
        this.alertNotificationService.showAlert(
          'You may need to download the interview data first',
          'Message'
        );
      }
    }
  }
}
