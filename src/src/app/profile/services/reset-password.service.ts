import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API_TOKEN } from '../../api.token';

@Injectable()
export class ResetPasswordService {
  constructor(private http: HttpClient,
    @Inject(API_TOKEN) private api: string) {
  }

  // Function is used to reset the password
  resetPassword(formData): Observable<any> {
    return this.http.put<Observable<any>>(this.api + `/profile/resetpassword`, formData)
      .retry(1)
      .do((res: any) => {
        return res.data;
      })
      .catch(err => Observable.of(err));
  }
}
