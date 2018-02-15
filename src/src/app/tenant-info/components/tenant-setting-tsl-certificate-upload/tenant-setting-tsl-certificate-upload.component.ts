import { Tenant } from '../../../state';
import { FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'ts-tsl-certificate-upload',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-setting-tsl-certificate-upload.component.scss'],
    template: `
        <div class="flex-container">
            <input type="text" class="form-control file-disable" id="certificate"
                [formControl]="certificate" placeholder="Please upload TLS Certificate">
            <erag-file-upload   [show]="true"
                                [authToken]="authToken"
                                fileType=".cer"
                                maxSize="10MB"
                                [executeUploadFile]="tslCertUploadReady"
                                [userInfo]="tenantUploadInfo"
                                fileRef="tls_certificate"
                                [api]="api"
                                (addFile)="onAddingFile($event)"
                                (addInvalidFile)="onAddingInvalidFile($event)"
                                (uploadSuccess)="onUploadSuccess($event)"
                                (uploadFailure)="onUploadFailure($event)">
            </erag-file-upload>
        </div>
        <span class="context-message">This Tenant Specific TLS(Transport Layer Security) Certificate will be used by the WebServers.</span>

        <erag-alert-message [show]="inValidFile">
            Please select '.cer' file for TLS Certificate.
        </erag-alert-message>

        <erag-toaster [show]="showToastr" [config]="toastrConfig"></erag-toaster>
    `
})
export class TenantSettingTslCertificateUploadComponent implements OnChanges {
    certificate = new FormControl({ value: '', disabled: true });
    inValidFile = false;

    tenantUploadInfo = {
        name: '',
        id: ''
    };

    tslCertUploadReady = false;

    // --- for toaster -----
    showToastr = false;
    toastrConfig = {
        message: '',
        action: '',
        configType: ''
    };

    @Input() tenant: Tenant;
    @Input() api: string;
    @Input() authToken: string;

    @Output() uploadSuccess = new EventEmitter<any>();
    @Output() added = new EventEmitter<string>();
    @Output() uploadFailure = new EventEmitter<string>();

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tenant && changes.tenant.currentValue) {
            const cert = this.tenant.settings.cert ? this.tenant.settings.cert.tls_certificate : '';
            this.certificate.setValue(cert);

            const { name, id } = this.tenant;

            this.tenantUploadInfo = { name, id };
        }
    }

    onAddingFile($event) {
        this.showToastr = false;

        this.tslCertUploadReady = true;
        this.inValidFile = false;
        this.certificate.setValue($event.file.name);
        this.added.emit($event.file.name);
    }

    onAddingInvalidFile($event) {
        this.showToastr = false;

        this.tslCertUploadReady = false;
        this.inValidFile = true;
        this.certificate.setValue('');
    }
    onUploadSuccess($event: any) {
        this.tslCertUploadReady = false;
        this.uploadSuccess.emit(JSON.parse($event.response).data);

        // show toast for success
        const message = 'TSL Certificate Upload Successfully';
        this.displayToastr(message, 'success');
    }

    onUploadFailure($event: any) {
        this.tslCertUploadReady = false;
        console.log('upload failure: ', $event);
        this.certificate.setValue('');
        this.uploadFailure.emit($event.file.name);

        // show toast for success
        const message = 'TSL Certificate Upload Failure';
        this.displayToastr(message, 'error');
    }

    displayToastr(message: string, status: string) {
        this.toastrConfig = Object.assign({}, this.toastrConfig, { message, configType: status, action: status });
        this.showToastr = true;
    }
}
