import { Pipe, PipeTransform } from '@angular/core';
import { WaterSource } from 'src/app/recommendation/enum/water-source.enum';

@Pipe({
  name: 'irrigationLabel'
})
export class IrrigationLabelPipe implements PipeTransform {

  transform(value: WaterSource, ...args: any[]): any {
    return value === WaterSource.IRRIGATED ? 'Irrigated' : value === WaterSource.RAINFED ? 'RAINFED' : '';
  }

}
