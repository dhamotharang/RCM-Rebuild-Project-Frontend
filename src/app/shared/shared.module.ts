import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// material
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { IonicModule } from '@ionic/angular';
import { TooltipsModule } from 'ionic-tooltips';

import { ImageCropperModule } from 'ngx-image-cropper';

import { AgmCoreModule } from '@agm/core';

import { environment } from 'src/environments/environment';

import { FarmerCardComponent } from './components/farmer-card/farmer-card.component';
import { FarmerListComponent } from './components/farmer-list/farmer-list.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { UnmatchedPathComponent } from './components/unmatched-path/unmatched-path.component';
import { LogComponent } from './components/log/log.component';
import { DataEditComponent } from './components/data-edit/data-edit.component';
import { DataHistoryComponent } from './components/data-history/data-history.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { GpxMapComponent } from './components/gpx-map/gpx-map.component';
import { PhLocationFormComponent } from './components/ph-location-form/ph-location-form.component';
import { GpxUploadComponent } from './components/gpx-upload/gpx-upload.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DataPrivacyComponent } from './components/data-privacy/data-privacy.component';
import { SelectableComponent } from './components/selectable/selectable.component';
import { DisableDirective } from './directives/disable.directive';

@NgModule({
  entryComponents: [ImageCropperComponent],
  declarations: [
    FarmerListComponent,
    FarmerCardComponent,
    // FarmerIdentificationComponent,
    ImageCropperComponent,
    UnauthorizedComponent,
    UnmatchedPathComponent,
    UnauthorizedComponent,
    LogComponent,
    DataEditComponent,
    DataHistoryComponent,
    FileUploadComponent,
    GpxMapComponent,
    PhLocationFormComponent,
    GpxUploadComponent,
    LoaderComponent,
    DataPrivacyComponent,
    SelectableComponent,
    DisableDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TooltipsModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
    MatSelectModule,
    ImageCropperModule,
    MatNativeDateModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressBarModule,
    NgxMatSelectSearchModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey,
      libraries: ['drawing'],
    }),
    MatCheckboxModule,
    MatTableModule,
    MatSortModule
  ],
  exports: [
    LoaderComponent,
    FarmerListComponent,
    FarmerCardComponent,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    // FarmerIdentificationComponent,
    ImageCropperComponent,
    DataEditComponent,
    DataHistoryComponent,
    FileUploadComponent,
    GpxMapComponent,
    PhLocationFormComponent,
    GpxUploadComponent,
    MatTooltipModule,
    MatProgressBarModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    DataPrivacyComponent,
    SelectableComponent,
    DisableDirective
  ],
})
export class SharedModule {}
