import { Subject, Observable } from 'rxjs/Rx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Tenant } from '../../../state';
import 'rxjs/add/operator/take';

const STATUS = {
    privateKey: { added: false, ready: false },
    clientCert: { added: false, ready: false }
};

@Component({
    selector: 'ts-server-certificate',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: ['tenant-setting-server-certificate.component.scss'],
    templateUrl: 'tenant-setting-server-certificate.component.html'
})
export class TenantSettingServerCertificateComponent implements OnInit, OnChanges {
    cerForm: FormGroup;

    preloadData = false; // true if the form has submited.

    uploadStatus = STATUS;

    privateKeyAdded = false;
    privateKeyUploadReady = false;
    privateKeyUploadFailure = false;

    clientCertAdded = false;
    clientCertUploadReady = false;

    clientCertificate: File;
    tlsPrivateKey: File;

    invalidPrivateKeyFile = false;
    invalidClientCerFile = false;

    invalidClientCertificateSize = false;
    invalidTlsPrivateKeySize = false;

    tenantUploadInfo = {
        name: '',
        id: ''
    };

    private _isLoading = false;

    // --- for toaster -----
    showToastr = false;
    toastrConfig = {
        message: '',
        action: '',
        configType: ''
    };

    @Input() disableForm = false;
    @Input() tenant: Tenant;
    @Input() api: string;
    @Input() authToken: string;

    @Input() set showLoading(val: boolean) {
        this._isLoading = val;
    }
    get showLoading(): boolean {
        return this._isLoading;
    }

    @Output() privateKeySubmitted = new EventEmitter<Tenant>();
    @Output() clientCertSubmitted = new EventEmitter<Tenant>();
    @Output() uploaded = new EventEmitter<Boolean>();
    @Output() formSubmitFailure = new EventEmitter<any>();

