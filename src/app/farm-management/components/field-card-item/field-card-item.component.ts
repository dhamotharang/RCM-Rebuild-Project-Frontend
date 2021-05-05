import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';

@Component({
  selector: 'app-field-card-item',
  templateUrl: './field-card-item.component.html',
  styleUrls: ['./field-card-item.component.scss'],
})
export class FieldCardItemComponent implements OnInit {

  @Input()
  public fieldInfo: FarmApiModel;

  @Output() public select = new EventEmitter();

  @ViewChild('fullAddressTooltip', { static: true}) fullAddressTooltip: MatTooltip;

  constructor() { }

  ngOnInit() {}

  public get addressLine1() {
    return `${this.fieldInfo.address.barangay ? this.fieldInfo.address.barangay + ',' : ''} ${this.fieldInfo.address.municipality}`
  }
  public get addressLine2() {
    return `${this.fieldInfo.address.province}, ${this.fieldInfo.address.region}`
  }

  public get fullAddress() {
    return `${this.addressLine1}, ${this.addressLine2}`;
  }

  public onCardItemClicked() {
    this.fullAddressTooltip.hide();
    setTimeout(() => {
      this.select.emit();
    })
  }
}
