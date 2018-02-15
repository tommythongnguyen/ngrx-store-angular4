import { Injectable, forwardRef, Inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + AuthService.authToken)
    });

    return next.handle(clonedRequest)
      .catch(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // JWT expired, need to redirect to login page
            return Observable.throw(err);
          } else {
            return Observable.throw(err);
          }
        }
      });
  }
}

