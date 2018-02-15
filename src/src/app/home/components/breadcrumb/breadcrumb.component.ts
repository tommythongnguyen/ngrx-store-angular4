import { NavigationEnd, Router } from '@angular/router';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'breadcrumb',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['breadcrumb.component.scss'],
    template: `
        <div class="row breadcrumb-box">
            <div class="col-sm-6">
                    <h4>
                        <i class="fa fa-{{icon}}"></i>
                        <span *ngIf="links.length === 1; else list">{{links[0]}}</span>
                        <ng-template  #list>
                            <ng-container *ngFor="let link of links; let i = index; trackBy: trackLinkFn ">
                                <a *ngIf = "i < (linksLength -1); else other">{{link}}</a>
                                <i #other> >> {{link}}</i>
                            </ng-container>
                        </ng-template>
                    </h4>
            </div>
            <div class="col-sm-6 text-right tenant-box">
                <ng-content select=".breadcrumb-right-content"></ng-content>
            </div>
        </div>
    `
})
export class BreadcrumbComponent implements OnInit {
    @Input()links: string[]= []; // [dashboard, homedeport]
    @Input()colsize = 'sm';
    @Input() icon = '';
    constructor( private router: Router) {}
    ngOnInit() { }

    get linksLength(): number{
        return this.links.length;
    }

    trackLinkFn(index: number, link: string): number {
        return index;
    }
}
