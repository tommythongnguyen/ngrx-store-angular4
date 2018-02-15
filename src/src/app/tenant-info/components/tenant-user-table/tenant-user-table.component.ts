import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';

import AdminConstants from '../../../admin.constant';
import { TenantUser } from '../../../state';

export interface TenantUserList extends TenantUser {
    checked: boolean;
}

export interface HeaderControls {
    search: string;
}

export interface PaginationControls {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
}


@Component({
    selector: 'tenant-user-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'tenant-user-table.component.html',
    styleUrls: ['tenant-user-table.component.scss']
})

export class TenantUserTableComponent implements OnInit {
    isAllSelected = false;
    constants: any = AdminConstants;

    // --- for Footer of Table-------
    paginationChoiceList = [
        { name: 10 },
        { name: 25 },
        { name: 50 },
        { name: 100 }
    ];

    showPaginationDropdown = false;

    @Input() userList: TenantUserList[] = [];

    @Input() headerControls: HeaderControls;
    @Input() paginationControls: PaginationControls;

    @Output() selected = new EventEmitter<string[]>();
    @Output() deleted = new EventEmitter<any>();
    @Output() add = new EventEmitter<any>();

    @Output() controlsChanged = new EventEmitter<HeaderControls>();
    @Output() paginationChanged = new EventEmitter<PaginationControls>();

    constructor(private renderer: Renderer2) { }

    ngOnInit() {
    }

    // toggle functionality for appproval selection
    toggleUserList(): boolean {
        this.isAllSelected = !this.isAllSelected;
        this.userList.forEach(user => {
            user.checked = this.isAllSelected;
        });
        this.emitEvent();
        return false;
    }

    onCheckboxChange(user: TenantUserList) {
        user.checked = !user.checked;
        this.updateCheckedAll();
    }

    updateCheckedAll() {
        this.isAllSelected = !this.userList.some(user => {
            if (!user.checked) {
                return true;
            }
            return false;
        });
        this.emitEvent();
    }

    emitEvent() {
        const idList = this.userList
            .filter(item => item.checked)
            .map(item => {
                if (item.checked) {
                    return item.id;
                }
            });
        this.selected.emit(idList);
    }

    onBtnDeleteCLick() {
        event.stopPropagation();
        this.deleted.emit();
    }

    onBtnAddCLick() {
        event.stopPropagation();
        this.add.emit();
    }

    onInputSearch($event) {
        this.headerControls.search = $event;
        this.controlsChanged.emit(this.headerControls);
    }

    get isUserSelected(): boolean {
        if (this.isAllSelected) {
            return true;
        }

        return this.userList.some(user => {
            if (user.checked) {
                return true;
            }
            return false;
        });
    }

    // ---------For Footer Pagination ------
    onPaginationDropdownSelected($event) {
        this.paginationControls.itemsPerPage = $event.name;
    }

    onPageChange($event) {
        this.paginationControls.currentPage = $event.page;
        this.paginationChanged.emit(this.paginationControls);
    }

    onPaginationDropdownToggle() {
        this.showPaginationDropdown = !this.showPaginationDropdown;
        this.paginationChanged.emit(this.paginationControls);
    }

    trackByFn(index: number, user: any): number {
        return index;
    }
}
