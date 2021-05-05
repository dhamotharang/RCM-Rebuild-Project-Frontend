import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { GhostButtonComponent } from './components/ghost-button/ghost-button.component';
import { ItemFormLabelComponent } from './components/item-form-label/item-form-label.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import {AddressPipe} from './pipe/address.pipe';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {TwoDigitDecimalDirective} from './directives/two-digit-decimal.directive';
import {DisableRightClickDirective} from './directives/disable-right-click.directive';
import {ErrorComponent} from './components/error/error.component';
import { CapitalizePipe } from './pipe/capitalize.pipe';
import { DisableDirective } from './directives/disable.directive';
import {MatInputModule} from '@angular/material/input';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatTooltipModule} from '@angular/material/tooltip';



@NgModule({
  declarations: [
      HeaderComponent,
      GhostButtonComponent,
      ItemFormLabelComponent,
      ImageCropperComponent,
      DatepickerComponent,
      ErrorComponent,
      TwoDigitDecimalDirective,
      DisableRightClickDirective,
      DisableDirective,
      AddressPipe,
      CapitalizePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ImageCropperModule,

    // material
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
  ],
  exports: [
      MatFormFieldModule,
      MatSelectModule,
      MatDatepickerModule,
      MatInputModule,
      ReactiveFormsModule,
      HeaderComponent,
      GhostButtonComponent,
      ItemFormLabelComponent,
      ImageCropperComponent,
      DatepickerComponent,
      ErrorComponent,
      TwoDigitDecimalDirective,
      DisableRightClickDirective,
      DisableDirective,
      AddressPipe,
      CapitalizePipe,
      NgxMatSelectSearchModule,
      MatTooltipModule,
  ], providers: [
        AddressPipe,
        CapitalizePipe
    ]
})
export class SharedModule { }
