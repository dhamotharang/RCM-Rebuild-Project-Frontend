import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class LocationResolverService implements Resolve<any>{

  constructor(private locationService: LocationService) { }
  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot) {
    return this.locationService.loadLocationLookups();
  }
}
