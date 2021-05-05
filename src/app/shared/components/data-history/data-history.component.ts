import { Component, OnInit, Input } from '@angular/core';
import { DataHistory, DataHistoryModule, DataHistoryType } from '../../../v2/core/enums/data-history.enum';
import { PhoneOwner } from '../../../farmer-management/enums/phone-owner.enum';
import { FieldOwner } from 'src/app/v2/core/enums/field-ownership.enum';
import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';

@Component({
  selector: 'app-data-history',
  templateUrl: './data-history.component.html',
  styleUrls: ['./data-history.component.scss'],
})
export class DataHistoryComponent implements OnInit {

  @Input() dataHistories;
  @Input() showLoader;

  
  duration: number = 3000;

  constructor() { }

  ngOnInit() { }

  get dataHistoryDataText() { return DataHistory; }
  get dataHistoryTypeText() { return DataHistoryType; }
  get dataHistoryModuleText() { return DataHistoryModule; }
  get phoneOwnerText() { return PhoneOwner; }
  get fieldOwnerText() { return FieldOwner; }
  get yesNoText() { return YesNo; }

  public getValue(recipient) {
    let val = '';
    if (recipient.value === null) {
      val = 'empty';
    } else {
      if (recipient.key === 'phone_owner' || recipient.key === 'alternative_phone_owner') {
        val = this.phoneOwnerText[recipient.value];
      } else if (recipient.key === 'data_privacy_consent') {
        val = 'replaced data_privacy_consent';
      } else if (recipient.key === 'photo') {
        val = 'replaced photo';
      } else if (recipient.key === 'field_ownership') {
        val = this.fieldOwnerText[recipient.value];
      } else if (recipient.key === 'field_member_org') {
        val = this.yesNoText[recipient.value];
      } else {
        val = recipient.value;
      }
    }
    return val;
  }

}
