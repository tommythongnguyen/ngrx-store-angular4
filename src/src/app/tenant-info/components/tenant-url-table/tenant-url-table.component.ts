import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { TenantUrlData } from '../../../state';
import ADMIN_CONSTANTS from '../../../admin.constant';

export interface TenantUrlList extends TenantUrlData {
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
    selector: 'tenant-url-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'tenant-url-table.component.html',
    styleUrls: ['tenant-url-table.component.scss']
})

export class TenantUrlTableComponent implements OnInit {

    // --- for Footer of Table-------
    paginationChoiceList = [
        { name: 10 },
        { name: 25 },
        { name: 50 },
        { name: 100 }
    ];

    showPaginationDropdown = false;

    checkedAll = false;

    private _selectedUrl: TenantUrlList;
    showDelete: boolean;
    @Input() urlList: TenantUrlList[] = [];

    @Input() headerControls: HeaderControls;
    @Input() paginationControls: PaginationControls;

    @Output() add = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();
    @Output() selected = new EventEmitter<string[]>();
    @Output() delete = new EventEmitter<any>();

    @Output() controlsChanged = new EventEmitter<HeaderControls>();
    @Output() paginationChanged = new EventEmitter<PaginationControls>();

    @Input() user;

    constructor() { }

    ngOnInit() { }

    trackByFn(index: number, tenantUrl: TenantUrlList): string {
        return tenantUrl.id;
    }
    emitEvent() {
        const idList = this.urlList
            .filter(item => item.checked)
            .map(item => {
                if (item.checked) {
                    // return { id: item.id };
                    return item.id;
                }
            });

        this.selected.emit(idList);
    }

    onClickEditIcon(tenantUrl: TenantUrlList) {
        event.stopPropagation();
        this.edit.emit(tenantUrl);
    }

    setCheckedAll() {
        this.checkedAll = !this.urlList.some(url => {
            if (!url.checked) {
                return true;
            }
            return false;
        });
        this.emitEvent();
    }

    onCheckboxChange(url: TenantUrlList) {
        url.checked = !url.checked;
        this._selectedUrl = url;
        this.setCheckedAll();
    }

    // toggle checkedAll checkbox
    toggleAllUrl(): boolean {
        this.checkedAll = !this.checkedAll;
        this.urlList.forEach(url => {
            url.checked = this.checkedAll;
        });
        this.emitEvent();
        return false;
    }

    getStatusClass(url: TenantUrlList): string {
        if (url.status === ADMIN_CONSTANTS.STATUS.PENDING_APPROVAL ||
            url.status === ADMIN_CONSTANTS.STATUS.PENDING_DEPLOYMENT) {
            return 'status-pending';
        } else if (url.status === ADMIN_CONSTANTS.STATUS.APPROVED) {
            return 'status-on';
        } else if (url.status === ADMIN_CONSTANTS.STATUS.REJECTED) {
            return 'status-reject';
        } else if (url.status === ADMIN_CONSTANTS.STATUS.APPROVED_DEPLOYING) {
            return 'status-deploying-approved';
        } else if (url.status === ADMIN_CONSTANTS.STATUS.REJECTED_DEPLOYING) {
            return 'status-deploying-rejected';
        } else if (url.status === ADMIN_CONSTANTS.STATUS.APPROVED_DEPLOYED) {
            return 'status-deployed-approved';
        } else {
            return 'status-active';
        }
    }

    onBtnDeleteCLick() {
        event.stopPropagation();
        this.delete.emit();
    }

    onBtnAddCLick() {
        event.stopPropagation();
        this.add.emit();
    }

    onInputSearch($event) {
        this.headerControls.search = $event;
        this.controlsChanged.emit(this.headerControls);
    }

    get isURLSelected(): boolean {
        if (this.checkedAll) {
            return true;
        }

        return this.urlList.some(url => {
            if (url.checked) {
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
}
