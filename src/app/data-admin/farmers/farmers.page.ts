import { LocationFormModel } from 'src/app/location/models/location-form.model';
import { AlertService } from './../../core/services/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { FarmerService } from '../../core/services/farmer.service';
import { take } from 'rxjs/operators';
import { FilterModel, InitFilters, FarmerFilterModel } from '../../core/models/filter.model';
import { ModalController, AlertController } from '@ionic/angular';
import { FarmerFilterComponent } from './farmer-filter/farmer-filter.component';
import { PageInfoModel } from '../../v2/core/models/page-info.model';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { FarmerListResultApiModel } from '../../farmer-management/models/api/farmer-list-result.model';
import { PageEvent } from '@angular/material/paginator';
import { formatDate } from '@angular/common';
import { Role } from 'src/app/v2/core/enums/role.enum';
import { LocationService } from 'src/app/core/services/location.service';
import { RegionModel } from 'src/app/core/models/region.model';
import { ProvinceModel } from 'src/app/core/models/province.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DataHistoryService } from 'src/app/v2/core/services/data-history.service';
import { DataHistoryType, DataHistoryModule } from 'src/app/v2/core/enums/data-history.enum';
import { Router } from '@angular/router';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { LoaderOverlayService } from 'src/app/v2/core/services/loader-overlay.service';
import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';
import { AddressApiModel } from 'src/app/location/models/api';
import {BrowserUrlService} from 'src/app/v2/core/services/browser-url.service';
import { ConfigurationService } from '../../v2/core/services/configuration.service';

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.page.html',
  styleUrls: ['./farmers.page.scss'],
})
export class FarmersPage implements OnInit {

  public loggedInUser: UserLoginModel;
  public isFetchingFarmerList: boolean;

  private filterAddress: LocationFormModel;
  public withFilters: boolean = false;
  public withCheckFilters: boolean = false;
  public isDownload: boolean = false;
  public fromDate: string;
  public toDate: string;
  public filterCheckedKey: string;
  public filterCheckedLabel: string;
  public filterData: FarmerFilterModel;
  public isOffline: boolean;
  public roleId: number;

  constructor(
    private farmerService: FarmerService,
    private modalController: ModalController,
    public alertController: AlertController,
    private router: Router,
    private authService: AuthenticationService,
    private locationService: LocationService,
    private dataHistoryService: DataHistoryService,
    public alertService: AlertService,
    public offlineStorageService: OfflineStorageService,
    private loaderOverlayService: LoaderOverlayService,
    private browserUrlService: BrowserUrlService,
    private configurationService: ConfigurationService
  ) {
    const initialFarmersPerPage = this.configurationService.getValue('initialFarmersPerPage');
    this.farmerPageInfo = {
      pageIndex: 0,
      pageSize: initialFarmersPerPage ? initialFarmersPerPage : 5,
      length: 0
    };

    if (this.authService.isAuthenticated()) {
      this.loggedInUser = this.authService.loggedInUser;
      this.roleId = this.authService.loggedInUser.gao;
    }

  }

  async ionViewWillEnter() {
    this.isOffline = await this.offlineStorageService.getOfflineMode();
    const url = new URL(window.location.href);
    const currentPage = url.searchParams.get('page');
    const currentPageSize = url.searchParams.get('itemsPerPage');

    if (currentPage) {
      this.farmerPageInfo.pageIndex = parseInt(currentPage)-1;
    }
    
    if (currentPageSize) {
      this.farmerPageInfo.pageSize = parseInt(currentPageSize);
    }
    
    this.fetchFarmerList();
  }

