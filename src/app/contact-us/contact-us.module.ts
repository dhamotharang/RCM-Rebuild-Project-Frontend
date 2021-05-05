import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

import { IonicModule } from '@ionic/angular';

import { ContactUsPage } from './contact-us.page';
import { LocationModule } from '../location/location.module';
import { SharedModule } from '../v2/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ContactUsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    LocationModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContactUsPage]
})
export class ContactUsPageModule {}
