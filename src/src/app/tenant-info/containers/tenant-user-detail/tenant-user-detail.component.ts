import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import AdminConstant from '../../../admin.constant';
import { Tenant, TenantUser, UserRole } from '../../../state';
import { Store } from '../../../store';
import { CustomValidators } from '../../../utils/custom-validators/custom-validators';
import { AsyncValidators } from '../../../utils/custom-validators/async-validators';
import { TenantInfoService } from '../../services/tenant-info.service';
import { TenantUserService } from '../../services/tenant-user.service';
import {AsyncValidatorService} from '../../../utils/services/async.service';

@Component({
    selector: 'tenant-user-detail',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-user-detail.component.scss'],
    templateUrl: 'tenant-user-detail.component.html'
})

export class TenantUserDetailComponent implements OnInit {

    businessManagers$: Observable<TenantUser>;
    userRoles: Array<UserRole>;
    infoTenant$: Observable<Tenant> = this.store.select('currentTenant')
        .filter(Boolean)
        .distinctUntilChanged()
        .share();
    userForm: FormGroup;
    private tenantID: string;

    errMessage: string;

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private activatedRoute: ActivatedRoute,
        private tenantUserService: TenantUserService,
        private tenantInfoService: TenantInfoService,
        private router: Router,
        private asyncValidatorService: AsyncValidatorService) {

        // Fetch Business Manager user data
        this.businessManagers$ = this.infoTenant$.concatMap((tenant: Tenant) => {
            this.tenantID = tenant.id;
            return this.tenantInfoService.getUsersByRole(tenant.id, AdminConstant.BUSINESS_MANAGER)
                .map(res => res);
        });
        // Fetch users roles
        this.tenantInfoService.getUserRoles().subscribe(res => {
            console.log(res);
            this.userRoles = res;
        });
    }

    onSubmit() {
        const userFormData = Object.assign({}, { tenant: this.tenantID }, this.userForm.value);
        this.tenantUserService.addTenantUserData(userFormData)
            .subscribe(res => {
                this.router.navigate(['home/tenantInfo/users']);
            });
    }

    ngOnInit() {

        this.userForm = this.fb.group({
            firstname: ['', [Validators.required, Validators.maxLength(20), CustomValidators.Alpha]],
            lastname: ['', [Validators.required, Validators.maxLength(20), CustomValidators.Alpha]],
            userid: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(9)],
                AsyncValidators.asyncValidator(this.asyncValidatorService, AdminConstant.ENTITY_TYPES.ADMIN_USER)],
            email: ['', [Validators.required, CustomValidators.customEmail]],
            approver: ['', [Validators.required]],
            role: ['', [Validators.required]]
        });
    }

    goToUserProvision() {
        this.router.navigate(['home/tenantInfo/users']);
    }
}
