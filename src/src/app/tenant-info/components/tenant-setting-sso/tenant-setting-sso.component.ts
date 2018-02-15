import { Store } from '../../../store';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { TenantUrlData } from '../../../state';

@Component({
    selector: 'tenant-setting-sso',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./tenant-setting-sso.component.scss'],
    template: `
        <div class="sub-header">{{title}}</div>
            <form [formGroup]="ssoForm" (ngSubmit)="onIDPSubmit()">
            <div class="col-sm-12">
                <div class="col-sm-2 text-right">
                    <label>SSO URL</label>
                </div>
                <div class="col-sm-8">
                    <input type="text" class="form-control col-sm-10 col-md-10 col-lg-9" id="ssoUrl" formControlName="ssoUrl" placeholder="SSO Url">
                    <p class="context-message">Enter Single sign-on (SSO) URL</p>
                </div>
            </div>
            <button type ="submit" class="btn btn-primary" [disabled]="ssoForm.invalid">Submit</button>
        </form>
    `
})
export class TenantSettingSSOComponent implements OnInit {
    ssoForm: FormGroup;
    selectedLogo: any;

    selectTenantDetail: any[];

    public inValidSize = false;

    @Input() title = 'Single sign-on (SSO)';
    @Input() fileType = '.txt';
    @Input() uploadedLogo: string;

    @Output() submitted = new EventEmitter<any>();

    constructor(private fb: FormBuilder, private store: Store) {
        this.ssoForm = this.fb.group({
            ssoUrl: ['', Validators.required],
            security: ''
        });
    }

    ngOnInit() {
        this.store.select('selectedTenants')
            .filter(Boolean)
            .distinctUntilChanged()
            .subscribe((val) => this.selectTenantDetail = val);
    }

    onIDPSubmit() {
        const data = {
            settings: {
                sso_url: this.ssoForm.value.ssoUrl
            }
        };
        const formData = Object.assign({}, { 'settings.sso_url': this.ssoForm.value.ssoUrl }, { tenant: this.selectTenantDetail[0].id });
        this.submitted.emit(formData);
    }
}
