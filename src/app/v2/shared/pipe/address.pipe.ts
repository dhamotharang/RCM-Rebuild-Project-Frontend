import { Pipe, PipeTransform } from '@angular/core';
import { AddressApiModel } from 'src/app/location/models/api';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(value: AddressApiModel, ...args: any[]): any {
    return value ? `${value.barangay}, ${value.municipality}, ${value.province}, ${value.region}` : '';
  }

}
