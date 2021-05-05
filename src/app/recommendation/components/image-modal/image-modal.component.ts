import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OtherCropImageModel } from 'src/app/recommendation/model/other-crop-image-model';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent implements OnInit {

  @Input() public image: OtherCropImageModel;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  public onClose() {
    this.modalController.dismiss();
  }

}
