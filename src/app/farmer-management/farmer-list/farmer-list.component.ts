import { NavigationEnd, Router } from '@angular/router';
import { AlertNotificationService } from 'src/app/v2/core/services/alert-notification.service';
import { ModalController } from '@ionic/angular';
import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { PageInfoModel } from 'src/app/v2/core/models/page-info.model';
import { BrowserUrlService } from 'src/app/v2/core/services/browser-url.service';
import { FarmerFilterModel } from '../models/farmer-filter.model';
import { FarmerModel } from '../models/farmer.model';
import { FarmerFilterService } from '../services/farmer-filter.service';
import { FarmerService } from '../services/farmer.service';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { FarmerAndFieldStorageService } from 'src/app/offline-management/services/farmer-and-field-storage.service';
import { HostListener } from '@angular/core';
import { LocationService } from 'src/app/location/service/location.service';
import { OfflineFarmerListModalComponent } from 'src/app/farmer-management/modals/offline-farmer-list-modal/offline-farmer-list-modal.component';
import {ConfigurationService} from '../../v2/core/services/configuration.service';
import { FieldService } from "src/app/farm-management/services/field.service";
import { FarmerQuickFilterEnum } from "src/app/farmer-management/enums/filter.enum";
@Component({
  selector: 'app-farmer-list',
  templateUrl: './farmer-list.component.html',
  styleUrls: ['./farmer-list.component.scss'],
})
export class FarmerListComponent implements OnInit {

  constructor(
    private farmerService: FarmerService,
    private browserUrlService: BrowserUrlService,
    private authService: AuthenticationService,
    private farmerFilterService: FarmerFilterService,
    private offlineStorageService: OfflineStorageService,
    private farmerLocalStorageService: FarmerAndFieldStorageService,
    private locationService: LocationService,
    private modalController: ModalController,
    private alertNotificationService: AlertNotificationService,
    private router: Router,
    private configurationService: ConfigurationService,
    private fieldService: FieldService
  ) {}

  public farmerDataFetchComplete = false;
  public farmerList: FarmerModel[] = [];

  public pageInfo: PageInfoModel = {
    pageIndex: 0,
    pageSize: 5,
  };

  public roleId: number = 0;

  public farmerFilter: FarmerFilterModel = {};
  public isOfflineModeEnabled = false;

  public listType = 'grid';
  public screenWidth: number;
  public listOfItemsPerPage;

  public totalFieldCount;
  public totalVerifiedFieldCount;
  public totalUnverifiedFieldCount;
  
  async ngOnInit() {
    this.listOfItemsPerPage = this.configurationService.getValue('itemsPerPage');
    this.isOfflineModeEnabled = await this.offlineStorageService.getOfflineMode();
    this.roleId = this.authService.loggedInUser.gao;
    this.farmerFilter = {
      interviewedByMe:
        this.browserUrlService.getQueryStringValue('interviewedByMe') ===
        'true',
      verifiedField:
        this.browserUrlService.getQueryStringValue('verifiedField') === 'true',
      notVerifiedField:
        this.browserUrlService.getQueryStringValue('notVerifiedField') ===
        'true',
      idGenerated:
        this.browserUrlService.getQueryStringValue('idGenerated') === 'true',
      searchQuery: this.browserUrlService.getQueryStringValue('search'),
      regionId: this.browserUrlService.getQueryStringValue('regionId')
        ? parseInt(this.browserUrlService.getQueryStringValue('regionId'))
        : null,
      provinceId: this.browserUrlService.getQueryStringValue('provinceId')
        ? parseInt(this.browserUrlService.getQueryStringValue('provinceId'))
        : null,
      municipalId: this.browserUrlService.getQueryStringValue('municipalId')
        ? parseInt(this.browserUrlService.getQueryStringValue('municipalId'))
        : null,
      barangayId: this.browserUrlService.getQueryStringValue('barangayId')
        ? parseInt(this.browserUrlService.getQueryStringValue('barangayId'))
        : null,
      interviewDateFrom: this.browserUrlService.getQueryStringValue(
        'interviewDateFrom'
      )
        ? new Date(
            this.browserUrlService.getQueryStringValue('interviewDateFrom')
          )
        : null,
      interviewDateTo: this.browserUrlService.getQueryStringValue(
        'interviewDateTo'
      )
        ? new Date(
            this.browserUrlService.getQueryStringValue('interviewDateTo')
          )
        : null,
    };

    if (this.farmerFilter.regionId && !this.farmerFilter.barangayId) {
      this.farmerFilter = {
        ...this.farmerFilter,
        barangayId: -1,
      };
    }

    const pageIndex = this.browserUrlService.getQueryStringValue('page')
      ? parseInt(this.browserUrlService.getQueryStringValue('page'))
      : 0;

    const itemsPerPage = this.browserUrlService.getQueryStringValue(
      'itemsPerPage'
    )
      ? this.selectionOfItemsPerPage(this.browserUrlService.getQueryStringValue('itemsPerPage'))
      : 5;
    this.browserUrlService.upsertQueryParam('itemsPerPage', itemsPerPage.toString());
    this.pageInfo = { ...this.pageInfo, pageIndex, pageSize: itemsPerPage };

    if (
      !this.isOfflineModeEnabled &&
      this.farmerFilter.regionId &&
      this.farmerFilter.provinceId &&
      this.farmerFilter.municipalId
    ) {
      this.locationService
        .getLocationName(
          this.farmerFilter.regionId,
          this.farmerFilter.provinceId,
          this.farmerFilter.municipalId
        )
        .pipe(take(1))
        .subscribe((locationNames) => {
          this.farmerFilter = {
            ...this.farmerFilter,
            regionName: locationNames.regionName,
            provinceName: locationNames.provinceName,
            municipalityName: locationNames.municipalityName,
            barangayName: locationNames.barangayName
          };
        });
    }
  }

