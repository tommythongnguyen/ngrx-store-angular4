import { AuthService } from './../../auth/services/auth.service';

import { API_TOKEN } from './../../api.token';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SettingService {
    private headers: HttpHeaders;
    constructor(
        private http: HttpClient,
        private authService: AuthService,
        @Inject(API_TOKEN) private api: string) {

        this.headers = new HttpHeaders()
            .set('Authorization', `Bearer ${this.authService.getAuthToken()}`);
    }

    submitWhitelistIpsForm(tenantId: string, ips: string[]) {
        return this.http.put<Observable<any>>(this.api + `/tenants/${tenantId}/whitelist`, { whitelistIps: ips })
            .retry(1)
            .map((res: any) => {
                if (res.statusCode === 200 && !!res.data) {
                    return res.data;
                }
                return null;
            })
            .catch(err => Observable.of(null));
    }

    submitTwoFactorForm(tenantId: string, twoFactorDetail: any) {
        return this.http.put<Observable<any>>(this.api + `/tenants/${tenantId}/twofa`, twoFactorDetail)
            .retry(1)
            .map((res: any) => {
                if (res.statusCode === 200 && !!res.data) {
                    return res.data;
                }
                return null;
            })
            .catch(err => Observable.of(null));
    }

    submitGateWay(tenantId: string, dnsGateway: {gateway: string}) {
        return this.http.put<Observable<any>>(this.api + `/tenants/${tenantId}/gateway`, dnsGateway, {headers: this.headers})
            .retry(1)
            .map((res: any) => {
                if (res.statusCode === 200 && !!res.data) {
                    return res.data;
                }
                return null;
            })
            .catch(err => Observable.of(null));
    }

    validateActiveDirectoryForm(tenantId: string, activeDirectory: any, gateway_dns: string) {
        const dirSetting = Object.assign({}, activeDirectory, { gateway_dns });
        return this.http.post<Observable<any>>(this.api + `/tenants/${tenantId}/active_directory/validate`, dirSetting)
            .retry(1)
            .catch(err => Observable.throw(err));
    }

    submitActiveDirectoryForm(tenantId: string, activeDirectory: any) {
        return this.http.post<Observable<any>>(this.api + `/tenants/${tenantId}/active_directory/submit`, activeDirectory)
            .retry(1)
            .map((res: any) => {
                if (res.statusCode === 200 && !!res.data) {
                    return res.data;
                }
                return null;
            })
            .catch(err => Observable.of(null));
    }

    deployTenantSettingForm(tenantId: string) {
        return this.http.post<Observable<any>>(this.api + `/tenants/${tenantId}/deploy`, {})
            .catch(err => Observable.throw(err));
    }
}
