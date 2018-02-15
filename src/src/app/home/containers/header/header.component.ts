import { UserProfile } from '../../../auth/services/user-profile.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Store } from '../../../store';
import { Notification } from '../../../state';

import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { HomeService } from '../../services/home.service';

@Component({
    selector: 'header',
    styleUrls: ['header.component.scss'],
    template: `
            <nav class="navbar navbar-inverse dashboard-navbar-container">
                <div class="container-fluid dashboard-container">
                    <header-logo [profile]="userProfile"></header-logo>

                    <div class="header-title">Welcome to Enterprise Remote Access Gateway</div>

                    <header-user-profile [show]="showProfileDropdown"
                                         [userProfile]="userProfile"
                                         (redirect) = "onRedirect($event)"
                                         (toggle)="onToggleProfileDropdown()"
                                         position="right">
                    </header-user-profile>

                    <header-notification [profile]="userProfile"
                                         [notification] = "notification$ | async"
                                         [show] = "showNotificationDropdown"
                                         (clickNotification)="onClickNotificationIcon()"
                                         (viewAll)="onViewAllNotification()" >
                    </header-notification>
                </div>
            </nav>
    `
})

export class HeaderComponent implements OnInit, OnDestroy {
    showProfileDropdown = false; // hide headerUserProfile by default

    notification$: Observable<Notification>;

    showNotificationDropdown = false;
    showLoadingNotification = false;

    @Input() userProfile: UserProfile;

    private _clickCallback: Function;

    constructor( private homeService: HomeService,
                 private authService: AuthService,
                 private renderer: Renderer2,
                 private router: Router,
                 private route: ActivatedRoute,
                 private store: Store) {}

    ngOnInit() {
        this.notification$ = this.store.select<Notification>('notification');

        this.registerEvents();
    }

    onClickNotificationIcon() {
        this.showNotificationDropdown = !this.showNotificationDropdown;
        if (this.showNotificationDropdown) {
            this.showLoadingNotification = true;
            this.homeService.getNotifications()
                .subscribe(
                next => { },
                err => { },
                () => { }
                );
        }
    }
    onViewAllNotification() {
        this.router.navigate(['activity'], {relativeTo: this.route});
    }
    onRedirect($event) {
        if ($event.destination === 'logout') {
            this.authService.deleteToken();
            this.router.navigate(['/auth/login']);
        }else {
            this.router.navigate(['/' + $event.destination]);
        }
    }

    registerEvents() {
        this._clickCallback = this.renderer.listen('document', 'click', () => {
            if (this.showNotificationDropdown) {
                this.showNotificationDropdown = false;
            }
            if (this.showProfileDropdown) {
                this.showProfileDropdown = false;
            }
        });
    }

    onToggleProfileDropdown() {
        this.showProfileDropdown = !this.showProfileDropdown;
    }

    ngOnDestroy() {
        if (this._clickCallback) {
            this._clickCallback();
        }
    }
}