  private selectionOfItemsPerPage(value: string): number {
    const itemsPerPage = parseInt(value, 10);
    const listOfItemsPerPage = this.listOfItemsPerPage;
    if (!listOfItemsPerPage.includes(itemsPerPage)) {
      const FIVE = 0;
      return listOfItemsPerPage[FIVE];
    } else {
      return itemsPerPage;
    }
  }

  async ionViewDidEnter() {
    this.destroy$ = new Subject<boolean>();
    this.isOfflineModeEnabled = await this.offlineStorageService.getOfflineMode();
    this.farmerFilterService.update(this.farmerFilter);
    this.farmerFilterService.farmerFilter
      .pipe(takeUntil(this.destroy$))
      .subscribe((farmerFilter) => {
        this.updateBrowserUrlFilters(farmerFilter);
        this.farmerFilter = farmerFilter;
        this.queryFarmers();
      });


    
  }

  ionViewWillLeave() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onClearFilter() {
    this.farmerFilterService.update({});
    this.farmerFilterService.clearQueryParams();
  }

  ngOnDestroy() {

  }
  private destroy$: Subject<boolean>;
  public pageChanged(pageEvent: PageEvent) {
    this.pageInfo = { ...pageEvent };
    this.updateBrowserUrlPagination(pageEvent);
    this.queryFarmers();
  }

  public async queryFarmers() {

    if (this.isOfflineModeEnabled) {
      const farmerListOffline = await this.farmerLocalStorageService.getFarmerDashboardData(
        this.pageInfo.pageIndex,
        this.pageInfo.pageSize,
        this.farmerFilter
      );
      const farmersOffline = farmerListOffline.farmers.map(async (farmer) => {
        
        const farmerData = await this.farmerLocalStorageService.getFarmerPageInfoData(farmer.id == null ? farmer.offline_id : farmer.id);
        const farmLotCount = farmerData.fields.length;

        const offlineFarmerList = {
          id: farmerData.id == null ? farmerData.offline_id : farmerData.id,
          farmerId: farmerData.farmer_id,
          firstName: farmerData.first_name,
          lastName: farmerData.last_name,
          middleName: farmerData.middle_name,
          suffixName: farmerData.last_name,
          createdDate: farmerData.created_at,
          farmerPhotoBase64: farmerData.photo,
          farmLotCount: farmLotCount,
          offlineId: farmerData.offline_id,
        } as FarmerModel;

        return offlineFarmerList;
      });

      Promise.all(farmersOffline).then(offlineFarmers => this.farmerList = offlineFarmers);

      this.pageInfo = {
        ...this.pageInfo,
        length: farmerListOffline.totalResultCount,
      };
    } else {
      this.farmerService
        .queryFarmers(this.farmerFilter, this.pageInfo, this.roleId)
        .pipe(take(1))
        .subscribe((res) => {
          this.farmerList = res.farmers;
          this.pageInfo = { ...this.pageInfo, length: res.totalResultCount };

          if (!this.farmerDataFetchComplete) {
            this.farmerDataFetchComplete = true;
          }
        });

      this.fieldService.getTotalFieldCount(this.authService.loggedInUser.gao)
        .pipe(takeUntil(this.destroy$))
        .subscribe((fields) => {
          this.totalFieldCount = fields.totalResultCount;
        });
        
      this.fieldService.getTotalIsVerifiedFieldCount(this.authService.loggedInUser.gao, FarmerQuickFilterEnum.VerifiedField)
        .pipe(takeUntil(this.destroy$))
        .subscribe((fields) => {
          this.totalVerifiedFieldCount = fields.totalResultCount;
        });
  
      this.fieldService.getTotalIsVerifiedFieldCount(this.authService.loggedInUser.gao, FarmerQuickFilterEnum.NotVerifiedField)
        .pipe(takeUntil(this.destroy$))
        .subscribe((fields) => {
          this.totalUnverifiedFieldCount = fields.totalResultCount;
        });
    }
  }

