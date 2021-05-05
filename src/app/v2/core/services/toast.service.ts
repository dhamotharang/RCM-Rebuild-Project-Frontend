import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {

  }

  public async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      header: 'Success',
      message: message,
      duration: 2000,
      color: 'primary',
    });
    return toast.present();
  }
}
