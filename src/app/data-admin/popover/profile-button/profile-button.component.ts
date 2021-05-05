import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss'],
})
export class ProfileButtonComponent implements OnInit {

  @Input() public avatar: string;
  @Input() public name: string;
  @Input() public accessLevelText: string;

  constructor() { }

  ngOnInit() {}

}