  private setLocation(address?: LocationFormModel) {

    if (!!address) {
      return address;
    } else {
      const GAO = this.loggedInUser.gao;
      let region = null;
      let province = null;
      let municipal = null;

      switch (GAO) {
        case Role.REGIONAL:
        case Role.REGIONAL_DATA_ADMIN:
          region = this.loggedInUser.officeAddress.regionId;
          break;
        case Role.PROVINCIAL:
          region = this.loggedInUser.officeAddress.regionId;
          province = this.loggedInUser.officeAddress.provinceId;
          break;
        case Role.MUNICIPAL:
          region = this.loggedInUser.officeAddress.regionId;
          province = this.loggedInUser.officeAddress.provinceId;
          municipal = this.loggedInUser.officeAddress.municipalityId;
          break;

      }

      const locationAddress: LocationFormModel = {
        regionId: region,
        provinceId: province,
        municipalityId: municipal
      };

      this.filterAddress = locationAddress;
      return locationAddress;

    }

  }


  public disabledDownloadFarmerList = false;
  public fetchFarmerList() {
    this.isFetchingFarmerList = true;
    const roleId = this.loggedInUser.gao.toString();
    const locationAddress = this.setLocation(this.filterAddress);

    this.farmerService.getFarmerList(roleId, locationAddress, 0, this.searchQuery,
      this.farmerPageInfo.pageIndex, this.farmerPageInfo.pageSize, this.withFilters, this.withCheckFilters,
      this.fromDate, this.toDate, this.filterCheckedKey)
      .pipe(take(1))
      .subscribe((data: FarmerListResultApiModel) => {
        this.farmerList = data.farmers;
        this.disabledDownloadFarmerList = data.farmers.length === 0 ? true : parseInt(roleId, 10) === Role.PUBLIC;
        this.isFetchingFarmerList = false;
        this.farmerPageInfo = { ...this.farmerPageInfo, length: data.totalResultCount }
      },
        err => { 
          this.alertService.alert(
            'Farmer List',
            err,
            'Okay',
            '',
            ''
          ) 
        });
  }

  public refreshFarmerList() {
    this.farmerPageInfo.pageIndex = 0;
    this.fetchFarmerList();
  }

  ngOnInit() {
    const interviewedByMe = this.browserUrlService.getQueryStringValue('interviewedByMe') === 'true';
    const verifiedField = this.browserUrlService.getQueryStringValue('verifiedField') === 'true';
    const notVerifiedField = this.browserUrlService.getQueryStringValue('notVerifiedField') === 'true';
    const idGenerated = this.browserUrlService.getQueryStringValue('idGenerated') === 'true';

    const initialFilter = InitFilters(interviewedByMe, verifiedField, notVerifiedField, idGenerated);

    this.farmerListFilter = initialFilter;
    this.filterCheckedKey = this.farmerListFilter.filter(filter => filter.active).map(filter => filter.key).join();
    if (!!this.filterCheckedKey) {
      this.withCheckFilters = true;
    } else {
      this.withCheckFilters = false;
    }
  }

  public farmerList: FarmerApiModel[];
  public farmerListFilter: FilterModel[];

  get dataHistoryTypeText() { return DataHistoryType; }
  get dataHistoryModuleText() { return DataHistoryModule; }

  public async onExternalFilterClick() {
    let address: AddressApiModel;
    if (this.withFilters) {
      address = this.mapAddressApiModel(this.filterAddress);
    } else {
      address = this.mapAddressApiModel(this.loggedInUser.officeAddress);
    }
    const modal = await this.modalController.create({
      component: FarmerFilterComponent,
      componentProps: {
        locationAddress: address,
        userGao: this.loggedInUser.gao,
        filterData: this.filterData,
        withFilters: this.withFilters
      }
    });

    modal.onDidDismiss()
      .then(async (filter) => {

        if (filter["data"]) {
          const filterData = await this.setFilterData(filter["data"]);
          const locationAddress: LocationFormModel = {
            regionId: filterData.region_id,
            provinceId: filterData.province_id,
            municipalityId: filterData.municipality_id,
            barangayId: filterData.barangay_id
          };

          this.filterAddress = locationAddress;
          const hasLocationFilter = filterData.barangay_id || 
            filterData.municipality_id || 
            filterData.province_id || 
            filterData.region_id;

          const hasDateFilter = filterData.fromDate || filterData.toDate;

          if(hasLocationFilter || hasDateFilter) {
            this.withFilters = true;
          } else {
            this.withFilters = false;
          }
          
          this.refreshFarmerList();
        }
      });
    return await modal.present();
  }

