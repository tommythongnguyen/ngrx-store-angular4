import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';

export interface TabConfig{
    id: string;
    header: string;
    customClass?: string;
}

@Component({
    selector: 'tenant-tabs',
    styleUrls: ['tenant-tabs.component.scss'],
    template: `
        <ng-container *ngIf="tabs?.length">
            <ul class="nav nav-tabs" (click)="$event.preventDefault()">
                <li *ngFor="let tab of tabs" [ngClass]="['nav-item', tab.customClass || '']" >
                    <a class="nav-link" [class.active]="isSelected(tab)" (click)="onSelect(tab)">
                        <span>{{tab.header}}</span>
                        <span *ngIf="removable">
                          <span (click)="$event.preventDefault(); removeTab(tab);" class="glyphicon glyphicon-remove-circle"></span>
                        </span>
                    </a>
                </li>
            </ul>

            <div class="tab-content">
                <ng-content></ng-content>
            </div>
        </ng-container>
    `
})
export class TenantTabsComponent implements OnInit, OnChanges {
    private _selectedId: string;

    @Input() tabs: TabConfig[];
    @Input() removable = true;

    @Output() selected = new EventEmitter<TabConfig>();
    @Output() removed = new EventEmitter<TabConfig>();

    constructor() { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges){
        if(changes.tabs && changes.tabs.currentValue.length){
            // --- default: make new tab is the active one
            this._selectedId = this.tabs[this.tabs.length -1].id;
        }
    }
    onSelect(tab: TabConfig){
        this._selectedId = tab.id;
        // ---- need to get data to selected Tab Content
        this.selected.emit(tab);
    }
    removeTab(tab: TabConfig){
        // --- need to set _selectedId
        this.removed.emit(tab);
    }

    isSelected(tab:TabConfig):boolean{
        return tab.id === this._selectedId;
    }

}