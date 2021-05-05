import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmersPage } from './farmers.page';
import { SharedModule } from '../../shared/shared.module';
import { AddFarmerComponent } from './add-farmer/add-farmer.component';
import { EditFarmerComponent } from './edit-farmer/edit-farmer.component';
import { FarmerFilterComponent } from './farmer-filter/farmer-filter.component';
import { FarmerInfoComponent } from './farmer-info/farmer-info.component';
import { FarmerFieldInfoComponent } from './farmer-field-info/farmer-field-info.component';
import * as AdminSharedModule from '../shared/shared.module';
import { FarmerFormComponent } from './farmer-form/farmer-form.component';
import { FieldModalComponent } from './field-modal/field-modal.component';
import { LocationModule } from 'src/app/location/location.module';
import {SharedModule as SharedModuleV2} from 'src/app/v2/shared/shared.module';
import { FarmManagementPageModule } from 'src/app/farm-management/farm-management.module';
const routes: Routes = [
  {
    path: '',
    component: FarmersPage,
  },
  {
    path: 'add-farmer',
    component: AddFarmerComponent
  },
  {
    path: ':id/edit',
    component: EditFarmerComponent
  },
  {
    path: ':id',
    component: FarmerInfoComponent
  },
  {
    path: ':id/field/:fieldId',
    component: FarmerFieldInfoComponent
  },
  {
    path: ':id/field/:fieldId/recommendation',
    loadChildren: () =>
        import('src/app/recommendation/recommendation.module').then(
            (m) => m.RecommendationPageModule
        )
  },
];

@NgModule({
  entryComponents: [
    FarmerFilterComponent,
    FieldModalComponent],
  imports: [
    SharedModule,
    SharedModuleV2,
    AdminSharedModule.SharedModule,
    LocationModule,
    FarmManagementPageModule,
    RouterModule.forChild(routes),

  ],
  declarations: [FarmersPage,
    AddFarmerComponent,
    EditFarmerComponent,
    FarmerFilterComponent,
    FarmerInfoComponent,
    FarmerFieldInfoComponent,
    FarmerFormComponent,
    FieldModalComponent]
})
export class FarmersPageModule { }
