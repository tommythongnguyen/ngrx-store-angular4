import { TenantUsersFormComponent } from './../tenant-users-form/tenant-users-form.component';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import { Tenant } from '../../../state';
import { TenantDetailModel, TenantUserModel, IdsAndEamils } from './../../models/models';
import { DetailConfig, TenantDetailFormComponent } from './../tenant-detail-form/tenant-detail-form.component';

import AdminConstant from '../../../admin.constant';

type Action = 'Add' | 'Edit';

const USER_ROLE = [AdminConstant.TENANT_ADMIN, AdminConstant.TENANT_APPROVER, AdminConstant.BUSINESS_MANAGER];

@Component({
    selector: 'add-edit-tenant-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['add-edit-tenant-modal.component.scss'],
    template: `
        <erag-modal customWidth="50%"
                    [show]="show"
                    [showLoading] = "isSubmitting"
                    (hide)="onModalHide()" >

            <div class="erag-modal-header" >
                <span>{{title}} Tenant</span>
            </div>
           
            <div class="erag-modal-body" >
                <div class="wizard-container">
                    <step-wizard [list]="stepList"
                                 [allowForward]="allowNext"
                                 [moveToStep]="moveToStep"
                                 [currentStep]="currentStep"
                                 (seleted)="onStepWizardSeleted($event)">
                    </step-wizard>
                    <div class="tenant-form-container" >
                        <div class="row">
                            <div class="col-sm-12">
                               <ng-container *ngIf="moveToStep ===0">
                                    <tenant-detail-form [config]="detailFormConfig"
                                                        [tenantID]="tenantID"
                                                        (submit) ="onTenantDetailFormSubmit($event)">
                                    </tenant-detail-form>
                               </ng-container>

                               <ng-container *ngIf="moveToStep > 0">
                                    <tenant-users-form [user]="userList[moveToStep -1]"
                                                        [mode]="title"
                                                        [currentStep]="currentStep"
                                                        [moveToStep] ="moveToStep"
                                                        (goBack)="onBackBtnClick()"
                                                       (submit)="onUserFormSubmit($event)">
                                    </tenant-users-form>
                               </ng-container>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--div class="erag-modal-footer">
                <button class="btn btn-primary btn-back-step" (click)="onBackBtnClick()">Back</button>
            </div-->
        </erag-modal>
   `,
})
export class AddEditTenantModalComponent implements OnInit, OnChanges {

    userList: TenantUserModel[] = [];
    // ------- for StepWard -----------
    stepList = [
        { label: 'Details', step: 0 },
        { label: 'Administrator', step: 1 },
        { label: 'Approver', step: 2 },
        { label: 'Business Manager', step: 3 }
    ];
    currentStep = 0; // default
    moveToStep = 0; // default
    allowNext = false;

    // ---- for tenant detail Form ------
    detailFormConfig: DetailConfig;

    // --- for tenant role Form -----
    userConfig: TenantUserModel;

    @Input() show = false;
    @Input() title: Action;
    @Input() tenantID: string;

    @Input() tenantDetail: Tenant;
    @Input() tenantUsers: TenantUserModel[];

    @Input()isSubmitting = false; // true if form is submitting

    @Output() hide = new EventEmitter<any>();
    @Output() submit = new EventEmitter<any>();

