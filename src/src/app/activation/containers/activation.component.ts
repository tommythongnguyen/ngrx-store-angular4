import { Subscription } from 'rxjs/Rx';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivationService } from '../services/activation.service';
import { Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import ADMIN_CONSTANTS from '../../admin.constant';
import 'rxjs/add/operator/catch';

@Component({
    selector: 'activation',
    styleUrls: [`./activation.component.scss`],
    template: `
        <div class="container-fluid login-bg">
            <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4 log-box-outer min-height-outer">
                    <div class="alert alert-danger" role="alert" [hidden]="showErrMsg==''">{{showErrMsg}}</div>
                    <div class="row logo-heading">
                        &nbsp;&nbsp;Account Activation <img src="../../../assets/images/logoTHD.png" width="50px" height="50px" align="left">
                    </div>
                    <ng-container *ngIf="showActivation; else resendContent">
                        <ng-container class="table-body" *ngIf="isShow('form')">
                            <activation-form (submitForm)="submitActivation($event)"></activation-form>
                        </ng-container>
                        <ng-container *ngIf="isShow('activate')">
                            <div class="error-block">
                                Your account has been Activated.
                            </div>
                        </ng-container>
                        <ng-container *ngIf="isShow('deactivate')">
                            <div class="error-block">
                                Your account has been DeActivated.
                            </div>
                        </ng-container>
                        <ng-container *ngIf="isShow('expire')">
                            <div class="error-block">
                                <h1> The link has expired </h1>
                                <h4> Please click <a href="javascript:void(0);" (click) ="resendLink()">Resend</a> to generate new one.</h4>
                            </div>
                        </ng-container>
                    </ng-container>
                    <ng-template #resendContent>
                        <div [hidden]='!showResendSuccess' class="error-block">
                            Activation link has been send to your Register email.
                        </div>
                        <div [hidden]='showResendSuccess' class="error-block">
                            Activation link is not valid.
                        </div>
                    </ng-template>
                </div>
                <div class="col-sm-4"></div>
            </div>
            <div class="text-center">
                <p>© 2000-2017 Home Depot Product Authority</p>
            </div>
        </div>

        <!--erag-toaster [message]="errMessage" [show]="showToastr" title="Error" [action]="toastrAction" [config]="toastrConfig"></erag-toaster-->
    `
})

export class ActivationComponent implements OnInit, OnDestroy {
    public errMessage: string;
    public showToastr = false;
    public toastrAction = 'success';
    public toastrConfig = {
        positionClass: 'toast-top-center'
    };
    link: string;
    linkStatus: string;
    showErrMsg: String = '';
    showResendSuccess: boolean;
    showActivation = true;
    private _validateLinkSubscription: Subscription;
    private _savePasswordSubscription: Subscription;
    private _resendLinkSubscription: Subscription;

    constructor(private activationService: ActivationService,
        private router: Router,
        private activatedRoute: ActivatedRoute) { }

    ngOnInit() {

        // Validate the user link
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.link = (params['link'] !== undefined) ? params['link'] : null;
             this._validateLinkSubscription = this.activationService.validateLink(this.link)
                .subscribe(
                next => {
                    this.linkStatus = next.data;
                },
                err => this.pushError(err),
                () => console.log('finally')
                );
        });
    }

    ngOnDestroy() {
        if (this._validateLinkSubscription) {
            this._validateLinkSubscription.unsubscribe();
        }
        if (this._savePasswordSubscription) {
            this._savePasswordSubscription.unsubscribe();
        }
        if (this._resendLinkSubscription) {
            this._resendLinkSubscription.unsubscribe();
        }
    }

    isShow(type: string) {

        if (type === 'form' && this.linkStatus === ADMIN_CONSTANTS.STATUS.SUCCESS) {
                return true;
            } else if (type === 'activate' && this.linkStatus === ADMIN_CONSTANTS.STATUS.ACTIVE) {
                return true;
            } else if (type === 'deactivate' && this.linkStatus === ADMIN_CONSTANTS.STATUS.DEACTIVATED) {
                return true;
            } else if (type === 'expire' && this.linkStatus === ADMIN_CONSTANTS.STATUS.EXPIRED) {
                return true;
            }
            return false;
    }

    // Function is used to save Password
    submitActivation(formData) {
        formData = Object.assign({}, formData , {link: this.link});
        this._savePasswordSubscription = this.activationService.savePassword(formData)
            .subscribe(
            response => {
                console.log(response);
            if (response.status === ADMIN_CONSTANTS.STATUS.SUCCESS) {
                this.showErrMsg = '';
                this.router.navigate(['/auth/login']);
              } else {
                this.showErrMsg = response.errorDetail === null ? 'System Error' : response.errorDetail;
              }
            },
            err => this.pushError(err),
            () => console.log('finally')
            );
    }

    // Funcction is used to resend activation link if it is expired
    resendLink() {
           this._resendLinkSubscription = this.activationService.resendLink(this.link)
            .subscribe(
            next => {
                console.log(next);
                this.showActivation = false;
                this.showResendSuccess = (next.status === ADMIN_CONSTANTS.STATUS.SUCCESS);
            },
            err => this.pushError(err),
            () => console.log('finally')
            );
    }

    pushError(err) {
        this.toastrAction = 'error';
        this.showToastr = true;
        this.errMessage = err.message;
    }
}

