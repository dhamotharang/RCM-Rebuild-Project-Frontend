import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * @deprecated Use LoaderOverlayService in v2 folder instead
 */
@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading = new BehaviorSubject(false);
  constructor() { }
}
