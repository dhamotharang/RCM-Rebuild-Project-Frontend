import { Injectable } from '@angular/core';
import { UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Role } from 'src/app/v2/core/enums/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AllUserGuard implements CanActivate  {
  constructor(public auth: AuthenticationService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  {
    if (!this.auth.loggedInUser) {
      return this.router.parseUrl('/login');
    }

    const gao = this.auth.loggedInUser.gao;
    return (
        gao === Role.NATIONAL ||
        gao === Role.REGIONAL ||
        gao === Role.PROVINCIAL ||
        gao === Role.MUNICIPAL ||
        gao === Role.DATA_ADMIN ||
        gao === Role.REGIONAL_DATA_ADMIN ||
        gao === Role.PUBLIC
    );
  }
}
