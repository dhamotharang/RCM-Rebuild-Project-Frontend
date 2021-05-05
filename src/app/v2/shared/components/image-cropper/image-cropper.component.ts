import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
})
export class ImageCropperComponent implements OnInit {
  @Input() imageFile: any;
  @Input() resizeToWidth = 0;
  @Input() cropperTitle = 'Crop Image';
  @Input() maintainAspectRatio = false;
  public imageChangedEvent: any = '';
  private croppedImage: string = '';

  constructor(private modalController: ModalController) {}

  public ionViewWillEnter() {
    this.imageChangedEvent = this.imageFile;
  }

  public ngOnInit() {}

  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  public imageLoaded() {
    // show cropper
  }
  
  public loadImageFailed() {
    // show message
  }

  public submitImage() {
    this.modalController.dismiss(this.croppedImage);
  }

  public closeModal() {
    this.modalController.dismiss();
  }
}
