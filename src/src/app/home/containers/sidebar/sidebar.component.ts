import { UserProfile } from '../../../auth/services/user-profile.interface';

import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
    SimpleChanges
} from '@angular/core';

import AdminConstant from '../../../admin.constant';

import sideBarLinks from './sidebar.icons';
@Component({
    selector: 'sidebar',
    styleUrls: ['sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div id="wrapper" class="sidebar-wrapper-container">
            <div id="sidebar-wrapper" class="sidebar-wrapper" #sidebar>
                <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li>
                            <button class="navbar-toggle collapse in" data-toggle="collapse" (click)="toggleSideBar()">
                                <span class="glyphicon glyphicon-menu-hamburger toggle-icon" aria-hidden="true"></span>
                            </button>
                        </li>
                    </ul>
                </div>

                <ul class="sidebar-nav" id="menu">
                    <ng-container *ngFor="let link of sideBarLinks">
                        <li routerLinkActive="active"  *ngIf= "isAllowable(link.label)">
                            <a routerLink="{{link.url}}" class="sidebar-link">
                                <span class="fa-stack fa-lg pull-left">
                                    <i class="fa fa-{{link.icon}} fa-stack-1x "></i>
                                </span>
                                <span class="link-label">{{link.label}}</span>
                            </a>
                        </li>
                    </ng-container>
                </ul>
                <!-- left nav links ends-->
            </div>

        </div>
    `
})

export class SidebarComponent implements OnInit {
    private _collapsed = true; // default collaped sidebar at begining
    // ['Dashboard', 'Tenant Provisioning', 'Approval', 'Reports', 'Activity'];
    sideBarLinks= sideBarLinks;

    @Input()userProfile: UserProfile;

    @Output()toggle = new EventEmitter<{collapsed: boolean}>();

    @ViewChild('sidebar') sidebar: ElementRef;

    constructor( private renderer: Renderer2) { }

    ngOnInit() { }

    toggleSideBar() {
        if (this._collapsed) {
            this.renderer.setStyle(this.sidebar.nativeElement, 'width', '190px');
        }else {
            this.renderer.removeStyle(this.sidebar.nativeElement, 'width');
        }
        this._collapsed = !this._collapsed;

        this.toggle.emit({collapsed: this._collapsed});
    }

    isAllowable(label: string): boolean {
        switch (label) {
            case sideBarLinks[1].label: // Tenant Provisioning
            case sideBarLinks[2].label: // Approval
                return this.checkUserRole([
                    AdminConstant.SUPER_USER,
                    AdminConstant.GLOBAL_APPROVER,
                    AdminConstant.GLOBAL_ADMIN
                ]);

            case sideBarLinks[3].label: // Reports
                return this.checkUserRole([
                    AdminConstant.SUPER_USER,
                    AdminConstant.GLOBAL_APPROVER,
                    AdminConstant.GLOBAL_ADMIN,
                    AdminConstant.TENANT_ADMIN]);
            default: // activity
                return true;
        }
    }

    checkUserRole(userRoleList: string[]): boolean {
        if (this.userProfile) {
            return userRoleList.indexOf(this.userProfile.role) > -1;
        }
        return false;
    }

}
