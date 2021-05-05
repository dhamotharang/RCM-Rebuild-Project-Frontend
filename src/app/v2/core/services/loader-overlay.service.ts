import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {ConfigurationService} from './configuration.service';

export interface OverlayModel {
  visible: boolean;
  loaderMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoaderOverlayService {
  private overlayObject = new BehaviorSubject<OverlayModel>({visible: false});
  private loaderInstance: HTMLIonLoadingElement;
  private determinateLoader: HTMLIonLoadingElement;
  private progressValue = new BehaviorSubject<number>(0);

  constructor(private loadingController: LoadingController, private configurationService: ConfigurationService) {
    
    this.overlayObject.subscribe(async (overlayModel) => {
      if (overlayModel.visible) {
        this.loaderInstance = await this.loadingController.create({
          message: overlayModel.loaderMessage ? overlayModel.loaderMessage : 'Please wait...',
        });
        await this.loaderInstance.present();

        setTimeout(() => {
          this.loaderInstance.dismiss();
        }, this.configurationService.getValue('overlayLoaderTimeOut'));
      } else {
        if (this.loaderInstance) {
          this.loaderInstance.dismiss();
        }
      }
    });
    
  }

  public showOverlay(message?: string) {
    this.overlayObject.next({visible: true, loaderMessage: message});
  }

  public hideOverlay() {
    this.overlayObject.next({visible: false});
  }

  public get progress() {
    return this.progressValue.asObservable();
  }

  public setProgress(value: number) {
    this.progressValue.next(value);
  }

  public resetProgress() {
    this.progressValue.next(0);
  }

  public async showProgress(message?: string) {
    this.determinateLoader = await this.loadingController.create({
      spinner: 'bubbles',
    });

    this.progressValue.subscribe(async value => {
      if (this.determinateLoader) {
        this.determinateLoader.message = message? `${message} ${value.toFixed(2)}%`: `Downloading ${value.toFixed(2)}%`;
      }
    })
    await this.determinateLoader.present();
  }

  public async stopProgress() {
    if (this.determinateLoader) {
      this.determinateLoader.dismiss();
      this.determinateLoader = undefined;
    }

    this.resetProgress();
  }
}
