import { SimpleChanges } from '@angular/core';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

// import { Tenant } from '../../../state';
interface DropdownItem {
    name: string;
    [propName: string]: any;
}

export type Direction = 'dropdown' | 'dropup';
@Component({
    selector: 'erad-dropdown',
    styleUrls: ['erad-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="btn-group {{direction}} container" [style.width]="width">
            <button class="btn btn-default dropdown-toggle btn-block erad-dropdown-header"
                    type="button" data-toggle="dropdown" aria-haspopup="true"
                    [ngClass]="{'disableBtn': tenants?.length === 0}"
                    (click)="toggleDropdown($event)">

                    <span [ngClass]="{'hidden': filterable && focused}">{{(_selectedTenant)? _selectedTenant?.name : message}}</span>

                    <input *ngIf="filterable && focused" class="query-input" type="text"
                            placeholder="{{message}}" auto-focus [(ngModel)]="query">

                    <i class="fa fa-{{icon}} pull-right" [ngClass]="{'hidden': tenants?.length === 0}" aria-hidden="true"></i>
            </button>

            <ul class="dropdown-menu dropdown-menu-tenant" [ngClass]="{'visible': show}">
                <li *ngFor="let tenant of tenants | fullTextSearch: query: filterField; trackBy: trackByFn; let i : index">
                    <a (click) ="selectTenant(tenant)">{{tenant.name}}</a>
                </li>
            </ul>
        </div>
    `,
})
export class EradDropdownComponent implements OnInit, OnChanges {
    query = '';
    _selectedTenant: DropdownItem;
    _direction = '';
    search = '';
    focused = false;

    @Input() direction: Direction;
    @Input() width = '268px';
    @Input() filterable = false;
    @Input() filterField = '';
    @Input() show = false;
    @Input() icon = '';
    @Input() message = '';
    @Input() tenants: DropdownItem[];
    @Input() selectedTenant: DropdownItem;

    @Output() toggle = new EventEmitter<any>();
    @Output() select = new EventEmitter<DropdownItem>();

    constructor() { }

    ngOnInit() { }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedTenant) {
            console.log('changes: ', changes.selectedTenant.currentValue);
            if (!!changes.selectedTenant.currentValue) {
                this._selectedTenant = changes.selectedTenant.currentValue;
            } else {
                this._selectedTenant = undefined;
            }
        }
        if (changes.direction && (changes.direction.currentValue === 'dropup')) {
            this._direction = changes.direction.currentValue;
        }
        if (changes.show) {
            this.focused = changes.show.currentValue;
        }
    }
    trackByFn(index, tenant) {
        return index;
    }
    selectTenant(tenant: DropdownItem): boolean {
        this._selectedTenant = tenant;
        this.select.emit(tenant);
        return false;
    }

    toggleDropdown($event: Event) {
        $event.stopPropagation();
        this.toggle.emit();
    }
}
