import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FarmerConsentModel } from 'src/app/core/models/farmer-consent.model';

@Component({
  selector: 'data-privacy',
  templateUrl: './data-privacy.component.html',
  styleUrls: ['./data-privacy.component.scss'],
})
export class DataPrivacyComponent implements OnInit {

  @Input() public label: string;
  @Input() public languageId: number;
  @Input() public file: string;
  @Output() public onUpload = new EventEmitter<FarmerConsentModel>();
  @Output() public onDownload = new EventEmitter<number>();

  @Input() public selectedFile: string;
  constructor() { }

  ngOnInit() {}

  public onFileSelected(event: Event) {
   
    const file = (event.target as HTMLInputElement).files[0];
    if(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedFile = reader.result.toString();
      };
    }
  }

  public upload() {
    this.onUpload.emit({
      file: this.selectedFile,
      languageId: this.languageId
    });
  }

  public download() {
    this.onDownload.emit(this.languageId);
  }

}
