import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Subscription } from 'rxjs/Rx';

import ADMIN_CONSTANTS from '../../../admin.constant';
import { CustomValidators } from '../../../utils/custom-validators/custom-validators';
import { AsyncValidators } from '../../../utils/custom-validators/async-validators';
import { ResetPasswordService } from '../../services/reset-password.service';
import {AsyncValidatorService} from '../../../utils/services/async.service';

@Component({
    selector: 'reset-password',
    styleUrls: [`./reset-password.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
    subscription: Subscription;
    public invalidAuth: boolean;
    public errMessage: string;
    public userName: string;
    public userId: string;
    resetPasswordForm = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)],
        AsyncValidators.asyncValidator(this.asyncValidatorService, ADMIN_CONSTANTS.ENTITY_TYPES.CHANGE_PASSWORD, false)],
        newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
    });

    @Output() submitForm = new EventEmitter<any>();
    constructor(private fb: FormBuilder,
        private resetPasswordService: ResetPasswordService,
        private router: Router,
        private asyncValidatorService: AsyncValidatorService,
        private authService: AuthService) {
        const user = JSON.parse(localStorage.getItem('userProfile'));
        this.userName = user.firstname + ' ' + user.lastname;
        this.userId = user.userid;
    }

    ngOnInit() { }

    get isNotValidPassword(): boolean {
        if (this.resetPasswordForm.controls.newPassword.errors && this.resetPasswordForm.controls.newPassword.dirty) {
            return true;
        }
        return false;
    }

    resetPasswordFormValidations() {
        this.resetPasswordForm.controls.confirmPassword.setValidators([
            Validators.required,
            CustomValidators.MatchPassword(this.resetPasswordForm.controls.newPassword.value),
            Validators.minLength(8),
            Validators.maxLength(16)
            //  CustomValidators.password
        ]);
        this.resetPasswordForm.updateValueAndValidity();
    }

    submit() {
        this.subscription = this.resetPasswordService.resetPassword(this.resetPasswordForm.value)
            .subscribe(
            response => {
                if (response.status === ADMIN_CONSTANTS.STATUS.SUCCESS) {
                    this.resetPasswordForm.reset();
                    this.authService.deleteToken();
                    this.router.navigate(['/auth/login']);
                }
            },
            err => this.pushError(err),
            () => console.log('finally')
            );
    }

    pushError(err) {
        this.invalidAuth = true;
        this.errMessage = err.message;
    }
}
