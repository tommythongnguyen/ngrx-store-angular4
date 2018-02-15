import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, HostListener} from '@angular/core';

export interface GroupDetail {
    id: string;
    name?: string;
}
@Component({
    selector: 'tenant-ulr-group-dropdown',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['tenant-url-group-dropdown.component.scss'],
    template: `
        <div class="btn-group container">
            <button class="btn btn-default btn-block erad-dropdown-header"
                    type="button" aria-haspopup="true"
                    (click)="toggleDropdown()">

                    <span [ngClass]="{'hidden': filterable && focused}"></span>

                    <ul>
                        <li *ngFor="let selectedItem of seletedItemList; trackBy: trackBySelectedItemFn">
                            <span>{{selectedItem.name}}</span>
                            <i class="fa fa-times" aria-hidden="true"
                               (click) ="onRemoveItem(selectedItem)"></i>
                        </li>
                    </ul>

                    <input type="text" class="query-input"
                            (click)="stopEvent()"
                            placeholder="Select Group" [(ngModel)]="query">

                    <i class="fa fa-arrow-circle-down toggle-icon" aria-hidden="true"></i>
            </button>

            <ul class="dropdown-menu dropdown-menu-tenant" [ngClass]="{'visible': show}">
                <li *ngFor="let item of listItem | fullTextSearch: query : 'name' ; trackBy: trackByFn; let i : index">
                    <a (click) ="onSelectItem(item)">{{item.name}}</a>
                </li>
            </ul>
        </div>
    `,
})
export class TenantUrlGroupDropdownComponent implements OnInit {
    query = '';
    seletedItemList: GroupDetail[] = []; // holding list of item user select
    listItem: GroupDetail[] = [];

    @Input() filterable = true;
    @Input() show = false;
    @Input() set list(group: GroupDetail[]) {
        if (group) {
            this.listItem = group;
        }
    }
    @Input() set existList(urlData: any) {
        if (urlData && Array.isArray(urlData.group)) {
            this.seletedItemList = urlData.group;
            this.selected.emit(this.seletedItemList);
        }
    }

    @Output() toggle = new EventEmitter<any>();
    @Output() selected = new EventEmitter<GroupDetail[]>();

    constructor() { }

    ngOnInit() { }

    toggleDropdown() {
        event.stopPropagation();
        this.toggle.emit('toggle');
    }

    onSelectItem(item: GroupDetail) {
        event.stopPropagation();
        // add item to the selected Item list
        this.seletedItemList.push(item);
        // remove the item from the list item
        this.listItem = this.listItem.filter(group => group.id !== item.id);

        if (!this.listItem.length) {
            this.toggle.emit('close');
        }

        this.selected.emit(this.seletedItemList);
    }

    onRemoveItem(item: GroupDetail) {
        event.stopPropagation();
        // remove item to the selected Item list
        this.seletedItemList = this.seletedItemList.filter(group => group.id !== item.id);
        // add the item into the list item
        this.listItem.push(item);

        this.toggle.emit('open');
        this.selected.emit(this.seletedItemList);
    }

    trackByFn(index: number, item: any): string {
        return item.id;
    }

    trackBySelectedItemFn(index: number, item: any): string {
        return item.id;
    }

    stopEvent() {
        event.stopPropagation();
    }
}
