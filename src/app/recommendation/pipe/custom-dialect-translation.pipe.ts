import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { DialectTranslationService } from 'src/app/recommendation/services/dialect-translation.service';

@Pipe({
  name: 'customDialectTranslation'
})
export class CustomDialectTranslationPipe implements PipeTransform {

  constructor(
    private dialectTranslationService: DialectTranslationService,
  ) {}

  transform(value: String, ...args: any[]): any {
    const translationObject = this.dialectTranslationService.getDialectTranslation(args[0]);

    const getValueByKeys = (obj, keys) => {
      let value: string;
      keys.forEach((k) => {
        if (value) {
          value = value[k];
        } else {
          value = obj[k];
        }
      })

      return value;
    }

    return translationObject.pipe(
      map((data: any) => {
        if (data.default) {
          const langKeys = value.split('.');
          return getValueByKeys(data.default, langKeys);
        }

        return null;
      })
    );
  }

}
