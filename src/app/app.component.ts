
import { Component } from '@angular/core';
 
import { LoadingController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoaderService } from './core/services/loader.service';
import { RouteConfigLoadEnd, Router, RouterEvent } from "@angular/router";
import { RouteConfigLoadStart } from "@angular/router";
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  close_app: any;
  public appLoading = false;

  private asyncModuleLoadCount = 0;

  public get isLoadingAsyncModule() {
    return this.asyncModuleLoadCount > 0;
  }
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loaderService: LoaderService,
    router: Router,
  ) {
    this.initializeApp();
    this.loaderService.isLoading.subscribe((v) => {
      this.appLoading = v;
    });
    
		router.events.subscribe(
			( event: RouterEvent ) : void => {
 
				if ( event instanceof RouteConfigLoadStart ) {
 
					this.asyncModuleLoadCount++;
 
				} else if ( event instanceof RouteConfigLoadEnd ) {
 
          this.asyncModuleLoadCount--;
				}
			}
		);
  }
 
  private async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnDestroy() {
    if (!!this.close_app) {
      this.close_app.unsubscribe();
      this.loaderService.isLoading.unsubscribe();
    }
  }

}