import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BrowserUrlService } from 'src/app/v2/core/services/browser-url.service';
import { FarmerFilterModel } from '../models/farmer-filter.model';

@Injectable({
  providedIn: 'root'
})
export class FarmerFilterService implements OnDestroy {
  public farmerFilter = new BehaviorSubject<FarmerFilterModel>({});;
  public farmerFilterSnapshot: FarmerFilterModel = {};

  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private browserUrlService: BrowserUrlService) { 
    
    this.farmerFilter.pipe(takeUntil(this.destroy$))
      .subscribe((filterData) => {
        this.farmerFilterSnapshot = filterData;
      })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  public update(filter: FarmerFilterModel) {
    this.farmerFilter.next(filter);
  }

  public clearQueryParams() {
    this.browserUrlService.removeQueryParams([
      'regionId',
      'provinceId',
      'municipalId',
      'barangayId',
      'interviewedByMe',
      'verifiedField',
      'notVerifiedField',
      'idGenerated',
      'interviewDateFrom',
      'interviewDateTo',
    ]);
  }
}
