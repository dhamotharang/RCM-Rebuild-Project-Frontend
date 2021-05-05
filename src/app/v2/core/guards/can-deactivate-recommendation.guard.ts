import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { RecommendationPage } from '../../../recommendation/recommendation-page.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateRecommendationGuard implements CanDeactivate<RecommendationPage>{
  constructor(private alertController: AlertController) {}
  
  canDeactivate(
    component: RecommendationPage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      if (component.isTheRecommendationSaved) {
        return true;
      }
      return new Promise<boolean>(async (resolve) => {
        const alert = await this.alertController.create({
          header: 'Are you sure?',
          message: 'Unsaved changes will be lost',
          buttons: [
            {
              text: 'No',
              cssClass: 'secondary',
              handler: () => {
                resolve(false);
              }
            },
            {
              text: 'Yes',
              cssClass: 'secondary',
              handler: () => {
                resolve(true);
              }
            }
          ],
          backdropDismiss: false
        });
        alert.present();
      });
    }
}
