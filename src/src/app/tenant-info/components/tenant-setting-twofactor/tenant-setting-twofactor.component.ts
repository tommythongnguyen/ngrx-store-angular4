import { Tenant } from './../../../state';
import { CustomValidators } from './../../../utils/custom-validators/custom-validators';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupName, AbstractControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TenantUrlData } from '../../../state';

export interface TwoFactorObj {
    enterpriseUrl: string;
    twoFactorType: string;
    duoSecretKey: string;
    duoIntegrationKey: string;
    duoApiHost: string;
}
@Component({
    selector: 'tenant-setting-twofactor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'tenant-setting-twofactor.component.html',
    styleUrls: ['./tenant-setting-twofactor.component.scss']
})
export class TenantSettingTwoFactorComponent implements OnInit, OnChanges {
    twoFactorForm: FormGroup;

    twoFactorType = 'enterprise';
    enterpriseUrlCustomErrors = {
        multiProtocol: 'allows only 1 `https` as protocol',
        protocol: '`https` is required as protocol',
        multiDomain: 'allows only 1 `.com` as domain',
        domainRequired: '`.com` is required as domain'
    };

    preloadData = false; // true if the form has submitted

    @Input() tenant: Tenant;
    @Input() showLoading = false;

    @Output() submitted = new EventEmitter<any>();
    @Output() uploaded = new EventEmitter<boolean>();

    private _authDuoGroup = this.fb.group({
        duoSecretKey: ['', [Validators.required] ],
        duoIntegrationKey: ['', [Validators.required]] ,
        duoApiHost: ['', [ Validators.required, CustomValidators.includeUrlKeys(['', '.duosecurity.com'])] ]
    });

    private _enterpriseUrlControl: FormControl;

    constructor(private fb: FormBuilder) {
        this._enterpriseUrlControl = this.fb.control('', [Validators.required, CustomValidators.includeUrlKeys(['https', '.com'])]);
        this.twoFactorForm = this.fb.group({
            radioType: 'enterprise',
            enterpriseUrl: this._enterpriseUrlControl
        });

    }

    ngOnInit() {
        const radioType = this.twoFactorForm.controls.radioType as FormControl;
        radioType.valueChanges.subscribe(val => {
            this.twoFactorType = val;
            this.updateForm(val);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tenant && changes.tenant.currentValue) {
            const duoSecretKey = changes.tenant.currentValue.settings.duo.duo_secret_key || '';
            const duoIntegrationKey = changes.tenant.currentValue.settings.duo.duo_integration_key || '';
            const duoApiHost = changes.tenant.currentValue.settings.duo.duo_api_host || '';

            const enterpriseUrl = changes.tenant.currentValue.settings.twofa.two_factor_link || '';

            this.twoFactorType = changes.tenant.currentValue.settings.twofa.twofa_type || 'enterprise';

            this._authDuoGroup.setValue({ duoSecretKey, duoIntegrationKey, duoApiHost });
            this._enterpriseUrlControl.setValue(enterpriseUrl);

            this.twoFactorForm.controls.radioType.setValue(this.twoFactorType);

            this.updateForm(this.twoFactorType);

            if (duoSecretKey || duoIntegrationKey || duoApiHost || enterpriseUrl || this.twoFactorType === 'google') {
                this.preloadData = true;
                this.uploaded.emit(true);
            } else {
                this.preloadData = false;
                this.uploaded.emit(false);
            }
        }
    }

    updateForm(radioVal: string) {
        switch (radioVal) {
            case 'enterprise':
                this.removeFormControl('authDuo');
                this.addFormControl('enterpriseUrl', this._enterpriseUrlControl);
                this.twoFactorForm.updateValueAndValidity();
                return;

            case 'google':
                this.removeFormControl('authDuo');
                this.removeFormControl('enterpriseUrl');
                this.twoFactorForm.updateValueAndValidity();
                return;

            case 'duo':
                this.removeFormControl('enterpriseUrl');
                this.addFormControl('authDuo', this._authDuoGroup);
                this.twoFactorForm.updateValueAndValidity();
                return;
        }
    }

    removeFormControl(controlName: string) {
        if (this.twoFactorForm.contains(controlName)) {
            this.twoFactorForm.removeControl(controlName);
        }
    }

    addFormControl(controlName: string, control: AbstractControl) {
        if (!this.twoFactorForm.contains(controlName)) {
            this.twoFactorForm.addControl(controlName, control);
        }
    }

    onSubmit() {
        this.submitted.emit(this.twoFactorForm.value);
    }


}
