import { Tenant } from './../../../state';
import { CustomValidators } from './../../../utils/custom-validators/custom-validators';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'tenant-setting-gateway',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="col-sm-12 padding-zero settings-border" [loading]="showLoading">
        <div class="sub-header">Gateway DNS/IP Address</div>
        <form [formGroup]="gatewayForm" (ngSubmit)="onSubmit()">
            <div class="col-sm-12">
                <div class="col-sm-2 text-right">
                    <label>DNS or IP Address<span class="required-icon">*</span></label>
                </div>
                <div class="col-sm-8">
                    <input type="text" class="form-control col-sm-10 col-md-10 col-lg-9" id="gateway"
                           formControlName="gateway" placeholder="Gateway Address">
                    <p class="context-message">
                        This is the IP Address/Hostname of the ERAG Gateway Server hosted in your corporate datacenters.
                        eg erag-gateway.homedepot.com or 104.196.xx.xx
                    </p>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="col-sm-2"></div>
                <div class="col-sm-8">
                    <control-error [parent]="gatewayForm"
                                    control="gateway"
                                    label="DNS/Ip address"
                                    [errors]="gateWayCustomErrors">
                    </control-error>
                </div>
            </div>
           
            <div class="col-sm-12 but-border" >
               <button type ="submit" class="btn btn-success btn-sm btn-form-submit"
                       [disabled]="gatewayForm.invalid">
                    {{ preloadData ? 'Update': 'Submit'}}
               </button>
            </div>
        </form>
    </div>   
    `,
    styleUrls: ['./tenant-setting-gateway.component.scss']
})
export class TenantSettingGatewayComponent implements OnChanges {
    gatewayForm: FormGroup;
    selectTenantDetail: any[];

    gateWayCustomErrors = {
        mismatched: 'should be matched from 0.0.0.0 through 255.255.255.255',
        invalidDna: ': DNA is only allowed `a-z0-9._-`',
        invalidDnaAndIp: 'is invalid format'
    };

    preloadData = false; // true if form has submitted

    @Input() showLoading = false;
    @Input() tenant: Tenant;

    @Output() submitted = new EventEmitter<any>();
    @Output() uploaded = new EventEmitter<boolean>();

    constructor(private fb: FormBuilder) {
        this.gatewayForm = this.fb.group({
            gateway: ['', [Validators.required, CustomValidators.DnaIpAddress]]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tenant && changes.tenant.currentValue) {
            const gateway = changes.tenant.currentValue.settings.gateway_dns || '';
            this.gatewayForm.setValue({ gateway });

            if (gateway) {
                this.preloadData = true;
                this.uploaded.emit(true);
            } else {
                this.preloadData = false;
                this.uploaded.emit(false);
            }
        }
    }

    get isInvalidGateway(): boolean {
        const gatewayControl = this.gatewayForm.controls.gateway as FormControl;
        if (gatewayControl.dirty && gatewayControl.touched && !gatewayControl.value) { return true; }
        return false;
    }
    onSubmit() {
        this.submitted.emit(this.gatewayForm.value);
    }

    transformFormData() {
        return this.gatewayForm.value;
    }
}
