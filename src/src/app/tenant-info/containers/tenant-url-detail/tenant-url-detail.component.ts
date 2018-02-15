import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import AdminConstant from '../../../admin.constant';
import { AuthService } from '../../../auth/services/auth.service';
import { UserProfile } from '../../../auth/services/user-profile.interface';
import { Tenant, TenantUrlData } from '../../../state';
import { Store } from '../../../store';
import { CustomValidators } from '../../../utils/custom-validators/custom-validators';
import { AsyncValidators } from '../../../utils/custom-validators/async-validators';
import { TenantInfoService } from '../../services/tenant-info.service';
import {AsyncValidatorService} from '../../../utils/services/async.service';

@Component({
    selector: 'tenant-url-detail',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-url-detail.component.scss'],
    templateUrl: 'tenant-url-detail.component.html'
})

export class TenantUrlDetailComponent implements OnInit, OnDestroy {
    urlForm: FormGroup;

    tenantUrlData: TenantUrlData;
    GroupData$: Observable<any>;
    ApproverData$: Observable<any>;

    infoTenant$: Observable<Tenant> = this.store.select('currentTenant')
        .filter(Boolean)
        .distinctUntilChanged();

    _currentTenantID: string;

    // --- group dropdown----
    showGroupDropdown = false;
    selectedGroupIds = [];

