import { Pipe, PipeTransform } from '@angular/core';
import { AddressApiModel } from 'src/app/location/models/api';

@Pipe({
  name: 'address'
})

/**
 * @deprecated Use AddressPipe in v2 folder instead
 */
export class AddressPipe implements PipeTransform {

  transform(value: AddressApiModel, ...args: any[]): any {
    return value ? `${value.barangay}, ${value.municipality}, ${value.province}, ${value.region}` : '';
  }

}
