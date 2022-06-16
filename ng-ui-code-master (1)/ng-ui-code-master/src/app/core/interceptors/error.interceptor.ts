import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { SharedService } from '@app/shared/shared.service';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,private sharedService:SharedService ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err) => {           
            this.sharedService.displayLoader(false);
            const errResp = err as HttpErrorResponse;
            if (errResp.status === 401 || errResp.status == 403) {
                // auto logout if 401 response returned from api
                //this.authenticationService.logout();
                this.router.navigate(['forbidden']);
            }
            if(errResp.status==400 && errResp.error?.message.indexOf("'authCode' is not present")>0){
                this.router.navigate(['login']);
            }

            const error =err.error?.error || err.message;
            this.sharedService.add({severity:'error', summary:'Error', detail:error})
           // this.notificationService.show(errResp.message, 'error');
            return throwError(error);
        }))
    }
}
