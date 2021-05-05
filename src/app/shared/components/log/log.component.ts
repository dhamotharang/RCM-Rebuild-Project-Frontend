import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/v2/core/services/log.service';
import { LogModel } from 'src/app/v2/core/models/log.model';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent implements OnInit {

  logs: LogModel[];

  constructor(private logService: LogService) { }

  ngOnInit() {
    this.getLogs();
  }

  getLogs() {
    this.logService.getLogs().subscribe(logs => {
      this.logs = logs;

    });
  }


}
