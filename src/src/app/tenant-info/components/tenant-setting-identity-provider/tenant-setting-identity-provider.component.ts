import { CustomValidators } from './../../../utils/custom-validators/custom-validators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Input, Output, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Tenant, TenantUrlData } from '../../../state';

@Component({
    selector: 'ts-identity-provider',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-setting-identity-provider.component.scss'],
    templateUrl: 'tenant-setting-identity-provider.component.html'
})
export class TenantSettingIdentityProviderComponent implements OnInit, OnChanges {
    idpForm: FormGroup;
    customErrors = {
        multiProtocol: 'allows only 1 `https` as protocol',
        protocol: '`https` is required as protocol',
        multiDomain: 'allows only 1 `.com` as domain',
        domainRequired: '`.com` is required as domain'
    };

    invalidIpdProivderSize: boolean;

    invalidSecurityToken= false;

    securityTokenUploadReady = false;

    extraUploadIpdUrl: string;

    isLoading = false;

    preloadData = false; // true if form is submitted

    tenantUploadInfo = {
        name: '',
        id: ''
    };

    // --- for toaster -----
    showToastr = false;
    toastrConfig = {
        message: '',
        action: '',
        configType: ''
    };

    private _sercurityToken: File;
    private _uploadBtnTouched: Boolean;


    @Input() fileType = '.txt';
    @Input() maxSize = '10MB';

    @Input() tenant: Tenant;
    @Input() api: string;
    @Input() authToken: string;

    @Output() submitted = new EventEmitter<any>();
    @Output() uploaded = new EventEmitter<boolean>();
    @Output() formSubmitFailure = new EventEmitter<any>();

    constructor(private fb: FormBuilder) {
        this.idpForm = this.fb.group({
            idpUrl: ['', [Validators.required, CustomValidators.includeUrlKeys(['https', '.com'])]],
            securityToken: [{ value: '', disabled: true}, [Validators.required]]
        });
    }

    ngOnInit() {
        this.invalidIpdProivderSize = false;
        this._uploadBtnTouched = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tenant && changes.tenant.currentValue) {
            const idpUrl = changes.tenant.currentValue.settings.sso_url || '';
            const securityToken = changes.tenant.currentValue.settings.security_token_file || '';

            this.idpForm.setValue({ idpUrl, securityToken });
            if (idpUrl && securityToken) {
                this.preloadData = true;
                this.uploaded.emit(true);
            } else {
                this.preloadData = false;
                this.uploaded.emit(false);
            }

            const { name, id } = this.tenant;

            this.tenantUploadInfo = { name, id };
         }
    }
    onInvalidIpdProviderMaxSize() {
        this.invalidIpdProivderSize = true;
    }

    onSelectedIpdProviderToken($event) {
        this.invalidIpdProivderSize = false;
        this._sercurityToken = $event;

        const securityTokentControl = this.idpForm.controls.securityToken as FormControl;
        securityTokentControl.setValue($event.name);
        securityTokentControl.updateValueAndValidity();
    }

    checkFormInvalidStatus(): boolean {
        const validForm =
            this.checkFormControlValidStatus('idpUrl') &&
            this.checkFormControlValidStatus('securityToken');
        return !validForm;
    }

    checkFormControlValidStatus(controlName: string): boolean {
        return !!this.idpForm.controls[controlName].value;
    }

    onSecurityTokenAddingFile($event: any) {
        this.invalidSecurityToken = false;
        this.securityTokenUploadReady = false;
        this.idpForm.controls.securityToken.setValue($event.file.name);
    }

    onAddingInvalidSecurityToken($event) {
        this.invalidSecurityToken = true;
        this.securityTokenUploadReady = false;
        this.idpForm.controls.securityToken.setValue('');
    }
    onSecurityTokenUploadSuccess($event) {
        this.submitted.emit(JSON.parse($event.response).data);
        this.isLoading = false;

        // show toast for success
        let message = 'Identity Provider Submit Successfullly';
        if (this.preloadData) {
            message = 'Identity Provider Update Successfullly';
        }
        this.displayToastr(message, 'success');
    }
    onSecurityTokenUploadFailure($event) {
        this.isLoading = false;
        this.formSubmitFailure.emit();

        // show toast for success
        let message = 'Identity Provider Submit Failure';
        if (this.preloadData) {
            message = 'Identity Provider Update Failure';
        }
        this.displayToastr(message, 'error');
    }

    onSubmit() {
        event.stopPropagation();
        this.showToastr = false;
        this.extraUploadIpdUrl = this.idpForm.controls.idpUrl.value;
        this.securityTokenUploadReady = true;
        this.isLoading = true;

        this.showToastr = false; // reset toastr
    }

    displayToastr(message: string, status: string) {
        this.toastrConfig = Object.assign({}, this.toastrConfig, { message, configType: status, action: status });
        this.showToastr = true;
    }

}
