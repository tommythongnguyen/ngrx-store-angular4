import { UserProfile } from '../../../auth/services/user-profile.interface';
import { ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { Component } from '@angular/core';
@Component({
    selector: 'header-user-profile',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['header-user-profile.component.scss'],
    template: `
        <div class="user-profile-container navbar-{{position}}">
            <div (click)="toggleProfile($event)" id='editProfileSection' class="profile-header">
                <i class="glyphicon glyphicon-user"></i> {{userProfile?.firstname}} {{userProfile?.lastname}}
                <i class="glyphicon glyphicon-menu-down menu-dow-arrow"></i>
            </div>
            <div class="profile-dropdown" id='editProfileSection' [ngClass] = "{'hidden': !show}">
                <div class="profile-details">
                    <a href="#" (click)="onNavigate('home/change-password')">
                        <i class="fa fa-user profile-icon" aria-hidden="true"></i>
                        Change Password
                    </a><br>

                    <a href="#" (click)="onNavigate('logout')">
                        <i class="fa fa-unlock-alt profile-icon" aria-hidden="true"></i>
                            Logout
                    </a>
                </div>
            </div>
        </div>
    `
})
export class HeaderUserProfileComponent{
    @Input()show = false; // default
    @Input()userProfile: UserProfile;
    @Input()position = 'left';

    @Output() redirect = new EventEmitter<{destination: string}>();
    @Output() toggle = new EventEmitter<any>();

    constructor(private renderer: Renderer2,
                private cd: ChangeDetectorRef) {}

    onNavigate(path: string): boolean {
        this.redirect.emit({destination: path});
        return false;
    }

    toggleProfile($event: Event): boolean {
        $event.stopPropagation();
        this.toggle.emit();
        return false;
    }
}
