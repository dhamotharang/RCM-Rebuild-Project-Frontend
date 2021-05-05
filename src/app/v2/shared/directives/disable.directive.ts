import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {Role} from '../../../core/enum/role.enum';

@Directive({
  selector: '[appDisable]'
})
export class DisableDirective implements OnInit {

  @Input('appDisable') userAccess;
  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (!!this.userAccess && this.userAccess === Role.PUBLIC ) {
      this.el.nativeElement.disabled = true;
    }
  }
}
