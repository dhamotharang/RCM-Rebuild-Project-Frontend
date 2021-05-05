import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import * as AdminSharedModule from './shared/shared.module';
import { DataAdminPage } from './data-admin.page';
import { FarmerDataPrivacyComponent } from './farmer-data-privacy/farmer-data-privacy.component';
import { DataAdminGuard } from 'src/app/v2/core/guards/data-admin.guard';
import { SharedModule as SharedModuleV2 } from 'src/app/v2/shared/shared.module';
import { ProfileButtonComponent } from './popover/profile-button/profile-button.component';
import { MenuComponent } from './popover/menu/menu.component';
import { FarmerManagementPageModule } from '../farmer-management/farmer-management.module';
import { LocationModule } from '../location/location.module';

const routes: Routes = [
  {
    path: '',
    component: DataAdminPage,
    children: [
      {
        path: '',
        redirectTo: 'farmer-management',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('src/app/data-admin/farmers/farmers.module').then(
            (m) => m.FarmersPageModule
          ),
      },
      {
        path: 'farmers',
        loadChildren: () =>
          import('src/app/data-admin/farmers/farmers.module').then(
            (m) => m.FarmersPageModule
          ),
      },
      {
        path: 'farmer-management',
        loadChildren: () =>
          import('src/app/farmer-management/farmer-management.module').then(
            (m) => m.FarmerManagementPageModule
          ),
      },
      {
        path: 'farm-management',
        loadChildren: () =>
          import('src/app/farm-management/farm-management.module').then(
            (m) => m.FarmManagementPageModule
          ),
      },
      {
        path: 'farmer-data',
        loadChildren: () =>
          import('src/app/data-admin/farmer-data/farmer-data.module').then(
            (m) => m.FarmerDataPageModule
          ),
      },
      {
        path: 'gpx-upload',
        loadChildren: () =>
          import('src/app/data-admin/upload-gpx/upload-gpx.module').then(
            (m) => m.UploadGpxPageModule
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('src/app/data-admin/admin/admin.module').then(
            (m) => m.AdminPageModule
          ),
        canActivate: [DataAdminGuard],
      },
      {
        path: 'data-privacy',
        loadChildren: () =>
          import('src/app/data-admin/data-privacy/data-privacy.module').then(
            (m) => m.DataPrivacyPageModule
          ),
      },
      {
        path: 'offline-management',
        loadChildren: () =>
          import('src/app/offline-management/offline-management.module').then(
            (m) => m.OfflineManagementPageModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('src/app/settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
      },
    ],
  },
];

@NgModule({
  entryComponents: [
    FarmerDataPrivacyComponent,
    ProfileButtonComponent,
    MenuComponent,
  ],
  imports: [
    SharedModule,
    SharedModuleV2,
    FarmerManagementPageModule,
    AdminSharedModule.SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    DataAdminPage,
    FarmerDataPrivacyComponent,
    ProfileButtonComponent,
    MenuComponent,
  ],
  exports: [FarmerDataPrivacyComponent],
})
export class DataAdminPageModule {}
