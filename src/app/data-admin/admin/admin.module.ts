import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminPage } from './admin.page';
import { SharedModule } from '../../shared/shared.module';
import * as AdminSharedModule from '../shared/shared.module';
import {SharedModule as SharedModuleV2} from '../../v2/shared/shared.module';
import { LocationModule } from 'src/app/location/location.module';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LocationModule,
        RouterModule.forChild(routes),
        SharedModule,
        AdminSharedModule.SharedModule,
        SharedModuleV2,
    ],
  declarations: [AdminPage]
})
export class AdminPageModule {}