    @ViewChild(TenantDetailFormComponent) tenantDetailForm: TenantDetailFormComponent;
    @ViewChild(TenantUsersFormComponent) tenantUsersForm: TenantUsersFormComponent;

    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.show && !changes.show.isFirstChange && !changes.show.currentValue) {
            // this is the case when form is submitted successfully and the modal is about to close
            this.cleanResource();
        }
        if (changes.tenantDetail) {
            if (changes.tenantDetail.currentValue) { // edit mode
                this.detailFormConfig = new TenantDetailModel(changes.tenantDetail.currentValue);
            } else { // add mode
                this.resetDetailForm();
            }
        }
        if (changes.tenantUsers) {
            if (changes.tenantUsers.currentValue && changes.tenantUsers.currentValue.length) { // edit mode
                const users = [];
                USER_ROLE.map(role => {
                    changes.tenantUsers.currentValue.some(item => {
                        if (item.role === role) {
                            const user = new TenantUserModel(item);
                            user.domainname = this.getUserDomain(user.email);
                            users.push(user);
                            return true;
                        }
                    });
                });

                this.userList = users;

                this.userList.forEach(this.updateOtherUserIdsandEmails.bind(this));
                this.allowNext = true;
            } else {  // add mode
                this.resetUserList();
                this.allowNext = false;
            }
        }
    }

    getUserDomain(val: string): string {
        const arr = val.split('@');
        return arr[arr.length - 1];
    }

    onModalHide() {
        this.hide.emit();
        this.cleanResource();
    }

    onStepWizardSeleted($event: { step: number, label: string }) {
        this.resetFormsValidation();
        this.moveToStep = $event.step;
    }

    onTenantDetailFormSubmit($event) {
        this.detailFormConfig = Object.assign({}, this.detailFormConfig, $event);
        if ((this.moveToStep === this.currentStep) && (this.currentStep < this.userList.length)) { // prevent user go back after completed step 1
            this.currentStep += 1;
        }
        this.moveToStep = 1;

        // update all user with new domain
        this.userList.forEach(user => user.domainname = $event.domainname);
    }

    onUserFormSubmit($event) {
        this.updateUserList($event);

        // ----- handle the wizard navigation
        if (this.allowNext) {  // we are in the edit mode --> only submit form if moveToStep === last step
            if (this.moveToStep < this.userList.length) {
                this.moveToStep += 1;
            } else {
                // submit the form
                this.submit.emit({ tenantDetail: this.detailFormConfig, tenantUsers: this.userList });
                // this.cleanResource();
            }
        } else { // in add mode
            // ---- check if user clicked back after completed forward step ----
            if (this.moveToStep < this.currentStep) {
                this.moveToStep += 1;
            } else if ((this.moveToStep === this.currentStep) && (this.currentStep < this.userList.length)) { // we are in current step, but not the last one
                this.currentStep += 1;
                this.moveToStep += 1;
            } else { // user in the last step;
                this.submit.emit({ tenantDetail: this.detailFormConfig, tenantUsers: this.userList });
                // this.cleanResource();
            }
        }
    }

    onBackBtnClick() {
        console.log('move to step: ', this.moveToStep);
        // go back to 1 step()
        if (this.moveToStep > 0) {
            this.moveToStep -= 1;
        }
    }

    updateUserList(userInfo) {
        this.userList = this.userList.map((user: TenantUserModel, index: number) => {
            if (user.role === userInfo.role) { // current step
                return new TenantUserModel(userInfo);
            }
            return user;
        });

        this.updateOtherUserIdsandEmails(userInfo);
    }

    updateOtherUserIdsandEmails(userInfo) {
        // update other user's ids and email list
        this.userList.forEach(user => {
            if (user.role !== userInfo.role) {
                if (user.idsAndEmails.length === 2) {
                    user.idsAndEmails.some(item => {
                        if (item.role === userInfo.role) {
                            item.email = userInfo.email;
                            item.userid = userInfo.userid;
                            return true;
                        }
                    });
                } else if (user.idsAndEmails.length === 1) {
                    if (user.idsAndEmails[0].role === userInfo.role) {
                        user.idsAndEmails[0].email = userInfo.email;
                        user.userid = userInfo.userid;
                    } else {
                        const { userid, email, role } = userInfo;
                        user.idsAndEmails.push(new IdsAndEamils({ userid, email, role }));
                    }
                } else {
                    const { userid, email, role } = userInfo;
                    user.idsAndEmails.push(new IdsAndEamils({ userid, email, role }));
                }
            }
        });
    }

    cleanResource() {
        this.currentStep = 0;
        this.moveToStep = 0;
        this.allowNext = false;

        this.resetUserList();
        this.resetDetailForm();
        this.resetFormsValidation();
    }

    resetUserList() {
        this.userList = USER_ROLE.map(role => {
            const user = new TenantUserModel();
            user.role = role;
            return user;
        });
    }

    resetDetailForm() {
        this.detailFormConfig = new TenantDetailModel();
    }

    resetFormsValidation() {
        if (this.tenantDetailForm) {
            this.tenantDetailForm.detailForm.reset();
        }
        if (this.tenantUsersForm) {
            this.tenantUsersForm.usersForm.reset();
        }
    }
}
