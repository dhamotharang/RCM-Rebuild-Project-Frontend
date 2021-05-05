import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import { Role } from 'src/app/core/enum/role.enum';

@Directive({
  selector: '[appDisable]'
})
/** @deprecated use DisableDirective inside v2 folder */
export class DisableDirective implements OnInit {

  @Input('appDisable') userAccess;
  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (!!this.userAccess && this.userAccess === Role.PUBLIC ) {
      this.el.nativeElement.disabled = true;
    }
  }
}
