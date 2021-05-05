import { Component, Input, OnInit } from '@angular/core';
import { FarmerModel } from '../../models/farmer.model';

@Component({
  selector: 'app-farmer-card',
  templateUrl: './farmer-card.component.html',
  styleUrls: ['./farmer-card.component.scss'],
})
export class FarmerCardComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  @Input() farmer: FarmerModel;
}