    constructor(private fb: FormBuilder) {
        this.cerForm = this.fb.group({
            fqdn: [{ value: '', disabled: true }, Validators.required],
            private_key: [ { value: '', disabled: true }, Validators.required],
            certificate_available: false,
            client_certificate: { value: '', disabled: true}
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tenant && changes.tenant.currentValue) {
            const fqdn = this.tenant.settings.tenant_fqdn || '';
            const private_key = this.tenant.settings.cert.private_key || '';
            const certificate_available = this.tenant.settings.is_ca_certificate_available || false;
            const client_certificate = this.tenant.settings.client_cert.client_certificate_file || '';

            this.cerForm.setValue({ fqdn, private_key, certificate_available, client_certificate });

            if (fqdn && private_key && certificate_available) {
                this.preloadData = true;
                this.uploaded.emit(true);
            } else {
                this.uploaded.emit(false);
            }

            const { name, id } = this.tenant;

            this.tenantUploadInfo = { name, id };
        }
    }

    ngOnInit() {}
    transformFormData() {
        const formData = Object.assign({}, this.cerForm.value, { private_key: this.tlsPrivateKey, client_certificate: this.clientCertificate });
        return formData;
    }

    get isNotAvailable(): boolean {
        const clientCertificate = this.cerForm.controls.client_certificate as FormControl;
        const notAvailable = !this.cerForm.controls.certificate_available.value;

        if (!notAvailable) {
            clientCertificate.setValidators(Validators.required);
            clientCertificate.updateValueAndValidity();
        } else {
            clientCertificate.clearValidators();
            clientCertificate.updateValueAndValidity();
        }
        return notAvailable;
    }

    onInvalidTlsPrivateKeyMaxSize() {
        this.invalidTlsPrivateKeySize = true;
    }

    onInvalidClientCertificateMaxSize() {
        this.invalidClientCertificateSize = true;
    }

    checkCerFormInvalidStatus(): boolean {
        if (!this.disableForm) {
            const validForm =
                this.checkFormControlValidStatus('fqdn') &&
                this.checkFormControlValidStatus('private_key') &&
                this.checkFormControlValidStatus('certificate_available') &&
                this.checkFormControlValidStatus('client_certificate');

            return !validForm;
        }
        return true;
    }

    checkFormControlValidStatus(controlName: string): boolean {
        return !!this.cerForm.controls[controlName].value;
    }

    onPrivateKeyAddingFile(uploadFile: any) {
        this.invalidPrivateKeyFile = false;

        this.privateKeyAdded = true;
        this.cerForm.controls.private_key.setValue(uploadFile.file.name);
    }

    onAddingInvalidPrivateKeyFile($event) {
        this.invalidPrivateKeyFile = true;
        this.privateKeyAdded = false;
        this.cerForm.controls.private_key.setValue('');
    }

    onClientCertificateAddingFile(uploadFile: any) {
        this.invalidClientCerFile = false;
        this.clientCertAdded = true;
        this.cerForm.controls.client_certificate.setValue(uploadFile.file.name);
    }

    onAddingInvalidClientCertFile($event) {
        this.invalidClientCerFile = true;
        this.clientCertAdded = false;
        this.cerForm.controls.client_certificate.setValue('');
    }

    onPrivateKeyUploadSuccess($event) {
        this.privateKeyUploadFailure = false;
        if (this.clientCertAdded) {
            this.clientCertUploadReady = true;
        } else {
            this._isLoading = false;
            this.resetUploadStatus();
            this.privateKeySubmitted.emit(JSON.parse($event.response).data);
            // show toast for success
            let message = 'Server Certificate Submit Successfully';
            if (this.preloadData) {
                message = 'Server Certificate Update Successfully';
            }
            this.displayToastr(message, 'success');
        }
    }

    onPrivateKeyUploadFailure($event) {
        this.privateKeyUploadFailure = true;
        this.cerForm.controls.private_key.setValue('');
        if (this.clientCertAdded) {
            this.clientCertUploadReady = true;
        } else {
            this._isLoading = false;
            this.resetUploadStatus();
            this.formSubmitFailure.emit();

            // show toast for success
            let message = 'Server Certificate Submit Failure';
            if (this.preloadData) {
                message = 'Server Certificate Update Failure';
            }
            this.displayToastr(message, 'error');
        }
    }

    onClientCertificateUploadSuccess($event) {
        this.clientCertSubmitted.emit(JSON.parse($event.response).data);
        this._isLoading = false;
        this.resetUploadStatus();

        // show toast for success
        if (this.privateKeyUploadFailure) {
            let message = 'Server Certificate Submit Failure';
            if (this.preloadData) {
                message = 'Server Certificate Update Failure';
            }
            this.displayToastr(message, 'error');
        } else {
            let message = 'Server Certificate Submit Successfully';
            if (this.preloadData) {
                message = 'Server Certificate Update Successfully';
            }
            this.displayToastr(message, 'success');
        }
    }
    onClientCertificateUploadFailure($event) {
        this.cerForm.controls.client_certificate.setValue('');
        this._isLoading = false;
        this.resetUploadStatus();
        this.formSubmitFailure.emit();

        // show toast for success
        let message = 'Server Certificate Submit Failure';
        if (this.preloadData) {
            message = 'Server Certificate Update Failure';
        }
        this.displayToastr(message, 'error');
    }


    onFormSubmit() {
        this.showToastr = false; // hide toastr

        this._isLoading = true; // let show the loading icon
        if (this.clientCertAdded && this.privateKeyAdded) {
            this.privateKeyUploadReady = true;
        } else if (this.clientCertAdded) {
            this.clientCertUploadReady = true;
        } else if (this.privateKeyAdded) {
            this.privateKeyUploadReady = true;
        }
    }

    resetUploadStatus() {
        this.privateKeyAdded = false;
        this.privateKeyUploadReady = false;

        this.clientCertAdded = false;
        this.clientCertUploadReady = false;
    }

    displayToastr(message: string, status: string) {
        this.toastrConfig = Object.assign({}, this.toastrConfig, { message, configType: status , action: status });
        this.showToastr = true;
    }
}
