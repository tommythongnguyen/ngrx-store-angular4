import { CustomValidators } from './../../../utils/custom-validators/custom-validators';
import { Tenant } from './../../../home/models/tenant';


import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'dns-gateway',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['dns-gateway.component.scss'],
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
                    {{ submitted ? 'Update': 'Submit'}}
               </button>
            </div>
        </form>
    </div>
    `
})
export class DnsGatewayComponent implements OnChanges {
    gatewayForm: FormGroup;
    selectTenantDetail: any[];

    gateWayCustomErrors = {
        mismatched: 'should be matched from 0.0.0.0 through 255.255.255.255',
        invalidDna: ': DNA is only allowed `a-z0-9._-`',
        invalidDnaAndIp: 'is invalid format'
    };

    @Input() tenant: Tenant;
    @Input() showLoading = false;
    @Input() submitted = false;

    @Output() submit = new EventEmitter<{ gateway: string }>();

    constructor(private fb: FormBuilder) {
        this.gatewayForm = this.fb.group({
            gateway: ['', [Validators.required, CustomValidators.DnaIpAddress]]
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tenant && changes.tenant.currentValue) {
            const gateway = changes.tenant.currentValue.settings.gateway_dns || '';
            this.gatewayForm.setValue({ gateway });
        }
    }

    onSubmit() {
        event.stopPropagation();
        this.submit.emit(this.gatewayForm.value);
    }
}
