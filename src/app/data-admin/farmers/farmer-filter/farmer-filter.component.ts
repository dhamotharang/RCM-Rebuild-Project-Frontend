import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { PhLocation, RcmFormLocationComponent } from '../../shared/components/rcm-form-location/rcm-form-location.component';
import { FarmerFilterModel } from 'src/app/core/models/filter.model';
import { AddressApiModel } from 'src/app/location/models/api';

@Component({
  selector: 'app-farmer-filter',
  templateUrl: './farmer-filter.component.html',
  styleUrls: ['./farmer-filter.component.scss'],
})
export class FarmerFilterComponent implements OnInit {

  @Input() locationAddress: AddressApiModel;
  @Input() userGao: number;
  @Input() filterData: FarmerFilterModel;
  @Input() withFilters: boolean;

  @ViewChild('rcmLocationForm') rcmLocationForm: RcmFormLocationComponent;

  constructor(
    private modalController: ModalController) { }

  public ngOnInit() {

  }

  private maxYear = 0;
  private minYear = 5;

  public minDate: string;

  public dateToday = new Date();
  public fromDate = new Date();

  public searchFilterForm = new FormGroup({
    fromDate: new FormControl(null),
    toDate: new FormControl(null)
  });

  public phLocationModel: PhLocation;

  public ionViewDidEnter() {

    this.searchFilterForm.controls.region.setValidators(null);
    this.searchFilterForm.controls.province.setValidators(null);
    this.searchFilterForm.controls.municipality.setValidators(null);
    this.searchFilterForm.controls.barangay.setValidators(null);

    if (this.withFilters) {
      this.searchFilterForm.controls.region.setValue(this.filterData.region_id);
      this.searchFilterForm.controls.province.setValue(this.filterData.province_id);
      this.searchFilterForm.controls.municipality.setValue(this.filterData.municipality_id);
      this.searchFilterForm.controls.barangay.setValue(this.filterData.barangay_id);

      this.searchFilterForm.controls.fromDate.setValue(this.filterData.fromDate ? new Date(this.filterData.fromDate) : null);
      this.searchFilterForm.controls.toDate.setValue(this.filterData.toDate ? new Date(this.filterData.toDate) : null);
      this.fromDate = this.searchFilterForm.controls.fromDate.value;
    }
  }

  public async onPhLocationChange(model: PhLocation) {
    this.phLocationModel = model;
  }


  public onFilterClick() {
    const searchFormValues = this.searchFilterForm.getRawValue();
    this.modalController.dismiss(searchFormValues);
  }

  public closeFilter() {
    this.modalController.dismiss();
  }

  public setDatePicker() {
    const dayMin = "01";
    const monthMin = "01";

    const yearMin = this.dateToday.getFullYear() - this.maxYear - this.minYear;

    this.minDate = yearMin + "-" + monthMin + "-" + dayMin;
  }

  public clearDate() {
    this.searchFilterForm.controls.fromDate.setValue(null);
    this.searchFilterForm.controls.toDate.setValue(null);
  }

  public onFromDateChange(event): void {
    this.fromDate = event;
    this.searchFilterForm.controls.toDate.setValue(null);
  }

  public clearLocation() {
    this.rcmLocationForm.clear();
  }

}
