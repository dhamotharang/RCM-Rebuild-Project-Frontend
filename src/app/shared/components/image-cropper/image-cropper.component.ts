import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
})
/** @deprecated Use image-cropper under v2/shared */
export class ImageCropperComponent implements OnInit {
  @Input() imageFile: any;
  @Input() isFarmerPhoto: boolean;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  resizeToWidth = 0;

  constructor(private modalController: ModalController) {}

  ionViewWillEnter() {
    this.imageChangedEvent = this.imageFile;
    if (this.isFarmerPhoto) {
      this.resizeToWidth = 250;
    }
  }

  public get cropperTitle() {
    let title = 'Data Privacy Consent Form';
    if (this.isFarmerPhoto) {
      title = 'Farmer Photo';
    }

    return title;
  }

  ngOnInit() {}

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }

  submitImage() {
    this.modalController.dismiss(this.croppedImage);
  }

  public closeModal() {
    this.modalController.dismiss();
  }
}
