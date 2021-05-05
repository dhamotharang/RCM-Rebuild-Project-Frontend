import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundUp'
})
export class RoundUpPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    if(isNaN(value)){
      return 0;
    }
    return Math.ceil(value); 
  }

}
