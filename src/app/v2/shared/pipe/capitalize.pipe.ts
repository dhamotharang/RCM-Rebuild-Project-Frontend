import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {

    if (value != null){
      value = value.toLowerCase();
    } else{
      value = '';
    }
    return value.substring(0, 1).toUpperCase() + value.substring(1);
  }

}
