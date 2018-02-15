import { Store } from '../../store';
import { AuthService } from '../../auth/services/auth.service';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/of';

import { API_TOKEN } from '../../api.token';

interface ValidateLinkParams {
    link: string | null;
}

@Injectable()
export class ActivationService {
  private header: HttpHeaders;
  constructor(private http: HttpClient,
    private authService: AuthService,
    @Inject(API_TOKEN) private api: string) {
  }
  // Function is used to fetch activation link data
    validateLink(link: string | null) {
        const params = this._generateLinkHttpParams({ 'link': link });

        return this.http.get<any>(this.api + '/activate', { params: params })
            .retry(1)
            .do(res => res.data)
            .catch(err => {
                console.log('Error :', err);
                return Observable.of(err);
            });
    }

    // Function is used to save group data
    savePassword(formData: any): Observable<any> {
        console.log(formData);
        return this.http.post<Observable<any>>(this.api + '/activate', formData)
            .retry(1)
            .do((res: any) => {
                return res.data;
            })
            .catch(err => Observable.of(err));
    }

    // Function is used to resend activation link
    resendLink(link: string): Observable<any> {
        return this.http.post<Observable<any>>(this.api + '/activate/resend', {link: link})
            .retry(1)
            .do((res: any) => {
                return res.data;
            })
            .catch(err => Observable.of(err));
    }

    private _generateLinkHttpParams(paramObject: ValidateLinkParams) {
        return new HttpParams()
            .set('link', paramObject.link);
    }
}
