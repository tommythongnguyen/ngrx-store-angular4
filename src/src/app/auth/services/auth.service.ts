import { UserProfile } from './user-profile.interface';
import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { CookieService } from 'ng2-cookies';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthService {
  static authToken = localStorage.getItem('id_token') || undefined;

  jwtHelper: JwtHelper = new JwtHelper();

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private cookieService: CookieService) { }



  getAuthToken(): any {
    return localStorage.getItem('id_token') || null;
  }

  get authToken(): any {
    return localStorage.getItem('id_token') || null;
  }

  // save token to localStorage when you user first time login
  saveToken(cookies: any): UserProfile {
     localStorage.setItem('id_token', cookies);
     AuthService.authToken = cookies;

     return this.jwtHelper.decodeToken(cookies).id;
  }


  // checks is the JWT token is valid; returns Boolean
  get isLoggedIn(): Observable<Boolean> {
    return Observable.of(tokenNotExpired('id_token'));
  }

  getUserProfile(): UserProfile {
    // --- get user' profile from decodeToken which sent from backend
    const cookies = localStorage.getItem('id_token');
    return this.jwtHelper.decodeToken(cookies).id;
  }



  deleteToken() {
    localStorage.removeItem('id_token');
  }

  /**
   * clear entire localStorage
   * delete token
  */
  logout() {
    this.deleteToken();
    // this.cookieService.delete('token');
  }
}