  public farmerFilterChanged(filter: FarmerFilterModel) {
    this.farmerFilterService.update(filter);
  }

  private updateBrowserUrlFilters(
    farmerFilter: FarmerFilterModel
  ) {
    if (farmerFilter) {
      if (farmerFilter.interviewedByMe) {
        this.browserUrlService.upsertQueryParam(
          'interviewedByMe',
          farmerFilter.interviewedByMe.toString()
        );
      }

      if (farmerFilter.verifiedField) {
        this.browserUrlService.upsertQueryParam(
          'verifiedField',
          farmerFilter.verifiedField.toString()
        );
      }

      if (farmerFilter.notVerifiedField) {
        this.browserUrlService.upsertQueryParam(
          'notVerifiedField',
          farmerFilter.notVerifiedField.toString()
        );
      }

      if (farmerFilter.idGenerated) {
        this.browserUrlService.upsertQueryParam(
          'idGenerated',
          farmerFilter.idGenerated.toString()
        );
      }

      // TO DO: Check for SQL Injection vulnerability
      if (farmerFilter.searchQuery) {
        this.browserUrlService.upsertQueryParam(
          'search',
          farmerFilter.searchQuery
        );
      }

      if (farmerFilter.regionId) {
        this.browserUrlService.upsertQueryParam(
          'regionId',
          farmerFilter.regionId.toString()
        );

        if (farmerFilter.provinceId) {
          this.browserUrlService.upsertQueryParam(
            'provinceId',
            farmerFilter.provinceId.toString()
          );

          if (farmerFilter.municipalId) {
            this.browserUrlService.upsertQueryParam(
              'municipalId',
              farmerFilter.municipalId.toString()
            );

            if (farmerFilter.barangayId && farmerFilter.barangayId !== -1) {
              this.browserUrlService.upsertQueryParam(
                'barangayId',
                farmerFilter.barangayId.toString()
              );
            }
          }
        }
      }

      if (farmerFilter.interviewDateFrom) {
        this.browserUrlService.upsertQueryParam(
          'interviewDateFrom',
          formatDate(farmerFilter.interviewDateFrom, 'yyyy-MM-dd', 'en-US')
        );
      }

      if (farmerFilter.interviewDateTo) {
        this.browserUrlService.upsertQueryParam(
          'interviewDateTo',
          formatDate(farmerFilter.interviewDateTo, 'yyyy-MM-dd', 'en-US')
        );
      }
    }
  }

  private updateBrowserUrlPagination(page: PageEvent) {
    const currentPage = page.pageIndex;

    this.browserUrlService.upsertQueryParam('page', currentPage.toString());
    this.browserUrlService.upsertQueryParam(
      'itemsPerPage',
      page.pageSize.toString()
    );
  }

  public doRefresh(event) {
    this.queryFarmers();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  public get isGridView(): boolean {
    return this.listType === 'grid';
  }

  public get isListView(): boolean {
    return this.listType === 'table';
  }

  public onListTypeChange(e: Event, listType: string) {
    e.preventDefault();
    this.listType = listType;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    const screenSizeLimit = 768;
    if (this.screenWidth <= screenSizeLimit) {
      this.onListTypeChange(event, 'grid');
    }
  }

  public async openOfflineFarmerListModal() {
    const farmers = await this.farmerLocalStorageService.getOfflineFarmers();
    
    if (farmers && farmers.length > 0) {
      let offlineFarmers: FarmerModel[] = [];

      for(let farmer of farmers) {
        this.farmerLocalStorageService.getFarmerFieldsDataByOfflineId(farmer.offline_id).then((fields)=>{
          farmer = {...farmer, field_count: fields.length}
          offlineFarmers.push(this.farmerService.mapFarmerApiToFarmerModel(farmer));
        });
      }
  
      const modal = await this.modalController.create({
        component: OfflineFarmerListModalComponent,
        componentProps: {
          isGridView: this.isGridView,
          isListView: this.isListView,
          farmerList: offlineFarmers
        }
      });

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          modal.dismiss();
        }
      });

      return await modal.present();  
    
    } else {
      this.alertNotificationService.showAlert(
        'No offline added farmers to show',
        'Offline Farmers'
      );
    }
  }

}
