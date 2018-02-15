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

interface AsyncValidatorParams {
    'type': string;
    'value': string;
    'excludeid': string;
    [propName: string]: any;
}


@Injectable()
export class AsyncValidatorService {
  private header: HttpHeaders;
  constructor(private http: HttpClient,
    private authService: AuthService,
    @Inject(API_TOKEN) private api: string) {
  }
  // Function is used to fetch activation link data
    checkAsyncValidation(type: string | null, value: string | null, excludeid: string = null) {
        const params = this._generateHttpParams({ 'type': type, 'value': value , 'excludeid' : excludeid});

        return this.http.get<any>(this.api + '/dbduplicate', { params: params })
            .retry(1)
            .do(res => res.data)
            .catch(err => {
                console.log('Error :', err);
                return Observable.of(err);
            });
    }

    // Function is used to fetch activation link data
    checkURLDBDuplicate(type: string | null, value: string | null, tenantID: string | null, excludeid: string = null) {
        const params = this._generateHttpParams({ 'type': type, 'tenant' : tenantID, 'value': value , 'excludeid' : excludeid});

        return this.http.get<any>(this.api + '/dbduplicate', { params: params })
            .retry(1)
            .do(res => res.data)
            .catch(err => {
                console.log('Error :', err);
                return Observable.of(err);
            });
    }

    private _generateHttpParams(paramObject: AsyncValidatorParams) {
        return new HttpParams()
            .set('type', paramObject.type)
            .set('value', paramObject.value)
            .set('tenant', paramObject.tenant)
            .set('excludeid', paramObject.excludeid);
    }
}
