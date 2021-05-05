import { Injectable } from '@angular/core';
import { Season } from '../../enum/season.enum';
import { Month } from '../../../v2/core/enums/month.enum';

@Injectable({
  providedIn: 'root',
})
export class SeasonService {
  constructor() {}

  computeSeason(sowingDate: Date): Season {
    if (!!sowingDate) {
      const date = new Date(sowingDate);
      const monthId = date.getMonth() + 1;

      if (
        monthId === Month.NOVEMBER ||
        monthId === Month.DECEMBER ||
        monthId === Month.JANUARY ||
        monthId === Month.FEBRUARY ||
        monthId === Month.MARCH ||
        monthId === Month.APRIL
      ) {
        return Season.WET;
      } else {
        return Season.DRY;
      }
    } else {
        return 0;
    }
  }
}
