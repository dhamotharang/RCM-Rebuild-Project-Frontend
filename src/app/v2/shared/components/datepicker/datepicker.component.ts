import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {

  @Input() label = 'label';
  @Input() date: Date;
  @Input() min: Date = null;
  @Input() max: Date = null;
  @Output() dateChange = new EventEmitter<Date>();
  constructor() { }

  ngOnInit() {}

  public onDateChange(ev: MatDatepickerInputEvent<Date>) {
    this.dateChange.emit(ev.value);
  }
}
