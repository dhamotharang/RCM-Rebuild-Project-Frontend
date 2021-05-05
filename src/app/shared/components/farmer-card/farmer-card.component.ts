import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
@Component({
  selector: 'app-farmer-card',
  templateUrl: './farmer-card.component.html',
  styleUrls: ['./farmer-card.component.scss'],
})
export class FarmerCardComponent implements OnInit {

  @Input() public farmerInfo: FarmerApiModel;
  @Output() public select = new EventEmitter<FarmerApiModel>();
  @ViewChild('dateRegisteredTooltip', {static: true}) dateRegisteredTooltip: MatTooltip;
  @ViewChild('dateRegisteredTooltipLabel', {static: true}) dateRegisteredTooltipLabel: MatTooltip;
  @ViewChild('fieldCountTooltip', {static: true}) fieldCountTooltip: MatTooltip;
  @ViewChild('farmerNameTooltip', {static: true}) farmerNameTooltip: MatTooltip;
  
  
  constructor() { }

  ngOnInit() {
  }

  public get farmerFullName() {
    return this.farmerInfo ? `${this.farmerInfo.first_name} ${this.farmerInfo.last_name}` : '';
  }

  public disableDateRegisteredTooltip: boolean = false;

  public onFarmerCardClick() {
    this.dateRegisteredTooltip.hide();
    this.dateRegisteredTooltipLabel.hide();
    this.fieldCountTooltip.hide();
    this.farmerNameTooltip.hide();
    setTimeout(() => {
      this.select.emit(this.farmerInfo);
    })
  }
}
