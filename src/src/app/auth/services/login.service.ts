import { of } from 'rxjs/observable/of';
import { UserProfile } from './user-profile.interface';
import { Database } from '@ngrx/db';
import { Store } from '../../store';
import { AuthService } from './auth.service';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toArray';

import { API_TOKEN } from '../../api.token';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';



@Injectable()
export class LoginService {
  private header: HttpHeaders;

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private db: Database,
    private http: HttpClient,
    private authService: AuthService,
    @Inject(API_TOKEN) private url: string) {

    this.header = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded');
  }
  login(credential: { username: string, password: string }): Observable<any> {
    return this.http.post<Observable<any>>(this.url + '/login', credential)
      .retry(1)
      .do((res: any) => {
        this.authService.saveToken(res.token.token);
      })
      .catch(err => Observable.throw(err));
  }


  getUserProfile(): Observable<string> {
    return this.db.query('id_token')
      .toArray()
      .map((tokens: any[]) => {
        if (tokens.length) {
          const profile = this.jwtHelper.decodeToken(tokens[0]).id;
          return JSON.stringify(profile);
        }
      });
  }
  // checks is the JWT token is valid; returns Boolean
  get isLoggedIn(): Boolean {
    return tokenNotExpired();
  }
}
