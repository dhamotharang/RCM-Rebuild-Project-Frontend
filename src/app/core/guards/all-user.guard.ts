import { Injectable } from '@angular/core';
import { UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Role } from '../enum/role.enum';

/**
 * @deprecated Use AllUserGuard in v2 folder instead
 */
@Injectable({
  providedIn: 'root'
})
export class AllUserGuard implements CanActivate  {
  constructor(public auth: AuthenticationService, private router: Router) {}
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  {
    if (!this.auth.userInfo) {
      return this.router.parseUrl('/login');
    }

    const gao = this.auth.userInfo.government_agency_office;
    return (gao === Role.NATIONAL ||
        gao === Role.REGIONAL ||
        gao === Role.PROVINCIAL ||
        gao === Role.MUNICIPAL ||
        gao === Role.DATA_ADMIN ||
        gao === Role.REGIONAL_DATA_ADMIN ||
        gao === Role.PUBLIC);
  }
}
