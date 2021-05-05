import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FarmerFilterModel } from '../../models/farmer-filter.model';

@Component({
  selector: 'app-farmer-filter-feedback',
  templateUrl: './farmer-filter-feedback.component.html',
  styleUrls: ['./farmer-filter-feedback.component.scss'],
})
export class FarmerFilterFeedbackComponent implements OnInit {
  constructor() {}

  @Input() farmerFilter: FarmerFilterModel = {};

  @Output() public clearFilters = new EventEmitter();

  ngOnInit() {}

  public get hasQuickFilters() {
    if (this.farmerFilter) {
      return (
        this.farmerFilter.interviewedByMe === true ||
        this.farmerFilter.notVerifiedField === true ||
        this.farmerFilter.verifiedField === true ||
        this.farmerFilter.idGenerated === true
      );
    }
    return false;
  }

  public get hasAdvancedFilters() {
    if (this.farmerFilter) {
      return (
        (this.farmerFilter.regionId &&
          this.farmerFilter.provinceId &&
          this.farmerFilter.municipalId) ||
        (this.farmerFilter.interviewDateFrom &&
          this.farmerFilter.interviewDateTo)
      );
    }
    return false;
  }

  public get hasActiveFilter() {
    return this.hasQuickFilters || this.hasAdvancedFilters;
  }
}
