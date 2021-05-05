import { Pipe, PipeTransform } from '@angular/core';
import { Month } from 'src/app/v2/core/enums/month.enum';

@Pipe({
  name: 'month'
})
export class MonthPipe implements PipeTransform {

  transform(value: Date, ...args: any[]): any {
    if (!value) {
      return '';
    }
  
    let month = '';
    let monthId = value.getMonth() + 1;
    switch(monthId) {
      case Month.JANUARY:
        month = 'January';
        break;
      case Month.FEBRUARY:
        month = 'February';
        break;
      case Month.MARCH:
        month = 'March';
        break;
      case Month.APRIL:
        month = 'April';
        break;
      case Month.MAY:
        month = 'May';
        break;
      case Month.JUNE:
        month = 'June';
        break;
      case Month.JULY:
        month = 'July';
        break;
      case Month.AUGUST:
        month = 'August';
        break;
      case Month.SEPTEMBER:
        month = 'September';
        break;
      case Month.OCTOBER:
        month = 'October';
        break;
      case Month.NOVEMBER:
        month = 'November';
        break;
      case Month.DECEMBER:
        month = 'December';
        break;
      default:
        break;
    }
    return month;
  }

}
