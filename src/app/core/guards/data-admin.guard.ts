import { Injectable } from '@angular/core';
import { UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Role } from '../enum/role.enum';

/**
 * @deprecated Use DataAdminGuard in v2 folder instead
 */
@Injectable({
  providedIn: 'root'
})
export class DataAdminGuard implements CanActivate {
  constructor(public auth: AuthenticationService, private router: Router) {}
 
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  {
  
    const gao = this.auth.userInfo.government_agency_office;
    if (gao === Role.DATA_ADMIN || gao === Role.REGIONAL_DATA_ADMIN) {
      return true;
    } else {
      return this.router.parseUrl('/data-admin/farmer-management/farmer-list');
    }
  }
}
