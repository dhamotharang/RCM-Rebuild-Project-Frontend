import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { take, filter, takeUntil } from 'rxjs/operators';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import {
  AlertController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { FarmerDataPrivacyComponent } from './farmer-data-privacy/farmer-data-privacy.component';
import { DataHistoryService } from '../v2/core/services/data-history.service';
import {
  DataHistory,
  DataHistoryModule,
  DataHistoryType,
} from '../v2/core/enums/data-history.enum';
import { PhoneOwner } from '../farmer-management/enums/phone-owner.enum';
import { DataHistoryModel } from '../core/models/data-history.model';
import { FieldOwner } from '../v2/core/enums/field-ownership.enum';
import { YesNo } from '../v2/core/enums/yes-no.enum';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { ProfileButtonComponent } from 'src/app/data-admin/popover/profile-button/profile-button.component';
import {
  MenuComponent,
  POPOVER_MENU_ACTION,
} from 'src/app/data-admin/popover/menu/menu.component';
import { FarmerFilterModalComponent } from '../farmer-management/modals/farmer-filter-modal/farmer-filter-modal.component';
import { FarmerFilterModel } from '../farmer-management/models/farmer-filter.model';
import { FarmerFilterService } from '../farmer-management/services/farmer-filter.service';
import { DownloadFarmerListModalComponent } from '../farmer-management/modals/download-farmer-list-modal/download-farmer-list-modal.component';
import { FarmerService } from '../farmer-management/services/farmer.service';
import { PdfService } from '../v2/core/services/pdf.service';
import { ConfigurationService } from '../v2/core/services/configuration.service';

@Component({
  selector: 'app-data-admin',
  templateUrl: './data-admin.page.html',
  styleUrls: ['./data-admin.page.scss'],
})
export class DataAdminPage implements OnInit, OnDestroy {
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  public version;
  private unsubscribe = new Subject();
  public path: string;
  public dataHistories: DataHistoryModel[];
  public paramPage: string;
  public paramId: any;
  @Input() public showLoader: boolean;
  public loggedInUser: UserLoginModel;
  public isOfflineModeEnabled: boolean;
  public farmersPageQueryParams: object;
  public accessLevelText: string;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private modalController: ModalController,
    private dataHistoryService: DataHistoryService,
    public offlineStorage: OfflineStorageService,
    private popoverController: PopoverController,
    private farmerService: FarmerService,
    private farmerFilterService: FarmerFilterService,
    private pdfService: PdfService,
    private alertController: AlertController,
    private configurationService: ConfigurationService
  ) {
    this.farmersPageQueryParams  = {
      page: this.configurationService.getValue('initialFarmersPage'),
      itemsPerPage: this.configurationService.getValue('initialFarmersPerPage')
    };

    this.version = this.configurationService.getValue('version');
    if (authService.isAuthenticated()) {
      this.loggedInUser = authService.loggedInUser;
      this.accessLevelText = authService.accessLevelText;
    }

    this.path = this.router.routerState.snapshot.url.split('?')[0];

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationStart),
        takeUntil(this.unsubscribe)
      )
      .subscribe(async (r: NavigationStart) => {
        this.path = r.url.split('?')[0];
      });

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe((r: NavigationStart) => {
        this.paramPage = this.path.split('/').slice(-2)[0];
        this.paramId = this.path.split('/').slice(-1)[0];
        this.dataHistoryService
          .getUserHistory(this.paramId, this.paramPage)
          .pipe(take(1))
          .subscribe((data: DataHistoryModel[]) => {
            this.dataHistories = data;

            const len = data.length;
            for (let i = 0; i < len; i++) {
              if (this.dataHistories[i]['type'] === 2) {
                this.dataHistories[i]['old_data'] = JSON.parse(
                  data[i].old_data
                );
              }
            }
          });
      });
  }

  get dataHistoryDataText() {
    return DataHistory;
  }
  get dataHistoryTypeText() {
    return DataHistoryType;
  }
  get dataHistoryModuleText() {
    return DataHistoryModule;
  }
  get phoneOwnerText() {
    return PhoneOwner;
  }
  get fieldOwnerText() {
    return FieldOwner;
  }
  get yesNoText() {
    return YesNo;
  }

  ngOnInit() {

  }

  public onLogout() {
    this.authService.logout();
  }

  dataPrivacyPage() {
    if (this.authService.isAdmin || this.authService.isRegionalDataAdmin) {
      this.router.navigate(['/data-admin/data-privacy']);
    } else {
      this.dataPrivacy(true);
    }
  }

  async dataPrivacy(viewType: boolean) {
    const modal = await this.modalController.create({
      component: FarmerDataPrivacyComponent,
      componentProps: {
        viewOnly: viewType,
      },
    });

    return modal.present();
  }

  public getValue(recipient) {
    let val = '';
    if (recipient.value === null) {
      val = 'empty';
    } else {
      if (
        recipient.key === 'phone_owner' ||
        recipient.key === 'alternative_phone_owner'
      ) {
        val = this.phoneOwnerText[recipient.value];
      } else if (recipient.key === 'data_privacy_consent') {
        val = 'replaced data_privacy_consent';
      } else if (recipient.key === 'photo') {
        val = 'replaced photo';
      } else if (recipient.key === 'field_ownership') {
        val = this.fieldOwnerText[recipient.value];
      } else if (recipient.key === 'field_member_org') {
        val = this.yesNoText[recipient.value];
      } else {
        val = recipient.value;
      }
    }

    return val;
  }

  async userProfileMobileMenu(ev?: Event) {
    const popover = await this.popoverController.create({
      component: ProfileButtonComponent,
      cssClass: 'popoverClass',
      mode: 'ios',
      componentProps: {
        avatar: this.loggedInUser.profilePhotoUrl,
        name: this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName,
        accessLevelText: this.accessLevelText,
      },
      event: ev,
    });

    popover.present();
  }

  public async mainMobileMenu(ev?: Event) {
    const popover = await this.popoverController.create({
      component: MenuComponent,
      cssClass: 'popoverClass',
      mode: 'ios',
      event: ev,
    });

    await popover.present();
    const { data } = await popover.onWillDismiss();
    if (data) {
      if (data.action === POPOVER_MENU_ACTION.DOWNLOAD_FARMER_LIST) {
        await this.openDownloadFarmerListModal();
      }
    }
  }

  public async openFilterModal() {

    const modal = await this.modalController.create({
      component: FarmerFilterModalComponent,
      cssClass: 'farmer-filter-modal',
      componentProps: {
        farmerFilter: this.farmerFilterService.farmerFilterSnapshot,
      },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.farmerFilterService.update(data);
    }
  }

  public async openDownloadFarmerListModal() {

    const modal = await this.modalController.create({
      component: DownloadFarmerListModalComponent,
      cssClass: 'farmer-filter-modal',
      componentProps: {
        farmerFilter: this.farmerFilterService.farmerFilterSnapshot,
        advancedFilterExpanded: true,
      },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    const buttonHandler = (args: {isSortedByBrgy: boolean, data: any }) => {
      return () => {
        this.farmerService
          .queryFarmerForDownload(
            args.data,
            this.authService.loggedInUser.gao,
            args.isSortedByBrgy
          )
          .pipe(take(1))
          .subscribe(async (res) => {
            await this.pdfService.createFarmerListPdf(
              res.farmers,
              args.data,
              this.authService.loggedInUser
            );
          });
      };
    };

    const alert: Promise<HTMLIonAlertElement | undefined> = data ? this.alertController.create({
      header: 'Confirm Download!',
      message: 'Do you want to sort the list by Barangay?',
      buttons: [
        {
          text: 'No',
          cssClass: 'secondary',
          handler: buttonHandler({ isSortedByBrgy: false, data})
        },
        {
          text: 'Yes',
          handler: buttonHandler({ isSortedByBrgy: true, data})
        },
      ],
      backdropDismiss: false
    }) : undefined;

    if (alert) {
      (await alert).present();
    }
  }

  private getQueryParms(data: FarmerFilterModel) {
    const param = {};
    if (data.interviewedByMe) {
      param['interviewedByMe'] = true;
    }

    if (data.verifiedField) {
      param['verifiedField'] = true;
    }

    if (data.notVerifiedField) {
      param['notVerifiedField'] = true;
    }

    if (data.idGenerated) {
      param['idGenerated'] = true;
    }
    if (data.searchQuery) {
      param['search'] = data.searchQuery;
    }
    return param;
  }
}
