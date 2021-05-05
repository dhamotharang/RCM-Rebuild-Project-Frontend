import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FarmerAndFieldStorageService } from 'src/app/offline-management/services/farmer-and-field-storage.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { ErrorModel } from 'src/app/v2/core/models/error.model';
import { AlertNotificationService } from 'src/app/v2/core/services/alert-notification.service';
import { ToastService } from 'src/app/v2/core/services/toast.service';
import { FarmerFormComponent } from '../components/farmer-form/farmer-form.component';
import { FarmerModel } from '../models/farmer.model';
import { FarmerService } from '../services/farmer.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-add-farmer',
  templateUrl: './add-farmer.component.html',
  styleUrls: ['./add-farmer.component.scss'],
})
export class AddFarmerComponent implements OnInit {
  constructor(
    private farmerService: FarmerService,
    private router: Router,
    private toastService: ToastService,
    private alertNotification: AlertNotificationService,
    private offlineService: OfflineStorageService,
    private farmerFieldOfflineService: FarmerAndFieldStorageService
  ) {}

  ngOnInit() {}

  @ViewChild('farmerFormInstance') farmerFormInstance: FarmerFormComponent;

  public async ionViewWillEnter() {
    if (this.farmerFormInstance) {
      this.farmerFormInstance.clearForm();
    }

    this.isOffline = await this.offlineService.getOfflineMode();
  }

  public isOffline: boolean;

  public onFarmerFormSubmit(farmerData: FarmerModel) {
    if (this.isOffline) {
      farmerData.offlineId = uuidv4();
      this.farmerFieldOfflineService.addFarmer(this.farmerService.mapModeltoApi(farmerData))
        .then(() => {
          this.toastService
          .showSuccessToast('Farmer was added offline successfully!')
          .then(() => {
            this.router.navigate(['/data-admin/farmer-management/farmer-info', farmerData.offlineId, 'view']);
            this.farmerFormInstance.clearForm();
          });
        })
    } else {
      this.farmerService
      .addFarmer(farmerData)
      .pipe(take(1))
      .subscribe(
        (res: FarmerModel) => {
          this.toastService
            .showSuccessToast('Farmer was added successfully!')
            .then(() => {
              this.router.navigate(['/data-admin/farmer-management/farmer-info', res.id, 'view']);
              this.farmerFormInstance.clearForm();
            });
        },
        (errorData: ErrorModel) => {
          this.alertNotification.showAlert(errorData.message);
        }
      );
    }

  }
}
