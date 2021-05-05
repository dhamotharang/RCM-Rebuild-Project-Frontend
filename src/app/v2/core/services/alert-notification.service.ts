import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertNotificationService {

  constructor(private alertController: AlertController) { }

  public async showAlert(message, title?) {
    const actualTitle = title ? title : 'Alert Message';
    const alert = await this.alertController.create({
      header: actualTitle,
      message,
      buttons: ['OK']
    });

    await alert.present();

  }
}
