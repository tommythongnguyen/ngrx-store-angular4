import { Component, OnInit, EventEmitter, ChangeDetectionStrategy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
@Component({
    selector: 'login-form',
    styleUrls: [`./login-form.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <form [formGroup]="loginForm" novalidate (ngSubmit)="submit()">
            <div class=" login-input-margins">
                <div class="form-group">
                    <input type="text" id="username" placeholder="User Name"
                        formControlName="username" [class.errors]="userNameError?.length">
                </div>
                <div>
                    <span class="error-message" *ngIf="userNameError ==='too-short'">Username too short</span>
                    <span class="error-message" *ngIf="userNameError ==='too-long'">Username too long</span>
                    <span class="error-message" *ngIf="userNameError ==='required'">Username is required</span>
                </div>
            </div>
            <div class=" login-input-margins">
                <div class="form-group">
                    <input type="password" id="password" placeholder="Password"
                            formControlName="password" [class.errors]="passwordError?.length">
                </div>
                <div>
                    <span class="error-message" *ngIf="passwordError ==='too-long'">Password too long</span>
                    <span class="error-message" *ngIf="passwordError ==='required'">Password is required</span>
                </div>
            </div>
            <button type="submit" id="sign-in-margin" [disabled]="loginForm.invalid" class="btn btn-block btn-common">SIGN IN
            </button>
        </form>
    `
})

export class LoginFormComponent implements OnInit {
    loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
        password: ['', [Validators.required, Validators.maxLength(16)]]
    });

    @Output() submitForm = new EventEmitter<any>();
    constructor(private fb: FormBuilder) { }

    ngOnInit() { }

    get userNameError(): string {
        const username = this.loginForm.controls.username as FormControl;
        if (username.dirty) {
            if (username.hasError('minlength')) {
                return 'too-short';
            } else if (username.hasError('maxlength')) {
                return 'too-long';
            } else if (username.hasError('required')) {
                return 'required';
            }
        }
        return;
    }

    get passwordError(): string {
        const password = this.loginForm.controls.password as FormControl;
        if (password.dirty) {
            if (password.hasError('maxlength')) {
                return 'too-long';
            } else if (password.hasError('required')) {
                return 'required';
            }
        }
        return;
    }

    submit() {
        this.submitForm.emit(this.loginForm.value);
    }
}
