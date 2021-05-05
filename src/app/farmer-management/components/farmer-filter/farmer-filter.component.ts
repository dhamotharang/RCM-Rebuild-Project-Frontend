import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LocationFormModel } from 'src/app/location/models/location-form.model';
import { FarmerFilterModel } from '../../models/farmer-filter.model';

@Component({
  selector: 'farmer-filter',
  templateUrl: './farmer-filter.component.html',
  styleUrls: ['./farmer-filter.component.scss'],
})
export class FarmerFilterComponent implements OnInit, OnDestroy {
  public today = new Date();
  constructor() {}

  @Input() debounceSearch: boolean;
  @Input() isOfflineModeEnabled: boolean;

  ngOnInit() {
    this.searchFormControl.setValue(this.farmerFilter.searchQuery);
    if (this.debounceSearch) {
      this.searchFormControl.valueChanges
        .pipe(takeUntil(this.unsubscribe), debounceTime(600))
        .subscribe((res) => {
          this.filterChange.emit({ ...this.farmerFilter, searchQuery: res });
        });
    } else {
      this.searchFormControl.valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.filterChange.emit({ ...this.farmerFilter, searchQuery: res });
        });
    }

    if (this.farmerFilter) {
      this.locationFilter = {
        regionId: this.farmerFilter.regionId,
        provinceId: this.farmerFilter.provinceId,
        municipalityId: this.farmerFilter.municipalId,
        barangayId: this.farmerFilter.barangayId,
      };
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private _farmerFilter: FarmerFilterModel = {};

  public locationFilter: LocationFormModel;

  @Input() public set farmerFilter(value: FarmerFilterModel) {
    if (value.regionId || value.interviewDateFrom || value.interviewDateTo) {
      this.advancedFilterVisible = true;
    }
    this._farmerFilter = value;
  }
  public get farmerFilter() {
    return this._farmerFilter;
  }

  public searchFormControl = new FormControl();
  public unsubscribe = new Subject<any>();

  @Output() filterChange = new EventEmitter<FarmerFilterModel>();

  public interviewedByMeChanged(value: boolean) {
    this.filterChange.emit({ ...this.farmerFilter, interviewedByMe: value });
  }

  public verifiedFieldChanged(value: boolean) {
    this.filterChange.emit({ ...this.farmerFilter, verifiedField: value });
  }

  public notVerifiedFieldChanged(value: boolean) {
    this.filterChange.emit({ ...this.farmerFilter, notVerifiedField: value });
  }

  public idGeneratedChanged(value: boolean) {
    this.filterChange.emit({ ...this.farmerFilter, idGenerated: value });
  }

  @Input()
  public advancedFilterVisible: boolean = false;

  public get locationModal(): LocationFormModel {
    return {
      regionId: this.farmerFilter.regionId ? this.farmerFilter.regionId : 0,
      provinceId: this.farmerFilter.provinceId
        ? this.farmerFilter.provinceId
        : 0,
      municipalityId: this.farmerFilter.municipalId
        ? this.farmerFilter.municipalId
        : 0,
      barangayId: this.farmerFilter.barangayId
        ? this.farmerFilter.barangayId
        : 0,
    };
  }

  public clearLocation() {
    this.onLocationChanged({
      regionId: null,
      provinceId: null,
      municipalityId: null,
      barangayId: null,
    });

    this.locationFilter = {
      regionId: null,
      provinceId: null,
      municipalityId: null,
      barangayId: null,
    };
  }

  public clearInterviewDates() {
    this.filterChange.emit({
      ...this.farmerFilter,
      interviewDateFrom: null,
      interviewDateTo: null,
    });
  }

  public onLocationChanged(value: LocationFormModel) {
    this.filterChange.emit({
      ...this.farmerFilter,
      regionId: value.regionId,
      regionName: value.regionName,
      provinceId: value.provinceId,
      provinceName: value.provinceName,
      municipalId: value.municipalityId,
      municipalityName: value.municipalityName,
      barangayId: value.barangayId,
      barangayName: value.barangayName,
    });
  }

}
