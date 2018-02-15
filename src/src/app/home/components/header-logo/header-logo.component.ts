import { UserProfile } from '../../../auth/services/user-profile.interface';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


import AdminConstant from '../../../admin.constant';

@Component({
    selector: 'header-logo',
    styleUrls: [`./header-logo.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="navbar-header">
            <img [src]="imageUrl">
        </div>
    `
})

export class HeaderLogoComponent {
    url = '';
    @Input()profile: UserProfile;
    get imageUrl(): string{
        if (this.profile) {
            if ( this.profile.role === AdminConstant.SUPER_USER ||
                this.profile.role === AdminConstant.GLOBAL_ADMIN ||
                this.profile.role === AdminConstant.GLOBAL_APPROVER) {
                    this.url = '../../../../assets/images/logoTHD.png';
           }else {
               this.url = '../../../../assets/images/logo/' + this.profile.tenantLogo;
           }
        }
        return this.url;
    }
    constructor() { }
}