  private mapAddressApiModel(locationFormModel: LocationFormModel){
    const address: AddressApiModel = {
      region: '',
      region_code: '',
      region_id: locationFormModel.regionId,

      province: '',
      province_code: '',
      province_id: locationFormModel.provinceId,

      municipality: '',
      municipality_code: '',
      municipality_id: locationFormModel.municipalityId,

      barangay: '',
      barangay_code: '',
      barangay_id: locationFormModel.barangayId,
    };
    return address;
  }

  public async setFilterData(data) {
    let region = '';
    let prov = '';
    let mun = '';
    let brgy = '';
    let fromDate = '';
    let toDate = '';

    if (!!data.region) {
      region = (await this.locationService.getRegions()).filter(
        (p: RegionModel) => p.value === data.region
      )[0].label;
    }
    if (!!data.province) {
      if (data.province === '0') {
        prov = 'All Provinces';
      } else {
        prov = (await this.locationService.getProvinces()).filter(
          (p: ProvinceModel) => p.value === data.province
        )[0].label;
      }
    }
    if (!!data.municipality) {
      if (data.municipality === '0') {
        mun = 'All Municipalities';
      } else {
        mun = (await this.locationService.getMunicipalities()).filter(
          (p: any) => p.value.toString() === data.municipality
        )[0].label;
      }
    }
    if (!!data.barangay) {
      if (data.barangay === '0') {
        brgy = 'All Barangays';
      } else {
        const res = await this.locationService.getBarangay(data.barangay).toPromise();
        brgy = res.barangay;
      }
    }

    if (data.fromDate && data.toDate) {
      this.fromDate = formatDate(data.fromDate, 'yyyy-MM-dd', 'en-US');
      this.toDate = formatDate(data.toDate, 'yyyy-MM-dd', 'en-US');
      fromDate = formatDate(data.fromDate, 'MMM-dd-yyyy', 'en-US');
      toDate = formatDate(data.toDate, 'MMM-dd-yyyy', 'en-US');
    } else if (data.fromDate && !data.toDate) {
      this.fromDate = formatDate(data.fromDate, 'yyyy-MM-dd', 'en-US');
      this.toDate = formatDate(data.toDate ? data.toDate : new Date(), 'yyyy-MM-dd', 'en-US');
      fromDate = formatDate(data.fromDate, 'MMM-dd-yyyy', 'en-US');
      toDate = formatDate(data.toDate ? data.toDate : new Date(), 'MMM-dd-yyyy', 'en-US');
    }

    const filterData: FarmerFilterModel = {
      region: region,
      region_id: data.region,
      province: prov,
      province_id: data.province === '0' ? null : data.province,
      municipality: mun,
      municipality_id: data.municipality === '0' ? null : data.municipality,
      barangay: brgy,
      barangay_id: data.barangay === '0' ? null : data.barangay,
      fromDate: fromDate,
      toDate: toDate
    };
    this.filterData = filterData;
    return filterData;
  }

  public clearFilters() {
    this.filterAddress = null;
    this.fromDate = null;
    this.toDate = null;
    this.withFilters = false;
    this.withCheckFilters = false;

    this.farmerListFilter.forEach(filter => filter.active = false);
    this.filterCheckedKey = '';

    this.refreshFarmerList();
  }

  private searchQuery: string;
  public onFarmerSearch(query: string) {
    this.searchQuery = query;
    this.farmerPageInfo.pageIndex = 0;
    this.fetchFarmerList();
  }

  public onFarmerSelected(farmer: FarmerApiModel) {
    this.router.navigate(['/data-admin/farmers', farmer.id]);
  }

