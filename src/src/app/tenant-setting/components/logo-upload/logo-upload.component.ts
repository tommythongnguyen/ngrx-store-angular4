import { Tenant } from './../../../home/models/tenant';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'logo-upload',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['logo-upload.component.scss'],
    templateUrl: 'logo-upload.component.html'
})
export class LogoUploadComponent implements OnChanges {
    selectedLogo: any;
    deleteLogo: any;
    uploadedLogoName: string;

    invalidLogoImage = false;
    logoUploadReady = false; // true --> upload the logo

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

    @Input() fileType = '.png';
    @Input() tenant: Tenant;
    @Input() api: string;
    @Input() authToken: string;

    @Input() showLoading = false;
    @Input() submitted = false;

    @Output() submit = new EventEmitter<any>();
    @Output() submitSuccess = new EventEmitter<Tenant>();
    @Output() submitFailure = new EventEmitter<any>();

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tenant && changes.tenant.currentValue) {
            if (changes.tenant.currentValue.settings.tenant_logo) {
                this.uploadedLogoName = changes.tenant.currentValue.settings.tenant_logo;
            }

            const { name, id } = this.tenant;

            this.tenantUploadInfo = { name, id };
        }
    }

    onSubmit() {
        event.stopPropagation();
        this.showToastr = false; // hide toastr on submit
        this.logoUploadReady = true;

        this.submit.emit();
    }

    get isSelected(): boolean {
        return !!this.selectedLogo ;
    }

    onClearLogo() {
        this.deleteLogo = this.selectedLogo;
        this.selectedLogo = null;
    }

    onLogoUploadSuccess($event: any) {
        this.submitSuccess.emit(JSON.parse($event.response).data);
        this.onClearLogo();

        // show toast for success
        let message = 'Logo Submit Successfullly';
        if (this.submitted) {
            message = 'Logo Update Successfullly';
        }
        this.displayToastr(message, 'success');
    }

    onLogoUploadFailure($event: any) {
        this.selectedLogo = null;

        let message = 'Logo Submit Failure';
        if (this.submitted) {
            message = 'Logo Update Failure';
        }
        this.displayToastr(message, 'error');

        this.submitFailure.emit();
    }

    onLogoAddingFile($event) {
        this.showToastr = false;
        this.logoUploadReady = false;
        this.invalidLogoImage = false;
        this.selectedLogo = $event.file.name;
    }

    onAddingInvalidLogoFile($event) {
        this.showToastr = false;
        this.logoUploadReady = false;
        this.invalidLogoImage = true;
        this.selectedLogo = null;
    }

    displayToastr(message: string, status: string) {
        this.toastrConfig = Object.assign({}, this.toastrConfig, { message, configType: status, action: status });
        this.showToastr = true;
    }

}
