import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PageInfoModel } from '../../../v2/core/models/page-info.model';
import { PageEvent } from '@angular/material/paginator';
import { FilterModel } from '../../../core/models/filter.model';
import {FarmerQuickFilterEnum} from '../../../farmer-management/enums/filter.enum';
import {Role} from '../../../core/enum/role.enum';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { ConfigurationService } from '../../../v2/core/services/configuration.service';

@Component({
  selector: 'app-farmer-list',
  templateUrl: './farmer-list.component.html',
  styleUrls: ['./farmer-list.component.scss'],
})
export class FarmerListComponent implements OnInit {

  @Input() public set farmerList(value: FarmerApiModel[]) {
    if (value) {
      const farmers = [];
      value.forEach((f: FarmerApiModel) => {
        const farmer = { ...f };
        farmers.push(farmer);
      });

      this._farmerList = farmers;
    }
  }
  @Input() public pageInfo: PageInfoModel;
  @Input() public filters: FilterModel[];
  @Input() public showExternalFilter: boolean;
  @Input() public showLoader: boolean;
  @Input() public withFilters: boolean;
  @Input() public withCheckFilters: boolean;
  @Input() public filterData: any;
  @Input() public isDownload: boolean;
  @Input() public isOffline: boolean;
  @Input() public roleId: number;
  public readonly PUBLIC = Role.PUBLIC;

  @Output() public search = new EventEmitter<string>();
  @Output() public print = new EventEmitter<any>();
  @Output() public externalFilter = new EventEmitter<any>();
  @Output() public page = new EventEmitter<PageEvent>();
  @Output() public selectFarmer = new EventEmitter<FarmerApiModel>();
  @Output() public clearFilters = new EventEmitter<any>();
  @Output() public checkedFilter = new EventEmitter<FilterModel[]>();
  constructor(private configurationService: ConfigurationService) {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public listOfItemsPerPage: [];


  private _farmerList: FarmerApiModel[];
  public get farmerList(): FarmerApiModel[] {
    return this._farmerList;
  }

  public ngOnInit() {
    this.searchFormControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        debounceTime(600))
      .subscribe((res) => this.search.emit(res));
    this.listOfItemsPerPage = this.configurationService.getValue('itemsPerPage');
  }

  public searchFormControl = new FormControl();
  public unsubscribe = new Subject<any>();

  public shouldShowInterviewedByMeFilter(roleId: number, filterKey: number): boolean {
    return !(roleId === 5 && filterKey === FarmerQuickFilterEnum.InterviewedByMe);
  }

}
