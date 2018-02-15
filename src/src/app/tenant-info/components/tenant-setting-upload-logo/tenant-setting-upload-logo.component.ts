import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Tenant } from '../../../state';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'tenant-setting-upload-logo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-setting-upload-logo.component.scss'],
    templateUrl: 'tenant-setting-upload-logo.component.html'
})
export class TenantSettingUploadLogoComponent implements OnChanges {
    selectedLogo: any;
    deleteLogo: any;
    uploadedLogoName: string;

    invalidLogoImage = false;
    logoUploadReady = false; // true --> upload the logo

    tenantUploadInfo = {
        name: '',
        id: ''
    };

    isLoading = false; // show /hide loading icon

    preloadData = false; // true if the form has submitted

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

    @Output() submitted = new EventEmitter<boolean>();

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tenant && changes.tenant.currentValue) {
            if (changes.tenant.currentValue.settings.tenant_logo) {
                this.uploadedLogoName = changes.tenant.currentValue.settings.tenant_logo;
                this.preloadData = true;
            }

            const { name, id } = this.tenant;

            this.tenantUploadInfo = { name, id };
        }
    }

    onSubmit() {
        event.stopPropagation();
        this.showToastr = false; // hide toastr on submit
        this.logoUploadReady = true;
        this.isLoading = true;
    }

    get isSelected(): boolean {
        return !!this.selectedLogo ;
    }

    onClearLogo() {
        this.deleteLogo = this.selectedLogo;
        this.selectedLogo = null;
    }

    onLogoUploadSuccess($event: any) {
        this.submitted.emit(JSON.parse($event.response).data);
        this.isLoading = false;
        this.onClearLogo();

        // show toast for success
        let message = 'Logo Submit Successfullly';
        if (this.preloadData) {
            message = 'Logo Update Successfullly';
        }
        this.displayToastr(message, 'success');
    }

    onLogoUploadFailure($event: any) {
        this.isLoading = false;
        this.selectedLogo = null;

        let message = 'Logo Submit Failure';
        if (this.preloadData) {
            message = 'Logo Update Failure';
        }
        this.displayToastr(message, 'error');
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
