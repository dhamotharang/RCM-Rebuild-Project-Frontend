import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Output() public fileChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() public isMultiple: boolean;
  @Input() public componentId: string;
  @Input() public buttonText: string;
  @Input() public isExpand: boolean = true;
  @Input() public roleId: number;
  
  constructor() { }

  ngOnInit() {
    if (!this.componentId) {
      this.componentId = 'uploadInput';
    }

    if (!this.buttonText) {
      this.buttonText = "Upload";
    }
  }

}
