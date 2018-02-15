import { TenantGroupService } from '../../services/tenant-group.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '../../../store';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscribable } from 'rxjs/Observable';
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/concatMap';

import { TenantGroup, Tenant } from '../../../state';
import AdminConstant from '../../../admin.constant';
import { CustomValidators } from '../../../utils/custom-validators/custom-validators';

@Component({
    selector: 'add-tenant-group',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['add-tenant-group.component.scss'],
    templateUrl: 'add-tenant-group.component.html'
})

export class AddTenantGroupComponent implements OnInit {

    infoTenant$: Observable<Tenant> = this.store.select('currentTenant')
        .filter(Boolean)
        .distinctUntilChanged()
        .share();
    groupForm: FormGroup;
    private tenantID: string;

    errMessage: string;

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private activatedRoute: ActivatedRoute,
        private tenantGroupService: TenantGroupService,
        private router: Router) {
    }

    ngOnInit() {

        this.infoTenant$.subscribe((tenantData: Tenant) => {
            this.tenantID = tenantData.id;
        });

        this.groupForm = this.fb.group({
            groupname: ['', [Validators.required]],
            endusers: this.fb.array([])
        });

        // add enduser
        this.addEndUser();
    }

    onSubmit() {
        const formData = Object.assign({}, this.groupForm.value, { tenant: this.tenantID });
        this.tenantGroupService.addTenantGroup(formData)
        .subscribe(res => {
            this.router.navigate(['home/tenantInfo/groups']);
        });
    }

    goToGroupProvision() {
        this.router.navigate(['home/tenantInfo/groups']);
    }

    // Function is used to add new end user block
    addEndUser() {
        const control = <FormArray>this.groupForm.controls['endusers'];
        const enduserCtrl = this.initEndUser();
        control.push(enduserCtrl);
    }

    // Function is used to remove end user block
    removeEndUser(i: number) {
        const control = <FormArray>this.groupForm.controls['endusers'];
        control.removeAt(i);
    }

    // Get the end user form element
    initEndUser() {
        return this.fb.group({
            firstname: ['', [Validators.required, CustomValidators.Alpha, Validators.maxLength(20)]],
            lastname: ['', [Validators.required, CustomValidators.Alpha, Validators.maxLength(20)]],
            ldapid: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(9)]],
            email: ['', [Validators.required, CustomValidators.customEmail]]
        });
    }
}