  public farmerPageInfo: PageInfoModel;

  public onFarmerPageChange(page: PageEvent) {
    this.farmerPageInfo = { ...this.farmerPageInfo, pageIndex: page.pageIndex, pageSize: page.pageSize };

    const currentPage = this.farmerPageInfo.pageIndex + 1;
    this.browserUrlService.upsertQueryParam('page', currentPage.toString());
    this.browserUrlService.upsertQueryParam('itemsPerPage', this.farmerPageInfo.pageSize.toString());
    this.fetchFarmerList();
  }

  public checkFilter(filters: FilterModel[]) {

    let filterParams = [];
    this.filterCheckedLabel = '';
    if (filters) {
      filters.forEach((item: FilterModel) => {
        if (item.active) {
          filterParams.push(item.key);
          this.filterCheckedLabel = this.filterCheckedLabel + ', ' + item.name;
          this.filterCheckedLabel = this.filterCheckedLabel.substr(1);
          this.browserUrlService.upsertQueryParam(item.keyName, 'true');
        } else {
          this.browserUrlService.upsertQueryParam(item.keyName, 'false');

        }
      });
    }

    this.filterCheckedKey = filterParams.join();

    if (!!this.filterCheckedKey) {
      this.withCheckFilters = true;
    } else {
      this.withCheckFilters = false;
    }
    this.fetchFarmerList();

  }

