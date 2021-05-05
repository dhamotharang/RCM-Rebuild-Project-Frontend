import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LocationModule } from '../location/location.module';
import { SharedModule } from 'src/app/v2/shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { OfflineManagementPage } from './offline-management.page';
import { OfflineFarmerUploadComponent } from './offline-farmer-upload/offline-farmer-upload.component';

const routes: Routes = [
  {
    path: '',
    component: OfflineManagementPage
  },
  {
    path: 'farmer-upload',
    component: OfflineFarmerUploadComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LocationModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    OfflineManagementPage,
    OfflineFarmerUploadComponent
  ]
})
export class OfflineManagementPageModule {}
