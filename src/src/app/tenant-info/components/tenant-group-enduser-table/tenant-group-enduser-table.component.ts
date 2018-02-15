import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
import AdminConstants from '../../../admin.constant';
import { TenantGroupEndUser } from '../../../state';

export interface TableTenantGroupEndUser extends TenantGroupEndUser {
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
    selector: 'tenant-group-enduser-table',
    templateUrl: 'tenant-group-enduser-table.component.html',
    styleUrls: ['tenant-group-enduser-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantGroupEndUserTableComponent implements OnInit {
    isAllSelected = false;
    constants: any = AdminConstants;

    // --- for Footer of Table-------
    paginationChoiceList = [
        { name: 10 },
        { name: 25 },
        { name: 50 },
        { name: 100 }
    ];

    showPaginationDropdown= false;

    @Input() groupEndUserList: TableTenantGroupEndUser[] = [];

    @Input() headerControls: HeaderControls;
    @Input() paginationControls: PaginationControls;

    @Output() selected = new EventEmitter<string[]>();
    @Output()action =  new EventEmitter<string>();

    @Output() controlsChanged = new EventEmitter<HeaderControls>();
    @Output() paginationChanged = new EventEmitter<PaginationControls>();

    constructor(private renderer: Renderer2) { }

    ngOnInit() { }

    // toggle functionality for group selection
    toggleGroupEndUserList(): boolean {
        this.isAllSelected = !this.isAllSelected;

        this.groupEndUserList.forEach(groupEndUser => {
                groupEndUser.checked = this.isAllSelected;
        });

        this.emitEvent();
        return false;
    }

    onCheckboxChange(groupEndUser: TableTenantGroupEndUser) {
        groupEndUser.checked = !groupEndUser.checked;
        this.updateCheckedAll();
    }

    updateCheckedAll() {
        this.isAllSelected = !this.groupEndUserList.some(groupEndUser => {
            if (!groupEndUser.checked) {
                return true;
            }
            return false;
        });
        this.emitEvent();
    }

    emitEvent() {
        const idList = this.groupEndUserList
            .filter(item => item.checked)
            .map(item => {
                if (item.checked) {
                    return item.id;
                }
            });
        this.selected.emit(idList);
    }

    get isGroupEndUserSelected(): boolean{
        if (this.isAllSelected) {
            return true;
        }

        return this.groupEndUserList.some(enduser => {
            if (enduser.checked) {
                return true;
            }
            return false;
        });
    }

    get isShowResendMail(): boolean{
        if (this.groupEndUserList && this.groupEndUserList.length > 0) {
            if (this.groupEndUserList[0].tenant.settings.twofa.twofa_type === AdminConstants.AUTHENTICATIONTYPES.GOOGLE) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    trackByFn(index: number, enduser: any): number {
        return index;
    }

    onActionBtnClick(type) {
        event.stopPropagation();
        this.action.emit(type);
    }

    onInputSearch($event) {
        this.headerControls.search = $event;
        this.controlsChanged.emit(this.headerControls);
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

}
