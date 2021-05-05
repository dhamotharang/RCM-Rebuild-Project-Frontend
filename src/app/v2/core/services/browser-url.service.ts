import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BrowserUrlService {

  constructor(private location: Location, private router: Router, private route: ActivatedRoute) { }

  public upsertQueryParam(key: string, value: string) {
    const baseUrl = this.router.url.split('?');

    const queryStrings = window.location.search.replace('?', '');
    const queryStringKeyValues = queryStrings.split('&');

    let isNewKey = true;
    const updatedQueryStringParams = queryStringKeyValues.map((keyValueString:string) => {
      const keyValueArr = keyValueString.split('=');
      const currentKey = keyValueArr[0];
      if (currentKey === key) {
        isNewKey = false;
        return `${key}=${value}`;
      } else {
        return keyValueString;
      }
    }).filter(query => query);

    if (isNewKey) {
      updatedQueryStringParams.push(`${key}=${value}`);
    }


    this.location.go(baseUrl[0], `${updatedQueryStringParams.join('&')}`);
  }

  public removeQueryParam(key: string) {
    const baseUrl = this.router.url.split('?');

    const queryStrings = window.location.search.replace('?', '');
    const queryStringKeyValues = queryStrings.split('&');

    const updatedQueryStringParams = queryStringKeyValues.filter((keyValueString:string) => {
      const keyValueArr = keyValueString.split('=');
      const currentKey = keyValueArr[0];
      return currentKey !== key;
    });


    this.location.go(baseUrl[0], `${updatedQueryStringParams.join('&')}`);
  }

  public removeQueryParams(keys: string[]) {
    const baseUrl = this.router.url.split('?');

    const queryStrings = window.location.search.replace('?', '');
    const queryStringKeyValues = queryStrings.split('&');

    const updatedQueryStringParams = queryStringKeyValues.filter((keyValueString:string) => {
      const keyValueArr = keyValueString.split('=');
      const currentKey = keyValueArr[0];
      return keys.findIndex(key => key === currentKey) < 0;
    });


    this.location.go(baseUrl[0], `${updatedQueryStringParams.join('&')}`);
  }
  
  public getQueryStringValue(key: string) {
    const value = this.route.snapshot.queryParamMap.get(key);
    return value;
  }
}
