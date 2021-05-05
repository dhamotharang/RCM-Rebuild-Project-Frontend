import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FarmerManagementPage } from './farmer-management.page';
import { AddFarmerComponent } from './add-farmer/add-farmer.component';
import { EditFarmerComponent } from "src/app/farmer-management/edit-farmer/edit-farmer.component";
import { FarmerFormComponent } from './components/farmer-form/farmer-form.component';
import { SharedModule } from 'src/app/v2/shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { LocationModule } from '../location/location.module';
import { FarmerListComponent } from './farmer-list/farmer-list.component';
import { FarmerFilterComponent } from './components/farmer-filter/farmer-filter.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FarmerFilterModalComponent } from './modals/farmer-filter-modal/farmer-filter-modal.component';
import { DownloadFarmerListModalComponent } from './modals/download-farmer-list-modal/download-farmer-list-modal.component';
import { FarmerFilterFeedbackComponent } from './components/farmer-filter-feedback/farmer-filter-feedback.component';
import { FarmerViewListComponent } from './components/farmer-view-list/farmer-view-list.component';
import { OfflineFarmerListModalComponent } from './modals/offline-farmer-list-modal/offline-farmer-list-modal.component';
import { FarmManagementPageModule } from '../farm-management/farm-management.module';
import { FarmerIdentificationComponent } from 'src/app/farmer-management/components/farmer-identification/farmer-identification.component';
import { PrintFarmerIdentificationComponent } from './print-farmer-identification/print-farmer-identification.component';

const routes: Routes = [
  {
    path: '',
    component: FarmerListComponent,
  },
  {
    path: 'add-farmer',
    component: AddFarmerComponent,
  },
  {
    path: 'farmer-info/:id/:action',
    component: EditFarmerComponent,
  },
  {
    path: 'farmer-list',
    component: FarmerListComponent,
  },
];

@NgModule({
  entryComponents: [
    PrintFarmerIdentificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LocationModule,
    // Angular Material imports
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatPaginatorModule,
    FarmManagementPageModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    FarmerIdentificationComponent,
  ],
  providers: [TitleCasePipe],
  declarations: [
    FarmerManagementPage,
    FarmerListComponent,
    AddFarmerComponent,
    EditFarmerComponent,
    FarmerFormComponent,
    FarmerFilterComponent,
    FarmerFilterModalComponent,
    DownloadFarmerListModalComponent,
    FarmerFilterFeedbackComponent,
    FarmerViewListComponent,
    OfflineFarmerListModalComponent,
    PrintFarmerIdentificationComponent,
    FarmerIdentificationComponent,
  ],
})
export class FarmerManagementPageModule {}
