import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Fill from '../../types/fill';
import Color from '../../types/color';
import Size from '../../types/size';

@Component({
  selector: 'app-ghost-button',
  templateUrl: './ghost-button.component.html',
  styleUrls: ['./ghost-button.component.scss'],
})
export class GhostButtonComponent implements OnInit {
  @Input() public color: Color = 'medium';
  @Input() public expand: string;
  @Input() public fill: Fill = 'outline';
  @Input() public size: Size = 'default';

  @Output() public onClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
