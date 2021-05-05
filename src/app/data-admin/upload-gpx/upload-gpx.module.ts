import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UploadGpxPage } from './upload-gpx.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpxInfoComponent } from './gpx-info/gpx-info.component';

const routes: Routes = [
  {
    path: '',
    component: UploadGpxPage
  },
  {
    path: ':id',
    component: GpxInfoComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UploadGpxPage, GpxInfoComponent]
})
export class UploadGpxPageModule {}
