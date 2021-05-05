import { Dialect } from 'src/app/recommendation/enum/dialect.enum';
import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialectTranslationService {

  constructor() { }

  private dialect = 'english';

  dialectSelection(dialectUsed: number) {
    let dialect = 'english';
    
    switch (dialectUsed) {
      case Dialect.TAGALOG:
        dialect = 'filipino';
        break;
      case Dialect.ILUKO:
        dialect = 'iluko';
        break;
      case Dialect.BISAYA:
        dialect = 'bisaya';
        break;
    }

    return dialect;
  }

  setDialectSelected(dialect: string) {
    this.dialect = dialect;
  }

  getDialectSelected() {
    return this.dialect;
  }

  getDialectTranslation(lang: string): Observable<any> {
    return from(import(`../../../../src/assets/i18n/${lang}.json`));
  }
}
