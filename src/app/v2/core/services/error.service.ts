import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, TimeoutError } from 'rxjs';
import { LogService } from 'src/app/v2/core/services/log.service';

export interface IErrorService {
  handleError(service: string, method: string);
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements IErrorService {

  constructor(private logService: LogService) { }

  public handleError(service: string, method: string) {
    return (error: any) => {

      if (error instanceof TimeoutError) {
        return throwError('Error: ' + error.message);
      }

      if (error instanceof HttpErrorResponse) {
        let errorText = "";
        
        if (error.error.message) {
          errorText = error.error.message
        }

        let errorStatus = error.status ? error.status : '';
        let message = errorStatus + '<br>' + errorText;
        
        this.logService.log(service, method, message).subscribe();

        return throwError('Service: ' + service + '<br> Method: ' + method + '<br> Error status: ' + message);
      }

    }
  }
}
