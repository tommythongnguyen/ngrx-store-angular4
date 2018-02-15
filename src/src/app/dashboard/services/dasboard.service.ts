
import { Store } from '../../store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';

import { Observable } from 'rxjs/Observable';

import { API_TOKEN } from '../../api.token';

interface IpParams {
    fromDate: any;
    toDate: any;
    tenantName: string | null;
    code: string;
    port: string;
}
export interface ReportsDataResponse {
    status: string;
    data: any[];
    [propName: string]: any;
}
@Injectable()
export class DashboardService {
    constructor(
        private http: HttpClient,
        @Inject(API_TOKEN) private api: string,
        private store: Store) { }

    getIpReportsData(fromDate, toDate, tenantName: string | null, code: string, port: string) {
        const params = this._generateHttpParams({ fromDate, toDate, tenantName, code, port });

        return this.http.get<ReportsDataResponse>(this.api + '/nginx_logs/ip', { params: params })
            .retry(1)
            .do(next => {
                if (next.errorCode === '204') {
                    this.store.set('ipReportsError', 204);
                }
                this.store.set('ipReportData', next.data);
            })
            .catch(err => {
                this.store.set('ipReportData', undefined);
                this.store.set('ipReportsError', 500);
                return Observable.of(err);
            });
    }

    getIpAddressData(fromDate, toDate, tenantName: string | null, code: string, port: string, ip: string) {
        const params = this._generateHttpParams({ fromDate, toDate, tenantName, code, port });

        return this.http.get<ReportsDataResponse>(this.api + `/nginx_logs/ip/${ip}`, { params: params })
            .retry(1)
            .do((res: any) => {
                return this.store.set('ipDetails', res.data);
            })
            .catch(err => {
                this.store.set('ipDetails', undefined);
                return Observable.of(err);
            });
    }

    private _generateHttpParams(paramObject: IpParams) {
        return new HttpParams()
            .set('fromDate', paramObject.fromDate)
            .set('toDate', paramObject.toDate)
            .set('tenantName', paramObject.tenantName)
            .set('code', paramObject.code)
            .set('port', paramObject.port);
    }
}
