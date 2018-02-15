import { Tenant } from './../../../state';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomValidators } from './../../../utils/custom-validators/custom-validators';

export interface ActiveDirectory {
    connection_name: string;
    host: string;
    port: number;
    basedn: string;
    connect_user: string;
    connect_secret: string;
}

@Component({
    selector: 'tenant-setting-active-directory',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./tenant-setting-active-directory.component.scss'],
    templateUrl: 'tenant-setting-active-directory.component.html'
})
export class TenantSettingActiveDirectoryComponent implements OnChanges {
    adSyncForm: FormGroup;

    selectedLogo: any;

    selectTenantDetail: any[];

    HostCustomErrors = {
        mismatched: 'Ip must be 0.0.0.0 through 255.255.255.255',
        invalidDna: 'Name is only allowed `a-z0-9._-`',
        invalidDnaAndIp: 'is invalid format'
    };

    PortCustomErrors = {
        nan: 'value must be number',
        negative: ' value must greater than 0',
        outOfLimit: 'value must lessen than 6555'
    };

    inValidSize = false;

    preloadData = false; // true if the form has submitted

    @Input() tenant: Tenant;
    @Input() validConnection = false;
    @Input() showLoading = false;

    @Output() validated = new EventEmitter<ActiveDirectory>();
    @Output() submitted = new EventEmitter<ActiveDirectory>();


    constructor(private fb: FormBuilder) {
        this.adSyncForm = this.fb.group({
            connection_name: ['', Validators.required],
            host: ['', [Validators.required, CustomValidators.DnaIpAddress]],
            port: ['', [Validators.required, CustomValidators.checkLimitValue(6555)]],
            basedn: ['', Validators.required],
            connect_user: ['', Validators.required],
            connect_secret: ['', Validators.required]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tenant && changes.tenant.currentValue) {
            const connection_name = changes.tenant.currentValue.settings.activeDirectory.connection_name || '';
            const host = changes.tenant.currentValue.settings.activeDirectory.host || '';
            const port = changes.tenant.currentValue.settings.activeDirectory.port || '';
            const basedn = changes.tenant.currentValue.settings.activeDirectory.basedn || '';
            const connect_user = changes.tenant.currentValue.settings.activeDirectory.connect_user || '';
            const connect_secret = changes.tenant.currentValue.settings.activeDirectory.connect_secret || '';

            this.adSyncForm.setValue({ connection_name, host, port, basedn, connect_user, connect_secret });

            if (connection_name || host || port || basedn || connect_user || connect_secret) {
                this.preloadData = true;
            }
        }
    }

    validateConnection() {
        this.validated.emit(this.adSyncForm.value);
    }
    onADSyncSubmit() {
        this.submitted.emit(this.adSyncForm.value);
    }
}
