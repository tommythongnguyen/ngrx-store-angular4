import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, Renderer2 } from '@angular/core';
import AdminConstants from '../../../admin.constant';
import { TenantGroup, AdSyncGroup } from '../../../state';

export interface TableTenantGroup extends TenantGroup {
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
    selector: 'tenant-group-table',
    templateUrl: 'tenant-group-table.component.html',
    styleUrls: ['tenant-group-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantGroupTableComponent implements OnInit {
    isAllSelected = false;
    constants: any = AdminConstants;

    // --- for Footer of Table-------
    paginationChoiceList = [
        { name: 10 },
        { name: 25 },
        { name: 50 },
        { name: 100 }
    ];

    showPaginationDropdown: Boolean= false;
    showSyncForm: Boolean = false; // Use for show ad sync form

    @Input() groupList: TableTenantGroup[] = [];
    @Input() adSyncGroupList: AdSyncGroup[] = [];

    @Input() headerControls: HeaderControls;
    @Input() paginationControls: PaginationControls;

    @Output() selected = new EventEmitter<string[]>();
    @Output()deleted =  new EventEmitter<any>();
    @Output()add =  new EventEmitter<any>();
    @Output()groupclicked =  new EventEmitter<any>();

    /* Ad Sync output fields */
    @Output()searchAdSync =  new EventEmitter<string>();
    @Output()adSyncSave =  new EventEmitter<any>();
    @Output() resetAdSyncData = new EventEmitter<any>();
    // @Output() adSyncSelected = new EventEmitter<string[]>();
    /* End of code for Ad Sync */

    @Output() controlsChanged = new EventEmitter<HeaderControls>();
    @Output() paginationChanged = new EventEmitter<PaginationControls>();

    constructor(private renderer: Renderer2) { }

    ngOnInit() { }

    // toggle functionality for group selection
    toggleGroupList(): boolean {
        this.isAllSelected = !this.isAllSelected;

        this.groupList.forEach(group => {
                group.checked = this.isAllSelected;
        });

        this.emitEvent();
        return false;
    }

    onCheckboxChange(group: TableTenantGroup) {
        group.checked = !group.checked;
        this.updateCheckedAll();
    }

    updateCheckedAll() {
        this.isAllSelected = !this.groupList.some(group => {
            if (!group.checked) {
                return true;
            }
            return false;
        });
        this.emitEvent();
    }

    emitEvent() {
        const idList = this.groupList
            .filter(item => item.checked)
            .map(item => {
                if (item.checked) {
                    return item.id;
                }
            });
        this.selected.emit(idList);
    }

    get isGroupSelected(): boolean{
        if (this.isAllSelected) {
            return true;
        }

        return this.groupList.some(group => {
            if (group.checked) {
                return true;
            }
            return false;
        });
    }

    trackByFn(index: number, group: any): number {
        return index;
    }

    onBtnDeleteCLick() {
        event.stopPropagation();
        this.deleted.emit();
    }

    onBtnAddCLick() {
        event.stopPropagation();
        this.add.emit();
    }

    /* Code for ad sync */
    onBtnAddSyncAdGroupCLick() {
        this.showSyncForm = true;
    }

    onBtnSearchAdSyncClick(searchValue) {
        this.searchAdSync.emit(searchValue);
    }

    onAdSyncSubmitClick(adSyncFormData: any) {
        this.adSyncSave.emit(adSyncFormData);
    }

    onBtnHideAdSyncClick() {
        this.showSyncForm = false;
    }

    onResetAdSyncForm() {
        this.resetAdSyncData.emit();
    }

    /* End Code for ad sync */

    onGroupNameClick(group: TenantGroup) {
        event.stopPropagation();
        this.groupclicked.emit(group);
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
