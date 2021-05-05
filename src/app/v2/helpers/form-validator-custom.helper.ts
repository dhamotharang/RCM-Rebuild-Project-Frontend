import { AbstractControl } from '@angular/forms';

export function isMobileNumberPrefixValid(mobileNum: string) {
  const mobileNumberLength = mobileNum?.length;

  if(!mobileNum && mobileNumberLength === 11 && mobileNum.charAt(0) !== '0' ) {
    return { 'invalidMobileNumberPrefix': true };
  }

  return null;
}

export function isMobileNumberLengthValid(mobileNum: string) {
  const mobileNumberLength = mobileNum?.length;
  const validMobileLength = mobileNum && mobileNum.charAt(0) !== '0' ? 10 : 11;
  
  if (!mobileNum || mobileNumberLength === validMobileLength) {
    return null;
  }

  return { 'invalidMobileNumberLength': true };
}

export function mobileNumberPrefixValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    return isMobileNumberPrefixValid(control.value);
  }
  
export function mobileNumberLengthValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    return isMobileNumberLengthValid(control.value);
  }
  