import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AdSyncGroup } from '../../../state';

@Component({
    selector: 'group-adsync-form',
    styleUrls: ['group-adsync-form.component.scss'],
    template: `
        <form [formGroup]="adSyncForm" (ngSubmit)="submitForm()" >
        
                        <label class="col-sm-3 text-right" style="line-height:2.4;">Group Name</label>
                        <div class="col-sm-5" >
                            <input class="form-control" placeholder="Enter the Group Name" formControlName="searchGroup">
                            <span class="context-message">Enter alteast 3 characters to start search.</span>
                        </div>
                        <div class="col-sm-4 paddingZero text-left">
                            <button type="button"  class="btn btn-cust-com btn-sm but-mar" (click)="onSearchButtonClicked()" *ngIf="isShowFetchGroupButton">Fetch Groups</button>
                            <button type="submit" class="btn btn-cust-com btn-sm but-mar" *ngIf="isGroupSelected()">Save Groups</button>
                            <button type="button" class="btn btn-cust btn-sm" (click)="onHideButtonClicked()" >Hide</button>
                        </div>
                        <div class="col-sm-5 col-sm-offset-2">
                            <div class="form-group" [hidden]="!adSyncGroups?.length">
                                <label class="col-sm-2 control-label"></label>
                                <div class="col-sm-4 group-results padding-zero">
                                    <div *ngFor="let groupcontrol of adSyncGroupsControls.controls; let i=index">
                                    <input type="checkbox" [formControl]="groupcontrol" [checked]="adSyncGroups[i].checked" (change)="onCheckboxChange(adSyncGroups[i])"/> {{adSyncGroups[i].common_name}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
    `
})
export class TenantGroupAdSyncComponent implements OnInit, OnChanges {

    adSyncForm: FormGroup;

    @Input()  adSyncGroups: AdSyncGroup[] = [];
    @Output() search = new EventEmitter<string>();
    @Output() hide = new EventEmitter<any>();
    @Output() submit = new EventEmitter<AdSyncGroup[]>();
    @Output() resetAdSyncData = new EventEmitter<any>();
    // @Output() selected = new EventEmitter<string[]>();

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() { }

    initGroups() {
        console.log(this.adSyncGroups);
        const arr = this.adSyncGroups.map(group => {
            return this.fb.control(false);
        });
        console.log(this.adSyncGroups);
        return this.fb.array(arr);
    }

    get adSyncGroupsControls() {
    return this.adSyncForm.get('groups');
  }


    // TODO Need to check if without this will work then will remove this function
    ngOnChanges(changes: SimpleChanges) {
        if (changes.adSyncGroups && changes.adSyncGroups.currentValue) {
            console.log(this.adSyncGroups);
            this.adSyncForm = this.fb.group({
            searchGroup: [''],
            groups: this.initGroups()
        });
        }
    }

    submitForm() {
        event.stopPropagation();
        event.preventDefault();
        const groups = [];
        this.adSyncGroups.map(adSyncGroup => {
            if (adSyncGroup.checked) {
                const groupData = {common_name : adSyncGroup.common_name,
                    dn: adSyncGroup.dn,
                    grp_objectGUID: adSyncGroup.grp_objectGUID };
                groups.push(groupData);
            }
        });
        this.submit.emit(groups);
        this.resetForm();
    }

    onHideButtonClicked() {
        event.stopPropagation();
        event.preventDefault();
        this.hide.emit();
        this.resetForm();
    }

    resetForm() {
        this.adSyncGroups = [];
        // this.adSyncForm.controls['groups'] = this.initGroups();
        this.adSyncForm.reset();
        this.resetAdSyncData.emit();
    }

    isGroupSelected() {
        return this.adSyncGroups.some(adSyncGroup => {
            if (adSyncGroup.checked) {
                return true;
            }
            return false;
        });
    }

    onCheckboxChange(adSyncGroup: any) {
        adSyncGroup.checked = !adSyncGroup.checked;
    }

    onSearchButtonClicked() {
        this.search.emit(this.adSyncForm.controls['searchGroup'].value);
    }

    get isShowFetchGroupButton(): boolean {
        if (this.adSyncForm.controls['searchGroup'].value) {
                return (this.adSyncForm.controls['searchGroup'].value).length >= 3;
            }
    }
}
