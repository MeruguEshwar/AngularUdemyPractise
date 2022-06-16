import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import { finalize } from "rxjs/operators";
import { AuthService } from "../service/auth.service";
import { SharedService } from "@app/shared/shared.service";

/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable({
  providedIn: "root",
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  requestCount = 0;
  constructor(private sharedService: SharedService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.sharedService.displayLoader(true);
    this.requestCount++;
    if (!/^(http|https):/i.test(request.url)) {
      request = request.clone({ url: environment.apiUrl + request.url });
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.requestCount--;
        if (this.requestCount === 0) {
          this.sharedService.displayLoader(false);
        }
      })
    );
  }
}
