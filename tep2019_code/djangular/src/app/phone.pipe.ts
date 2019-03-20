import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumberFromString } from 'libphonenumber-js'

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(phoneNumber: string, args?: string): any {
    if (!phoneNumber) {
      return phoneNumber;
    }
    return parsePhoneNumberFromString(phoneNumber, 'US').formatNational();
  }

}
// adapted from https://medium.com/@Pierre_anthill/angular-2-4-pretty-phone-number-pipe-2da3fab8fe6e