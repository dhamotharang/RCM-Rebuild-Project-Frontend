import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RcmFormLocationComponent } from './components/rcm-form-location/rcm-form-location.component';
import * as PublicShared from '../../shared/shared.module';

@NgModule({
  declarations: [RcmFormLocationComponent],
  imports: [
    CommonModule,
    PublicShared.SharedModule
  ],
  exports: [RcmFormLocationComponent]
})
export class SharedModule { }
