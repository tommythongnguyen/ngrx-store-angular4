import { Store } from '../../store';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_TOKEN } from '../../api.token';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/retry';

export interface DataResponse {
    status: string;
    data?: any[];
    errorCode?: Number;
    errorDetail?: string;
}

@Injectable()
export class ActivityService {

    constructor(private http: HttpClient,
        private store: Store,
        @Inject(API_TOKEN) private api: string
    ) {
    }

    // Function is used to fetch activity data
    getActivities() {

        return this.http.get<DataResponse>(this.api + '/activities')
            .retry(1)
            .do(res => {
                this.store.set('globalActivityData', res);
            }
            )
            .map((noContent: any) => {
                if (noContent.errorCode === '204') {
                    return Observable.throw(noContent);
                }
            })
            .catch(err => {
                this.store.set('globalActivityData', undefined);
                return Observable.of(err);
            });
    }

}
