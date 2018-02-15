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

interface UserSessionParams {
    status: string;
}

export interface UserSessionKillResponse {
    status: string;
    errorCode?: Number;
    errorDetail?: string;
}

@Injectable()
export class ReportService {

    constructor(private http: HttpClient,
        private store: Store,
        @Inject(API_TOKEN) private api: string
    ) {
    }

    // Function is used to fetch all session data for end users
    getUserSessions(status) {
        const params = this._generateUserSessionHttpParams({ status: status });
        return this.http.get<DataResponse>(this.api + '/reports/usersessions', {params: params})
            .retry(1)
            .do(res => {
                this.store.set('userSessionLogData', res.data);
            })
            .catch(err => {
                return Observable.of(err);
            });
    }

    // Function is used to kill the end user session
    killSession (sessions, status) {

      const observableBatch = [];

        sessions.forEach((session, key) => {
            observableBatch.push(
                this.http.put<UserSessionKillResponse>(this.api + '/reports/usersessions/' + session.id, {
                    status: status
                })
            );
        });
        return Observable.forkJoin(observableBatch).do((res: any) => {
            let allUserSession;
            allUserSession = [];
            this.store.value.userSessionLogData.forEach(userSession => {
                    // return true;
                    console.log(userSession);
                    const getFilterdSession = userSession.filter(session => {
                        let returnValue;
                        sessions.forEach(killSession => {
                            if (killSession.id === session.id) {
                                returnValue = false;
                            }
                        });
                        return (returnValue === false) ? false : true;
                    });
                    if (getFilterdSession.length > 0) {
                        allUserSession.push(getFilterdSession);
                    }
                });
            this.store.set('userSessionLogData', Object.assign([], allUserSession));
        }).catch(err => {
            return Observable.throw(err);
        });
    }

    private _generateUserSessionHttpParams(paramObject: UserSessionParams) {
        return new HttpParams()
            .set('status', paramObject.status);
    }

}
