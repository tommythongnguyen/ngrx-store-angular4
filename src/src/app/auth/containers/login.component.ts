import { Authenticate } from '../models/user.interface';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { LoginService } from '../services/login.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';

import * as fromAuth from '../store/reducers';
import * as Auth from '../store/actions/auth.actions';

@Component({
    selector: 'login',
    styleUrls: [`./login.component.scss`],
    template: `
        <div class="container-fluid login-bg">
            <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4 log-box-outer" [loading]="pending$ | async">
                    <div class="row logo-heading">
                        My Account Sign In <img src="../../../assets/images/logoTHD.png" width="50px" height="50px" align="left">
                    </div>

                    <login-form (submitForm)="submitLogin($event)"></login-form>

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

export class LoginComponent implements OnInit {
    pending$ = this.store.select(fromAuth.getLoginPagePending);

    subscription: Subscription;
    constructor(
        private store: Store<fromAuth.State>,
        private loginService: LoginService,
        private router: Router) { }

    ngOnInit() { }

    submitLogin($event: Authenticate) {
        this.store.dispatch(new Auth.Login($event));
    }
}

