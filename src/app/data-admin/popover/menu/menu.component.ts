import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { AlertController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private router: Router,
    private popover: PopoverController,
    public authService: AuthenticationService
  ) { }

  ngOnInit() { }

  public async downloadFarmerList() {
    await this.popover.dismiss({action: POPOVER_MENU_ACTION.DOWNLOAD_FARMER_LIST});
  }
  public async gotoSettings() {
    await this.router.navigate(['/data-admin/settings']);
    await this.popover.dismiss();
  }

  public async gotoContactUs() {
      await this.router.navigate(['/contact-us']);
      await this.popover.dismiss();
  }

  public async onLogout() {
    this.authService.logout();
    await this.router.navigate(['login']);
    await this.popover.dismiss();
  }

}

export const POPOVER_MENU_ACTION = {
  DOWNLOAD_FARMER_LIST: 'downloadFarmerList'
};
