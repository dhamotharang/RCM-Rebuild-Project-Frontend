import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { FarmerService } from '../../core/services/farmer.service';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { DataHistoryModel } from '../../core/models/data-history.model';
import { take, takeUntil } from 'rxjs/operators';
import { DataHistoryService } from '../../v2/core/services/data-history.service';
import { DataHistory, DataHistoryModule, DataHistoryType } from '../../v2/core/enums/data-history.enum';
import { PhoneOwner } from '../../farmer-management/enums/phone-owner.enum';
import { FieldOwner } from '../../v2/core/enums/field-ownership.enum';
import { YesNo } from '../../v2/core/enums/yes-no.enum';
import { FarmerListResultApiModel } from '../../farmer-management/models/api/farmer-list-result.model';
import { formatDate } from '@angular/common';
import { PhLocation, RcmFormLocationComponent } from '../shared/components/rcm-form-location/rcm-form-location.component';
import { Subject } from 'rxjs';
import { SelectableComponent } from 'src/app/shared/components/selectable/selectable.component';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { LocationFormModel } from 'src/app/location/models/location-form.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, OnDestroy {

  public loggedInUser: UserLoginModel;
  public dataEdit = true;
  public summary;
  public fromDateCtrl: FormControl = new FormControl();
  public toDateCtrl: FormControl = new FormControl();
  public isSelectableListDisabled = true;
  public isSummaryDisplayed: boolean;
  public isDataHistoryDisplayed = false;

  constructor(private userService: UserService,
    private farmerService: FarmerService,
    private dataHistoryService: DataHistoryService,
    public modalController: ModalController,
    private authService: AuthenticationService,
    private alertService: AlertService) {
    this.fromDateCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.clearSelection();
      });

      this.toDateCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.clearSelection();
      });
  }

  get dataHistoryDataText() { return DataHistory; }
  get dataHistoryTypeText() { return DataHistoryType; }
  get dataHistoryModuleText() { return DataHistoryModule; }
  get phoneOwnerText() { return PhoneOwner; }
  get fieldOwnerText() { return FieldOwner; }
  get yesNoText() { return YesNo; }

  protected _onDestroy = new Subject<void>();
  public searchFilterForm = new FormGroup({
    search: new FormControl(null),
    filterBy: new FormControl(null),
    fromDate: this.fromDateCtrl,
    toDate: this.toDateCtrl
  });

  public selectableList: any;
  public dataHistories: DataHistoryModel[];

  public selectedItems = [];
  public selectedFilter = '';
  toggle = true;
  public showLoader: boolean;
  public showSpinner: boolean;

  private maxYear = 0;
  private minYear = 5;

  public minDate: string;
  public dateToday = new Date();
  public fromDate = new Date();
  public userAccess = this.authService.userAccessState;

  // @ViewChild('selectComponent', { static: false }) selectComponent: IonicSelectableComponent;
  @ViewChild('rcmLocationForm') rcmLocationForm: RcmFormLocationComponent;

  public userAddressAccess: LocationFormModel;

  public ionViewDidEnter() {
    this.userAddressAccess = this.loggedInUser.officeAddress;
    this.clearSelection();
    this.showSpinner = false;
    this.dataEdit = true;
    this.getAllDataEdit();
  }

  public phLocationModel: PhLocation;

  public async ngOnInit() {
    this.loggedInUser = this.authService.loggedInUser;
    this.userAddressAccess = this.loggedInUser.officeAddress;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public onPhLocationChange(model: PhLocation) {
    this.clearSelection();
    this.phLocationModel = model;
  }

  onViewData() {
    if (this.dataEdit) {
      this.getDataEdit();
    } else {
      this.getDataHistory();
    }
  }

  getAllDataEdit() {
    let region = null;
    let province = null;
    let municipal = null;

    const searchFilter = this.searchFilterForm.getRawValue();
    const fromDate = searchFilter.fromDate ? formatDate(searchFilter.fromDate, 'yyyy-MM-dd', 'en-US') : null;
    const toDate = searchFilter.toDate ? formatDate(searchFilter.toDate, 'yyyy-MM-dd', 'en-US') : null;

    if (this.loggedInUser && this.loggedInUser.officeAddress) {
      region = this.loggedInUser.officeAddress.regionId;
      province = this.loggedInUser.officeAddress.provinceId;
      municipal = this.loggedInUser.officeAddress.municipalityId;
    }

    const location = {
      region: region,
      province: province,
      municipality: municipal,
    };

    this.dataHistoryService.getDataSummary(location, fromDate, toDate).subscribe(total => {
      this.summary = this.setSummaryCount(total);
    });
  }

  getDataEdit() {
    const searchFilter = this.searchFilterForm.getRawValue();
    const fromDate = searchFilter.fromDate ? formatDate(searchFilter.fromDate, 'yyyy-MM-dd', 'en-US') : null;
    const toDate = searchFilter.toDate ? formatDate(searchFilter.toDate, 'yyyy-MM-dd', 'en-US') : null;

    const location = {
      region: searchFilter.region === '0' ? null : searchFilter.region,
      province: searchFilter.province === '0' ? null : searchFilter.province,
      municipality: searchFilter.municipality === '0' ? null : searchFilter.municipality,
    };

    if (location.municipality) {
      this.dataHistoryService.getDataSummary(location, fromDate, toDate).subscribe(total => {
        this.isSummaryDisplayed = true;
        this.summary = this.setSummaryCount(total);
      });
    } else {
      this.alertService.alert('Unable to load summary', 'Please select at least a Municipality from Location Filter', 'Okay', '', false);
      this.isSummaryDisplayed = false;
    }
  }

  setSummaryCount(total) {
    const count = {
      farmer_add: total.farmer_add ? total.farmer_add : 0,
      farmer_edit: total.farmer_edit ? total.farmer_edit : 0,
      field_add: total.field_add ? total.field_add : 0,
      field_edit: total.field_edit ? total.field_edit : 0,
      farmer_id_print: total.farmer_id_print ? total.farmer_id_print : 0,
      farmer_list_download: total.farmerlist_download ? total.farmerlist_download : 0,
      gpx_upload: total.gpx_upload ? total.gpx_upload : 0,
      farmer_delete: total.farmer_delete ? total.farmer_delete : 0,
      field_delete: total.field_delete ? total.field_delete : 0,
      gpx_delete: total.gpx_delete ? total.gpx_delete : 0,
      gpx_replace: total.gpx_replace ? total.gpx_replace : 0,
    };

    return count;
  }

  getDataHistory() {
    let fromDate = null;
    let toDate = null;
    const searchFilter = this.searchFilterForm.getRawValue();

    if (searchFilter.fromDate && searchFilter.toDate) {
      fromDate = formatDate(searchFilter.fromDate, 'yyyy-MM-dd', 'en-US');
      toDate = formatDate(searchFilter.toDate, 'yyyy-MM-dd', 'en-US');
    } else if (searchFilter.fromDate && !searchFilter.toDate) {
      fromDate = formatDate(searchFilter.fromDate, 'yyyy-MM-dd', 'en-US');
      toDate = formatDate(searchFilter.toDate ? searchFilter.toDate : new Date(), 'yyyy-MM-dd', 'en-US');
    }

    let idParams = [];
    this.showLoader = true;

    if (this.selectedFilter) {
      this.selectedItems.forEach((items: any) => {
        idParams.push(items.id);
      });
    
      this.dataHistoryService.getDataHistory(this.selectedFilter, idParams.join(), fromDate, toDate)
      .pipe(take(1))
      .subscribe((data: DataHistoryModel[]) => {
        this.isDataHistoryDisplayed = true;
        this.dataHistories = data;
        let len = data.length;
        const UPDATE = 2;
        for (let i = 0; i < len; i++) {
          const oldDataLength = data[i].old_data.length;
          if (this.dataHistories[i]['type'] === UPDATE && oldDataLength > 0) {
            this.dataHistories[i]['old_data'] = JSON.parse(data[i].old_data);
          }
        }

        this.showLoader = false;
      });
    }
  }

  private setLocation() {
    const searchFilter = this.searchFilterForm.getRawValue();

    const address: LocationFormModel = {
      regionId: searchFilter.region,
      provinceId: searchFilter.province === '0' ? null : searchFilter.province,
      municipalityId: searchFilter.municipality === '0' ? null : searchFilter.municipality,
      barangayId: null,
    };

    return address;
  }

  onFilterByChange() {
    this.selectedFilter = this.searchFilterForm.controls.filterBy.value;
    this.selectableList = [];
    this.selectedItems = [];
    this.dataHistories = [];
    this.isDataHistoryDisplayed = false;
    const locationAddress = this.setLocation();

    if (!locationAddress.municipalityId) {
      this.alertService.alert('Unable to load list', 'Please select at least a Municipality from Location Filter', 'Okay', '', false);
      this.isSelectableListDisabled = true;
    } else {
      this.isSelectableListDisabled = false;
      if (this.selectedFilter === 'Farmer') {
        this.showSpinner = true;
        this.farmerService.getFarmerList(this.loggedInUser.gao.toString(), locationAddress, 1)
        .pipe(take(1))
        .subscribe((data: FarmerListResultApiModel) => {
          this.selectableList = this.setSelectableList(data.farmers);
          this.showSpinner = false;
        });
      } else if (this.selectedFilter === 'User') {
        this.showSpinner = true;
        this.userService.getUsers(locationAddress)
        .pipe(take(1))
        .subscribe((data: UserLoginModel) => {
          this.selectableList = this.setSelectableList(data);
          this.showSpinner = false;
        });
      }
    }
  }

  private setSelectableList(data: any) {

    const dataInfo = [];

    data.forEach((item: any) => {
      dataInfo.push(
        {
          id: item.user_id ? item.user_id : item.farmer_id,
          operator_id: item.operator_id ? item.operator_id : 0,
          first_name: item.first_name,
          last_name: item.last_name,
          middle_name: item.middle_name
        }
      );
    });
    return dataInfo;
  }

  public clearLocation() {
    this.rcmLocationForm.clear();
    this.clearSelection();

  }

  public clearSelection(){
    this.searchFilterForm.controls.filterBy.reset();
    this.selectableList = [];
    this.selectedItems = [];
    this.dataHistories = [];
    this.isSelectableListDisabled = true;
    this.isDataHistoryDisplayed = false;
    this.isSummaryDisplayed = false;
    this.selectedFilter = "";
  }

  public clearDate() {
    this.searchFilterForm.controls.fromDate.setValue(null);
    this.searchFilterForm.controls.toDate.setValue(null);
    this.clearSelection();
  }

  public async handleSelectFilterItems() {
    const modal = await this.modalController.create({
      component: SelectableComponent,
      componentProps: {
        'selectableItems': this.selectableList.map(listItem => {
          const selected = !!this.selectedItems.find(selectedItem => selectedItem.id === listItem.id);
          return {...listItem, selected};
        })
      },
    });

    await modal.present();

    const {data} = await modal.onWillDismiss();
    this.selectedItems = data ? data : [];
  }

  public onFromDateChange(event): void {
    this.fromDate = event;
    this.searchFilterForm.controls.toDate.setValue(null);
  }
  

  switchDataDisplay() {
    this.dataEdit = !this.dataEdit;
  }

  isEnabledViewData(selectedItems) {

    if (this.dataEdit) {
      return false;
    } else {
      return selectedItems.length == 0;
    }

  }

  public setDatePicker() {
    const dayMin = "01";
    const monthMin = "01";

    const yearMin = this.dateToday.getFullYear() - this.maxYear - this.minYear;

    this.minDate = yearMin + "-" + monthMin + "-" + dayMin;
  }
}
