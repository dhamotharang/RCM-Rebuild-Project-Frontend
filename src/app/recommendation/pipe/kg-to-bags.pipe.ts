import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kgToBags'
})
export class KgToBagsPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    let defaultValue = '';
    let bagLabel = 'bag';
    let bagLabelPlural = 'bags';
    let coordinatingConjunction = 'and';
    let kgLabel = 'kg';

    if (args && args.length > 0) {
      if (typeof args[0] !== 'undefined') {
        defaultValue = args[0];
      }

      if (typeof args[1] !== 'undefined') {
        bagLabel = args[1];
      }

      if (typeof args[2] !== 'undefined') {
        coordinatingConjunction = args[2];
      }

      if (typeof args[3] !== 'undefined') {
        kgLabel = args[3];
      }

      if (typeof args[4] !== 'undefined') {
        bagLabelPlural = args[4];
      }
    }
    if (value) {
      if (value < 50) {
        return `${Math.round(value)} ${kgLabel}`;
      } else {
        const bagCount = Math.floor(value / 50);
        let convertedValue = '';
        if (bagCount > 1) {
          bagLabel = bagLabelPlural;
        }

        const kgValue = value - (bagCount * 50);
        if (kgValue > 0.5) {
          convertedValue = `${bagCount} ${bagLabel} ${coordinatingConjunction} ${Math.round(kgValue)} ${kgLabel}`;
        } else {
          convertedValue = `${bagCount} ${bagLabel}`;
        }

        return convertedValue;
      }
    } else {
      return defaultValue;
    }
  }

}
