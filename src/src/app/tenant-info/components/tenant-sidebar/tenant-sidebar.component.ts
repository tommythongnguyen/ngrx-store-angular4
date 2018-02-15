
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
    SimpleChanges,
    ViewChild
} from '@angular/core';

export interface Nav {
    title?: string;
    domId?: string;
    active: boolean;
    link: string;
    icon: string;
}

@Component({
    selector: 'tenant-sidebar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-sidebar.component.scss'],
    template: `
        <div class="text-center tabs-icons">
            <ul>
                <li *ngFor="let nav of navList; trackBy: trackByFn">
                    <a (click)="onClick(nav)" title="{{nav.title}}" id="nav.domId" [ngClass]="{'disableNav': !nav.active}">
                       <i class="fa {{nav.icon}} fa-2x circle-nav" [ngStyle]="{'background-color': (activeNavLink === nav.link)? '#e84c3d': ''}"
                            (mouseenter)="mouseOver(nav)" (mouseleave)="mouseOut(nav)"></i>
                    </a>
                </li>
            </ul>
        </div>
    `
})
export class TenantSidebarComponent implements  OnChanges {
    activeNavLink: string;

    @Input() navList: Nav[];

    @Output() select = new EventEmitter<Nav>();

    constructor(private renderer: Renderer2) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.navList && changes.navList.currentValue) {
            if (this.navList[0].active) {
                this.activeNavLink = this.navList[0].link;
            }
        }
    }

    trackByFn(index: number, nav: Nav): number {
        return index;
    }
    onClick(nav: Nav) {
        event.stopPropagation();
        this.activeNavLink = nav.link;
        this.select.emit(nav);
    }

    mouseOver(nav: Nav) {
        event.stopPropagation();
        event.preventDefault();
        if (nav.active) {
            this.renderer.addClass(event.target, 'active');
        }
    }
    mouseOut(nav: Nav) {
        event.stopPropagation();
        event.preventDefault();
        if (nav.active) {
            this.renderer.removeClass(event.target, 'active');
        }
    }
}
