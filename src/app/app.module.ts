import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HttpHeaderInterceptorService } from './v2/core/services/http-header-interceptor.service';
import { LoaderInterceptor } from './core/services/loader-interceptor';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RoundUpPipe } from 'src/app/recommendation/pipe/round-up.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {KgToBagsPipe} from './recommendation/pipe/kg-to-bags.pipe';
import { CapitalizePipe } from './v2/shared/pipe/capitalize.pipe';
import {MonthPipe} from './recommendation/pipe/month.pipe';
import { CustomDialectTranslationPipe } from 'src/app/recommendation/pipe/custom-dialect-translation.pipe';
import {ConfigurationService} from './v2/core/services/configuration.service';
export function initApp(configurationService: ConfigurationService) {
  return () => configurationService.load().toPromise();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    DatePipe,
    KgToBagsPipe,
    MonthPipe,
    RoundUpPipe,
    DecimalPipe,
    CapitalizePipe,
    CustomDialectTranslationPipe,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initApp, multi: true, deps: [ConfigurationService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
