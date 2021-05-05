import { Component, Input, OnInit } from '@angular/core';
import { FarmerModel } from 'src/app/farmer-management/models/farmer.model';

@Component({
  selector: 'app-farmer-view-list',
  templateUrl: './farmer-view-list.component.html',
  styleUrls: ['./farmer-view-list.component.scss'],
})
export class FarmerViewListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() public isGridView: boolean;
  @Input() public isListView: boolean;
  @Input() public farmerList: FarmerModel[] = [];

}
