import { CustomValidators } from '../../../utils/custom-validators/custom-validators';
import { AsyncValidators } from '../../../utils/custom-validators/async-validators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
import {AsyncValidatorService} from '../../../utils/services/async.service';
import AdminConstant from '../../../admin.constant';

export interface DetailConfig {
    name: string;
    domainname: string;
    description: string;
}
@Component({
    selector: 'tenant-detail-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-detail-form.component.scss'],
    template: `
        <form [formGroup]="detailForm" (ngSubmit)="submitForm()">
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="adminame">Tenant Name*</label>
                    <input type="text" class="form-control" id="tenantname"
                           placeholder="Enter Tenant Name"
                           formControlName="name">

                    <control-error  [parent]="detailForm"
                                    control="name" [errors]="{ dbduplicate: 'is not available', emptySpace:'empty space is not allowed' }">
                    </control-error>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="adminDomain">Domain Name*</label>
                    <input type="text" class="form-control" id="domainname"
                           placeholder="e.g: domain.com"
                           formControlName="domainname">

                    <control-error  [parent]="detailForm"
                                    control="domainname"
                                    label="Domain Name"
                                    [errors]="{domain: 'is incorrect format', dbduplicate: 'is not available'}">
                    </control-error>
                </div>
            </div>

            <div class="col-sm-12 padding-0">
                <div class="col-sm-12">
                    <div class="form-group">
                        <label for="adminid">Tenant Description*</label>
                        <textarea class="form-control min-width-80" id="tenantdesc"
                                  placeholder="Enter only alphabet letters for description"
                                  formControlName='description'>
                        </textarea>

                        <control-error  [parent]="detailForm"
                                        control="description"
                                        [errors]="{ alphanumeric: 'should contain letter and number only!'}">
                        </control-error>
                    </div>
                </div>
            </div>

            <div class="col-md-12 btn-controls-container">
                <div class="col-md-6"></div>
                <div class="col-md-6 btn-right-container">
                    <button type="submit" class="btn btn-sm btn-cust" [disabled]="detailForm.invalid">Next</button>
                </div>
            </div>
        </form>
    `,
})
export class TenantDetailFormComponent implements OnInit, OnChanges {
    detailForm: FormGroup;

    @Input() config: DetailConfig;
    @Input() tenantID: string;
    @Output() submit = new EventEmitter<DetailConfig>();
    constructor(private fb: FormBuilder,
    private asyncValidatorService: AsyncValidatorService) {
        this.detailForm = this.fb.group({
            name: [this.config ? this.config.name : '', [Validators.required, Validators.maxLength(20), CustomValidators.emptySpaceCheck],
        AsyncValidators.asyncValidator(this.asyncValidatorService, AdminConstant.ENTITY_TYPES.TENANT, true, this.tenantID)],
            domainname: [this.config ? this.config.domainname : '', [Validators.required, Validators.maxLength(25), CustomValidators.domain],
        AsyncValidators.asyncValidator(this.asyncValidatorService, AdminConstant.ENTITY_TYPES.DOMAIN, true, this.tenantID)],
            description: [this.config ? this.config.description : '', [Validators.required, Validators.maxLength(2000), CustomValidators.alphaNumeric]]
        });
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config && changes.config.currentValue) {
            this.resetFormValue();
        }
    }

    get formChanged(): boolean {
        const { name, domainname, description } = this.config;
        const formValue = this.detailForm.value;
        if (formValue['name'] !== name || formValue['domainname'] !== domainname || formValue['description'] !== description) {
            return true;
        }
        return false;
    }
    submitForm() {
        event.stopPropagation();
        event.preventDefault();
        this.submit.emit(this.detailForm.value);
        this.detailForm.reset();
    }

    onBtnResetClick() {
        this.resetFormValue();
    }

    resetFormValue() {
        this.detailForm.controls.name.setValidators([
            Validators.required, Validators.maxLength(20), CustomValidators.emptySpaceCheck
        ]);
        this.detailForm.controls.name.setAsyncValidators([
            AsyncValidators.asyncValidator(this.asyncValidatorService, AdminConstant.ENTITY_TYPES.TENANT, true, this.tenantID)
        ]);

        this.detailForm.controls.domainname.setValidators([
            Validators.required, Validators.maxLength(25), CustomValidators.domain
        ]);

        this.detailForm.controls.domainname.setAsyncValidators([
            AsyncValidators.asyncValidator(this.asyncValidatorService, AdminConstant.ENTITY_TYPES.DOMAIN, true, this.tenantID)
        ]);

        this.detailForm.updateValueAndValidity();
        const { name, domainname, description } = this.config;
        this.detailForm.setValue({ name, domainname, description });
    }
}