  public async downloadFarmerList() {

    const locationAddress = this.setLocation(this.filterAddress);
    const isMunicipalitySelected = !!locationAddress.municipalityId;

    if (!isMunicipalitySelected) {
      this.alertService.alert('Unable to download', 'No municipality is selected in farmer list filter', 'Okay', '', false);
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirm Download',
      message: 'Do you want to sort the list by Barangay as well?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.downloadFarmerListSortedByBrgy(false)
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.downloadFarmerListSortedByBrgy(true)
          }
        }
      ]
    });

    await alert.present();

  }

  public downloadFarmerListSortedByBrgy(isListSortByBrgy: boolean) {

    const roleId = this.loggedInUser.gao.toString();
    const locationAddress = this.setLocation(this.filterAddress);

    let withFilters: boolean;
    if (parseInt(roleId) === Role.MUNICIPAL) {
      withFilters = true;
    } else {
      withFilters = this.withFilters;
    }
    
    this.isFetchingFarmerList = true;
    this.isDownload = true;
    this.loaderOverlayService.showOverlay();
    
    this.farmerService.getFarmerList(roleId, locationAddress, 0, this.searchQuery,
      this.farmerPageInfo.pageIndex, this.farmerPageInfo.pageSize, withFilters, this.withCheckFilters,
      this.fromDate, this.toDate, this.filterCheckedKey, true, isListSortByBrgy)
      .pipe(take(1))
      .subscribe(async (data: FarmerListResultApiModel) => {
        await this.createPDF(data.farmers);
        this.isFetchingFarmerList = false;
        this.isDownload = false;
        this.loaderOverlayService.hideOverlay();
      },
        err => {
          this.alertService.alert(
            'Error Download Farmer List',
            err,
            'Okay',
            '',
            ''
          );
          this.isDownload = false;
          this.loaderOverlayService.hideOverlay();
          this.refreshFarmerList();
        });

  }

  public async createPDF(farmersData) {

    if (!this.withFilters) {
      const locationAddress = this.setLocation(this.filterAddress);
      const data = {
        region: locationAddress.regionId ? locationAddress.regionId.toString() : null,
        province: locationAddress.provinceId ? locationAddress.provinceId.toString() : null,
        municipal: locationAddress.municipalityId ? locationAddress.municipalityId.toString() : null,
        barangay: locationAddress.barangayId ? locationAddress.barangayId.toString() : null,
      };
      await this.setFilterData(data);
    }


    const d = new Date();
    const fileName = `FFRList-${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-`+(this.filterData.barangay == 'All Barangays' ? this.filterData.municipality : this.filterData.municipality+'-'+this.filterData.barangay);
    const userName = this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName;

    const pdfHeaders = await this.farmerService.getFarmerPDFHeader().toPromise();

    const disclaimer = {
      stack: [
        {
          text: [
            'This information is made available to the Department of Agriculture Regional Field Offices (DA-RFOs) as guide in conducting RCM farmer’s field measurement\n',
            'using handheld GPS device. This document contains sensitive personal information of RCM farmers covered by the Data Privacy Act of 2012. This information\n',
            'cannot be used for purposes other than the stated above. IRRI is not liable for any misuse of this downloaded information.\n'
          ],
          margin: [20, 0, 0, 0],
          fontSize: 11,
        }
      ]
    };

    const notes = {
      stack: [
        {
          text: [
            '1) Value under column "Declared Field Size" indicates the farmer-declared field size during farmer and field registration\n',
            '2) "YES" under column "Verified?" means that field was already measured using handheld GPS device and track was already submitted and verified\n',
            '3) Value under column "Verified Field Size" indicates the GPS-measured field size\n',
            '4) GPX Field ID is the unique code assigned to each field and should be used for naming the GPS track after measuring the field"'
          ],
          fontSize: 11,
          italics: true
        }
      ]
    };

    const headerDetails = [{
      width: 350,
      text: [
        'Region: ' + this.filterData.region + '\n',
        'Province: ' + this.filterData.province + '\n',
        'Municipality: ' + this.filterData.municipality + '\n',
        'Barangay: ' + this.filterData.barangay + '\n'
      ]
    },
    {
      width: '*',
      text: [
        'Date of download: ' + formatDate(d, 'MMM-dd-yyyy', 'en-US') + '\n',
        !!this.filterData.fromDate ? 'Inclusive of date of survey: ' + this.filterData.fromDate + ' to ' + this.filterData.toDate + '\n' : '',
        'Downloaded by: ' + userName + '\n',
        ' ',
        this.withCheckFilters ? 'Other filters: ' : '',
        this.withCheckFilters ? this.filterCheckedLabel : ''
      ]
    }];

    const colHeader = ['survey_date', 'first_name', 'last_name', 'farmer_barangay', 'contact_number', 'field_name', 'd_field_size', 'gpx_id', 'verified', 'verified_field_size'];
    const dd = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      content: [
        { text: 'List of RCM farmers and fields for GPS measurement and fields with verified field size.', fontSize: 13, bold: true },
        ' ',
        {
          alignment: 'justify',
          columns: headerDetails,
        },
        ' ',
        { text: 'Disclaimer:', fontSize: 11 },
        disclaimer,
        ' ',
        { text: 'Notes:', fontSize: 11 },
        notes,
        ' ',
        this.table(farmersData, pdfHeaders),

      ]
    };
    pdfMake.createPdf(dd).download(fileName);
    this.dataHistoryService.logDataHistory(DataHistoryType.DOWNLOADED, DataHistoryModule.FARMER_LIST).subscribe();
  }

  buildTableBody(data, pdfHeaders) {
    const body = [];

    const columnHeaders = [];

    pdfHeaders.forEach(function (column) {
      columnHeaders.push(column.header_value);
    });

    body.push(columnHeaders);

    data.forEach(function (row) {
      const dataRow = [];

      pdfHeaders.forEach(function (column) {
        let data = { text: row[column.key].toString(), fontSize: 10 };
        dataRow.push(data);
      });

      body.push(dataRow);
    });

    return body;
  }

  table(data, pdfHeaders) {
    return {
      table: {
        headerRows: 1,
        heights: [50],
        widths: [60, 90, 80, 65, 90, 100, 50, 75, 50, 50],
        body: this.buildTableBody(data, pdfHeaders)
      },
      layout: {
        fillColor: function (rowIndex) {
          return rowIndex === 0 ? '#1BBD9C' : null;
        }
      }
    };
  }
}
