import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-data-edit',
  templateUrl: './data-edit.component.html',
  styleUrls: ['./data-edit.component.scss'],
})
export class DataEditComponent implements OnInit {
  @Input() count;

  constructor() { }

  ngOnInit() {
    if (!this.count) {
      this.initCount();
    }
  }

  initCount() {
    this.count = {
      farmer_add: 0,
      farmer_edit: 0,
      field_add: 0,
      field_edit: 0,
      farmer_id_print: 0,
      farmer_list_download: 0,
      gpx_upload: 0,
      farmer_delete: 0,
      field_delete: 0,
      gpx_delete: 0,
      gpx_replace: 0,
    };
  }

}

