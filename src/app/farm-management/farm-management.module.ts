import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FarmManagementPage } from './farm-management.page';
import { FarmerFieldListComponent } from './farmer-field-list/farmer-field-list.component';
import { FieldCardItemComponent } from './components/field-card-item/field-card-item.component';
import { FarmLotFormModalComponent } from './modals/farm-lot-form-modal/farm-lot-form-modal.component';
import { SharedModule } from '../v2/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocationModule } from '../location/location.module';

const routes: Routes = [
  {
    path: '',
    component: FarmManagementPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    MatTooltipModule,
    LocationModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FarmManagementPage, FarmerFieldListComponent, FieldCardItemComponent, FarmLotFormModalComponent],
  exports: [FarmerFieldListComponent, FieldCardItemComponent, FarmLotFormModalComponent]

})
export class FarmManagementPageModule {}
