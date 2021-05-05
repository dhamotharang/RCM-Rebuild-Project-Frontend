import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-form-label',
  templateUrl: './item-form-label.component.html',
  styleUrls: ['./item-form-label.component.scss'],
})
export class ItemFormLabelComponent implements OnInit {
  @Input() errorMessage: string;
  @Input() label: string;
  @Input() required: boolean;
  constructor() { }

  ngOnInit() {}

  public get errorMessageFormatted() {
    const firsCharacter = this.errorMessage[0].toUpperCase();
    const errorMessage = this.errorMessage.toLowerCase().substring(1, this.errorMessage.length);
    return `${firsCharacter}${errorMessage}`;
  }

}
