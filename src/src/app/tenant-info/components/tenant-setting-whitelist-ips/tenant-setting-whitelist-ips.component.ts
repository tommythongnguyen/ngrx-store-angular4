import { Tenant } from '../../../state';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { CustomValidators } from './../../../utils/custom-validators/custom-validators';
import { FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Renderer2, OnChanges } from '@angular/core';

@Component({
    selector: 'tenant-setting-whitelist-ips',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-setting-whitelist-ips.component.scss'],
    template: `
        <div class="col-sm-12 settings-border" >
        <div class="sub-header">Whitelist Listed IPs</div>
        <div class="col-sm-12"[loading]="showLoading">
                <div class="col-sm-2 text-right">
                    <label>IP Address<span class="required-icon">*</span></label>
                </div>
                <div class="col-sm-8">
                    <div class="col-sm-12 padding-zero">
                        <div class="btn-group dropdown ip-container" >
                            <button class="btn btn-default dropdown-toggle btn-block"
                                    type="button" data-toggle="dropdown" aria-haspopup="true"
                                    (click)="onDropdownBtnClick()">

                                    <input type="text" class="form-control query-input" [formControl]="ipInputControl">


                                    <i class="fa fa-plus-circle pull-right" aria-hidden="true"
                                        *ngIf="showPlusIcon"
                                        (click)= "onIpAddressAdded()">
                                    </i>
                                    <i class="fa fa-caret-down pull-right" aria-hidden="true"
                                        (click)="toggleDropdown()">
                                    </i>
                            </button>

                            <ul class="dropdown-menu dropdown-menu-body" [ngClass]="{'visible': show}">
                                <li *ngFor="let ip of ipList">
                                    <span>{{ip}}</span>
                                    <i class="fa fa-times pull-right" aria-hidden="true" (click)="onIpAddressRemove(ip)"></i>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-sm-12 padding-zero">
                        <p class="context-message">Traffic originating from these IPs will skip 2FA.</p>
                    </div>

                    <div class="col-sm-12 padding-zero">
                        <control-error [control]="ipInputControl"
                                       label="Ip address"
                                       [errors]="{ mismatched: 'should be matched from 0.0.0.0 through 255.255.255.255',
                                                   duplicate: 'is already existed' }">
                        </control-error>
                    </div>
                </div>
            </div>

            <div class="col-sm-12 but-border">
                <button type="submit" class="btn btn-success btn-sm btn-form-submit" (click)="onSubmit()">
                    {{preloadData ? 'Update' : 'Submit'}}
                </button>
            </div></div>
    `
})
export class TenantSettingWhitelistIPsComponent implements OnInit, OnChanges {
    ipInputControl: FormControl;

    ipList: string[] = []; // list of ips

    showPlusIcon = false; // show plus icon allow use to add the ip address;

    preloadData = false; // true if ipList not empty

    constructor(private renderer: Renderer2) { }

    @Input() show = false;

    @Input() tenant: Tenant;

    @Input() showLoading = false;

    @Output() toggle = new EventEmitter<string>();

    @Output() submitted = new EventEmitter<string[]>();

    ngOnInit() {
        this.ipInputControl = new FormControl('', [CustomValidators.ipAddress, CustomValidators.duplicate(this.ipList)]);

        this.ipInputControl.valueChanges.subscribe(val => {
            if (!this.ipInputControl.errors && !!val) {
                this.showPlusIcon = true;
            }else {
                this.showPlusIcon = false;
            }
        });

        this.renderer.listen('document', 'click', this.closeDropdown.bind(this));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tenant && changes.tenant.currentValue) {
            if (changes.tenant.currentValue.settings.whitelistedipranges && changes.tenant.currentValue.settings.whitelistedipranges.length) {
                this.ipList = Object.assign([], changes.tenant.currentValue.settings.whitelistedipranges);
                this.preloadData = true;
            } else {
                this.ipList = [];
                this.preloadData = false;
            }
        }
    }

    toggleDropdown() {
        event.stopPropagation();
        this.toggle.emit('toggle');
    }

    closeDropdown() {
        event.stopPropagation();
        this.toggle.emit('close');
    }

    onDropdownBtnClick() {
        event.stopPropagation();
    }

    onIpAddressRemove(ip: string) {
        event.stopPropagation();
        this.ipList.some((item: string, index: number) => {
            if (item === ip) {
                this.ipList.splice(index, 1);
                return true;
            }
        });
    }

    onIpAddressAdded() {
        event.stopPropagation();
        this.ipList.unshift(this.ipInputControl.value);
        this.showPlusIcon = false;
        this.ipInputControl.setValue('');

        this.toggle.emit('open');
    }

    onSubmit() {
        event.stopPropagation();
        this.submitted.emit(this.ipList);
    }
}