    // ------ DatePicker input -----
    fromDateValue = new Date();
    toDateValue = new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000));
    maxDateValue = new Date(new Date().setFullYear(new Date().getFullYear() + 100));
    urlValue: any;
    showToDate = false;
    showFromDate = false;
    checkAll = true;
    errMessage: string;
    tenantID: string;

    private _actionType: string; // to differentiate the Add New and Edit UrlData
    private _userProfile: UserProfile;
    private _saveTenantUrlSubscription: Subscription;
    private _editTenantUrlSubscription: Subscription;
    private getMethodVals = { get: true, post: true, delete: true, put: true, options: true };

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private store: Store,
        private tenantInfoService: TenantInfoService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private asyncValidatorService: AsyncValidatorService,
        private renderer: Renderer2) {
        this.router.events
            .subscribe((val) => {
                if (val instanceof NavigationEnd) {
                    console.log('params: ', val.urlAfterRedirects);
                    const segments = val.urlAfterRedirects.split('/');
                    this._actionType = segments[segments.length - 1];
                }
            });
    }

    ngOnInit() {
        this.store.select('selectedTenantUrlData')
            .filter(Boolean)
            .distinctUntilChanged()
            .subscribe((val: TenantUrlData) => {
                console.log('###### Selected tenant url data ######tenantUrlData: ', val);
                this.tenantUrlData = val;
            });

        this._userProfile = this.authService.getUserProfile();

        this.urlForm = this.fb.group({
            url: [this.tenantUrlData ? this.tenantUrlData.url : '',
                    [Validators.required, CustomValidators.UrlValidation],
                    AsyncValidators.duplicateDBURL(
                        this.asyncValidatorService,
                        AdminConstant.ENTITY_TYPES.URL,
                        this.tenantID,
                        (this.tenantUrlData ? this.tenantUrlData.id : ''))
            ],
            type: this.tenantUrlData ? this.tenantUrlData.type : 'Domain',
            // group: [(this.tenantUrlData && this.tenantUrlData.group.length > 0) ? this.tenantUrlData.group : [], [Validators.required]],
            approver: this.tenantUrlData ? this.tenantUrlData.approver : '',
            settings: this.fb.group({
                port: this.tenantUrlData ? this.tenantUrlData.settings.port : 'Default',
                customport: this.tenantUrlData ? this.tenantUrlData.settings.customport : '443',
                method: this.fb.group({
                    get: [this.tenantUrlData && this.tenantUrlData.settings.method.get === 'false' ? false : true, [CustomValidators.CheckBoxRequired(this.getMethodVals)]],
                    post: [this.tenantUrlData && this.tenantUrlData.settings.method.post === 'false' ? false : true, [CustomValidators.CheckBoxRequired(this.getMethodVals)]],
                    put: [this.tenantUrlData && this.tenantUrlData.settings.method.put === 'false' ? false : true, [CustomValidators.CheckBoxRequired(this.getMethodVals)]],
                    delete: [this.tenantUrlData && this.tenantUrlData.settings.method.delete === 'false' ? false : true, [CustomValidators.CheckBoxRequired(this.getMethodVals)]],
                    // options: [this.tenantUrlData && this.tenantUrlData.settings.method.options === 'false' ? false : true, [CustomValidators.CheckBoxRequired(this.getMethodVals)]]
                }),
                is_ntml: this.tenantUrlData && this.tenantUrlData.settings.is_ntml === 'true' ? true : false,
                access_resource: this.tenantUrlData ? this.tenantUrlData.settings.access_resource : 'onPremise',
                protocol: this.tenantUrlData ? this.tenantUrlData.settings.protocol : 'https',
                urlip: this.tenantUrlData ? this.tenantUrlData.settings.urlip : '',
                enableflag: this.tenantUrlData && this.tenantUrlData.settings.enableflag === 'false' ? false : true,
                configuration: this.fb.group({
                    geo: this.tenantUrlData && this.tenantUrlData.settings.configuration.geo === 'false' ? false : true,
                    device: this.tenantUrlData && this.tenantUrlData.settings.configuration.device === 'false' ? false : true,
                    userid: this.tenantUrlData && this.tenantUrlData.settings.configuration.userid === 'false' ? false : true,
                    cookie: this.tenantUrlData && this.tenantUrlData.settings.configuration.cookie === 'false' ? false : true
                })
            })
        });

        this.GroupData$ = this.infoTenant$.concatMap((tenant: Tenant) => {
            this.tenantID = tenant.id;
            this.resetFormsValidation();
            return this.tenantInfoService.getGroupList(tenant.id)
                .map(res => res.data);
        });

        this.ApproverData$ = this.infoTenant$.concatMap((tenant: Tenant) => {
            return this.tenantInfoService.getApproverList(tenant.id, AdminConstant.TENANT_APPROVER)
                .map(res => res.data);
        });

        // --------register Event Handler -----------
        this.renderer.listen('document', 'click', () => {
            this.showGroupDropdown = false;
        });
    }

    get isTenantAdmin(): boolean {
        if (this._userProfile.role === AdminConstant.TENANT_ADMIN) {
            return true;
        }
        return false;
    }

    resetFormsValidation() {
        if (this.urlForm) {
            this.urlForm.controls.url.setAsyncValidators([
                AsyncValidators.duplicateDBURL(this.asyncValidatorService, AdminConstant.ENTITY_TYPES.URL, this.tenantID,
                     (this.tenantUrlData ? this.tenantUrlData.id : ''))
            ]);
        }
    }

    get isSelectedPortCustom(): boolean {
        const SETTING = this.urlForm.controls.settings as FormGroup;
        const PORT = SETTING.controls.port as FormControl;
        return PORT.value === 'Custom';
    }

    toggleAllMethod($event) {
        this.checkAll = !this.checkAll;
        const SETTING = this.urlForm.controls.settings as FormGroup;
        const METHOD = SETTING.controls.method as FormGroup;
        METHOD.controls.get.setValue(this.checkAll);
        METHOD.controls.post.setValue(this.checkAll);
        METHOD.controls.put.setValue(this.checkAll);
        METHOD.controls.delete.setValue(this.checkAll);
        METHOD.controls.options.setValue(this.checkAll);
    }

    resetFormMethods(type) {
        const SETTING = this.urlForm.controls.settings as FormGroup;
        const METHOD = SETTING.controls.method as FormGroup;
        this.getMethodVals[type] = METHOD.controls[type].value;
        METHOD.controls[type].setValidators([
            CustomValidators.CheckBoxRequired(this.getMethodVals)
        ]);
    }

    onToggleFromDate($event) {
        this.showFromDate = !this.showFromDate;
    }
    onToggleToDate($event) {
        this.showToDate = !this.showToDate;
    }

    onSelectFromDate($event: Date) {
        this.fromDateValue = $event;
        this.onToggleFromDate($event);
    }

    stripUrl() {
        const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[0-9a-zA-Z_\-]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        const url = this.urlForm.controls.url.value;
        const SETTING = this.urlForm.controls.settings as FormGroup;
        // const METHOD = SETTING.controls.protocol as FormGroup;
        if (url.length === 0 || !regex.test(url)) {
            return false;
        } else {
            let newUrl;
            let host;
            // vm.protocol = '';
            if (url.indexOf('https') > -1) {
                newUrl = url.split('https://')[1];
                host = this.splitUrl(newUrl);
                SETTING.controls.protocol.setValue('https');
            } else if (url.indexOf('http') > -1) {
                newUrl = url.split('http://')[1];
                host = this.splitUrl(newUrl);
                SETTING.controls.protocol.setValue('http');
            } else {
                host = this.splitUrl(url);
                console.log('host 1 :: ', host);
            }
            console.log('host 2 ::', host);
            if (host === false) {
                // vm.warnUrlValidation = true;
                return false;
            } else {
                if (!regex.test(host)) {
                    console.log('im here ');
                    SETTING.controls.port.setValue('Default');
                    SETTING.controls.customPort.setValue('443');
                    return false;
                } else {
                    console.log('host :: ', host);
                    this.urlForm.controls.url.setValue(host.trim());
                    // vm.urlName = host.trim();
                    // angular.element('#domain').focus();
                    return host;
                }
            }
        }
    }

    splitUrl(url) {
        let reqUrl;
        let tempArr;
        let customPort;
        let host;
        const SETTING = this.urlForm.controls.settings as FormGroup;
        if (url.indexOf('www.') > -1) {
            tempArr = url.split('www.');
            url = tempArr[1];
        }
        if (url.indexOf(':') > -1) {
            tempArr = url.split(':');
            if (tempArr.length > 0) {
                host = tempArr[0];
                const temp = tempArr[1].split('/');
                if (temp.length > 1 && temp[1] !== '') {
                    this.urlForm.controls.type.setValue('App');
                } else {
                    this.urlForm.controls.type.setValue('Domain');
                }
                customPort = +temp[0];
                if (customPort > -1 && customPort < 65536) {
                    if (customPort !== 80 && customPort !== 443) {
                        SETTING.controls.port.setValue('Custom');
                        SETTING.controls.customport.setValue(customPort);
                    } else {
                        SETTING.controls.port.setValue('Default');
                        SETTING.controls.customport.setValue('443');
                    }
                } else {
                    return false;
                }
                reqUrl = '';
                for (let j = 1; j < temp.length; j++) {
                    if (j === temp.length - 1) {
                        reqUrl += temp[j];
                    } else {
                        reqUrl += temp[j] + '/';
                    }
                }
                if (reqUrl === '') {
                    host = tempArr[0];
                } else {
                    host = tempArr[0] + '/' + reqUrl;
                }
            }
        } else {
            SETTING.controls.port.setValue('Default');
            SETTING.controls.customport.setValue('443');
            if (url.indexOf('/') > -1) {
                const tempurl = url.split('/');
                if (tempurl.length > 1 && tempurl[1] !== '') {
                    this.urlForm.controls.type.setValue('App');
                } else {
                    this.urlForm.controls.type.setValue('Domain');
                }
            } else {
                this.urlForm.controls.type.setValue('Domain');
            }
            host = url;
        }
        return host;
    }
    /**
     * onSelectToDate: + auto update base on the FromDate and activeDateNav
    */
    onSelectToDate($event: Date) {
        this.toDateValue = $event;
        this.onToggleToDate($event);
    }

    onSubmit() {
        console.log('############### saving the url data ############');
        if (this._actionType === 'edit') {
            const formData = Object.assign({}, this.urlForm.value,
                {
                    effect_from: this.fromDateValue,
                    effect_to: this.toDateValue,
                    id: this.tenantUrlData.id,
                    tenant: '',
                    group: this.selectedGroupIds
                });

           this._editTenantUrlSubscription = this.infoTenant$.concatMap((tenant: Tenant) => {
                formData.tenant = tenant.id;
                return this.tenantInfoService.editTenantUrlData(formData);
            })
                .subscribe(
                next => {
                    this.goToURLProvision();
                }// this.router.navigate(['../'], { relativeTo: this.activatedRoute })
                );
        } else { // add
            const formData = Object.assign({}, this.urlForm.value,
                {
                    effect_from: this.fromDateValue,
                    effect_to: this.toDateValue,
                    tenant: '',
                    group: this.selectedGroupIds
                });

            console.log('formData: ', formData);
            this._saveTenantUrlSubscription = this.infoTenant$.concatMap((tenant: Tenant) => {
                formData.tenant = tenant.id;
                return this.tenantInfoService.addTenantUrlData(formData);
            })
                .subscribe(
                next => {
                    this.store.set('selectedTenantUrlData', undefined);
                    this.goToURLProvision();
                }// this.router.navigate(['../'], { relativeTo: this.activatedRoute })
                );

        }
    }

    goToURLProvision() {
        this.router.navigate(['home/tenantInfo/urlsList']);
    }

    // --- group dropdown------
    onGropDropdownToggle(actionType: string) {
        if (actionType === 'toggle') {
            this.showGroupDropdown = !this.showGroupDropdown;
        } else if (actionType === 'close') {
            this.showGroupDropdown = false;
        } else if (actionType === 'open') {
            this.showGroupDropdown = true;
        }
    }

    onGroupDropdownSelected(groupList: any[]) {
        console.log('onUrlGroupDropdownSelected: ', groupList);

        this.emptyArray(this.selectedGroupIds);
        groupList.forEach(group => this.selectedGroupIds.push(group.id));
    }


    emptyArray(arr: any[]) {
        while (arr.length) {
            arr.pop();
        }
    }

    ngOnDestroy() {
        if (this._saveTenantUrlSubscription) {
            this._saveTenantUrlSubscription.unsubscribe();
        }
        if (this._editTenantUrlSubscription) {
            this._editTenantUrlSubscription.unsubscribe();
        }
    }
}
