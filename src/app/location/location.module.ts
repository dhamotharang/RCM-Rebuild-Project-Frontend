import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressFormControlComponent } from './address-form-control/address-form-control.component';
import { AddressFormComponent } from './component/address-form/address-form.component';
import { SharedModule } from '../v2/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { AddressFormControlDemoComponent } from './address-form-control-demo/address-form-control-demo.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'demo',
    component: AddressFormControlDemoComponent,
  },
];


// Location module is designed to be imported by different forms as a reusable control helper that provides selection
// for region, province, municipality and barangay
@NgModule({
  declarations: [AddressFormControlComponent, AddressFormComponent, AddressFormControlDemoComponent],
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  exports: [AddressFormControlComponent],
})
export class LocationModule { }
