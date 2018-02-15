import { TenantUserModel, IdsAndEamils } from './../../models/models';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { CustomValidators } from '../../../utils/custom-validators/custom-validators';
import { AsyncValidators } from '../../../utils/custom-validators/async-validators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {AsyncValidatorService} from '../../../utils/services/async.service';
import AdminConstant from '../../../admin.constant';


@Component({
    selector: 'tenant-users-form',
    styleUrls: ['tenant-users-form.component.scss'],
    templateUrl: 'tenant-users-form.component.html'
})
export class TenantUsersFormComponent implements OnInit, OnChanges {
    private usersCount = 0;

    usersForm: FormGroup;

    @Input() user: TenantUserModel;
    @Input() mode: string;
    @Input() currentStep: number;
    @Input() moveToStep: number;

    @Output() submit = new EventEmitter<any>();
    @Output() goBack = new EventEmitter<any>();

    constructor(private fb: FormBuilder,
        private asyncValidatorService: AsyncValidatorService) {
        this.usersForm = this.fb.group({
            firstname: [this.user ? this.user.firstname : '', [Validators.required, Validators.maxLength(20), CustomValidators.Alpha]],
            lastname: [this.user ? this.user.lastname : '', [Validators.required, Validators.maxLength(20), CustomValidators.Alpha]],
            userid: [this.user ? this.user.userid : '', [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(9),
                    CustomValidators.whiteSpaceCheck
                ],
                AsyncValidators.asyncValidator(this.asyncValidatorService, AdminConstant.ENTITY_TYPES.ADMIN_USER)
            ],
            email: [this.user ? this.user.email : '', [Validators.required, CustomValidators.customEmail]],
        });
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.user && changes.user.currentValue) {
            if (this.usersForm) {
                this.resetFormValueAndValidations();
            }
        }
    }

    getPropValues(arr: IdsAndEamils[], key: string): string[] {
        if (arr.length) {
            return arr.map((item: IdsAndEamils) => item[key]);
        }
        return [''];
    }

    submitForm() {
        this.usersCount += 1;
        event.stopPropagation();
        event.preventDefault();
        const formValue = Object.assign({}, this.user, this.usersForm.value);
        this.submit.emit(formValue);
        this.usersForm.reset();
    }

    get allowNextSaveBtn(): boolean {
        if (this.mode === 'Edit') {
            return true;
        } else {
            if (this.currentStep > this.moveToStep) {
                return true;
            }else if (this.usersForm.invalid) {
                return false;
            }
            return true;
        }
    }

    onBackBtnClick() {
        event.stopPropagation();
        event.preventDefault();
        // this.resetFormValue();
        this.usersForm.reset();
        this.goBack.emit();
    }

    resetFormValue() {
        this.resetFormValueAndValidations();
    }

    resetFormValueAndValidations() {
        if (this.user) {
            // update Validators
            this.usersForm.controls.email.setValidators([
                Validators.required,
                CustomValidators.domainMismatch(this.user.domainname),
                CustomValidators.customEmail,
                CustomValidators.duplicate(this.getPropValues(this.user.idsAndEmails, 'email'))
            ]);

            this.usersForm.controls.userid.setAsyncValidators([
                AsyncValidators.asyncValidator(this.asyncValidatorService, AdminConstant.ENTITY_TYPES.ADMIN_USER, true, this.user.id)
            ]);

            this.usersForm.controls.userid.setValidators([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(9),
                CustomValidators.whiteSpaceCheck,
                CustomValidators.duplicate(this.getPropValues(this.user.idsAndEmails, 'userid'))
            ]);
            this.usersForm.updateValueAndValidity();
        }
        const { firstname, lastname, userid, email } = this.user;
        this.usersForm.setValue({ firstname, lastname, userid, email });
    }
}
