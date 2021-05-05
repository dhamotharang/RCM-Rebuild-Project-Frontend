import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selectable',
  templateUrl: './selectable.component.html',
  styleUrls: ['./selectable.component.scss'],
})
export class SelectableComponent implements OnInit {
  @Input() public selectableItems: any[];
  @Input() public headerName: string;

  public searchString: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  public get items() {
    if (this.searchString) {
      return this.selectableItems.filter((item) => {
        const fullName = `${item.first_name} ${item.last_name}`;
        const searchValue = this.searchString.toLowerCase();
        return (
          item.first_name.toLowerCase().indexOf(searchValue) >= 0 ||
          item.last_name.toLowerCase().indexOf(searchValue) >= 0 ||
          fullName.toLowerCase().indexOf(searchValue) >= 0
        );
      });
    } else {
      return this.selectableItems;
    }
  }

  public get allowConfirmSelection() {
    return this.selectableItems.filter((item) => item.selected).length > 0;
  }

  public onSearchInputChange(event) {
    this.searchString = event.detail.value;
  }

  public confirmItems() {
    this.modalCtrl.dismiss(
      this.selectableItems.filter((item) => item.selected)
    );
  }

  public selectAllItems() {
    this.selectableItems.forEach((item) => (item.selected = true));
  }

  public clearSelectedItems() {
    this.selectableItems.forEach((item) => (item.selected = false));
  }

  public handleClose() {
    this.modalCtrl.dismiss(null);
  }
}
