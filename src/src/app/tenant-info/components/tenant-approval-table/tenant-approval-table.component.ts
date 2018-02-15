import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    ChangeDetectorRef
} from '@angular/core';
import AdminConstants from '../../../admin.constant';
import { TenantApproval } from '../../../state';

export interface TableTenantApproval extends TenantApproval {
    checked: boolean;
}

export interface HeaderControls {
    filterBy: string;
    fromDate: Date | null;
    toDate: Date | null;
    search: string;
}

export interface PaginationControls {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
}


@Component({
    selector: 'tenant-approval-table',
    templateUrl: 'tenant-approval-table.component.html',
    styleUrls: ['tenant-approval-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantApprovalTableComponent implements OnInit, OnDestroy {
    isAllSelected = false;
    constants: any = AdminConstants;

    // -----date picker--------
    showFromDatePicker = false;
    showToDatePicker = false;

    // ---- Filter by dropdow-----
    showFilterDropdown = false;
    dropdownStatusList= [
        {name: AdminConstants.STATUS.APPROVED},
        {name: AdminConstants.STATUS.PENDING_APPROVAL},
        {name: AdminConstants.STATUS.REJECTED}
    ];

    // --- for Footer of Table-------
    paginationChoiceList = [
        { name: 10 },
        { name: 25 },
        { name: 50 },
        { name: 100 }
    ];

    showPaginationDropdown = false;

    private _clickCallback: Function;

    @Input() approvalList: TableTenantApproval[] = [];

    @Input() headerControls: HeaderControls;
    @Input() paginationControls: PaginationControls;

    @Output() selected = new EventEmitter<string[]>();
    @Output()rejected =  new EventEmitter<any>();
    @Output()approved =  new EventEmitter<any>();

    @Output() controlsChanged = new EventEmitter<HeaderControls>();
    @Output() paginationChanged = new EventEmitter<PaginationControls>();

    constructor(
        private renderer: Renderer2,
        private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this._clickCallback = this.renderer.listen('document', 'click', () => {
            this.showFromDatePicker = false;
            this.showToDatePicker = false;
            this.showPaginationDropdown = false;
            this.showFilterDropdown = false;
            this.cd.markForCheck();
        });
    }

    // toggle functionality for appproval selection
    toggleApprovalList(): boolean {
        this.isAllSelected = !this.isAllSelected;

        this.approvalList.forEach(approval => {
            if (approval.status === AdminConstants.STATUS.PENDING_APPROVAL) {
                approval.checked = this.isAllSelected;
            }
        });

        this.emitEvent();
        return false;
    }

    onCheckboxChange(approval: TableTenantApproval) {
        approval.checked = !approval.checked;
        this.updateCheckedAll();
    }

    updateCheckedAll() {
        this.isAllSelected = !this.approvalList.some(approval => {
            if (!approval.checked && approval.status === AdminConstants.STATUS.PENDING_APPROVAL) {
                return true;
            }
            return false;
        });
        this.emitEvent();
    }

    emitEvent() {
        const idList = this.approvalList
            .filter(item => item.checked)
            .map(item => {
                if (item.checked) {
                    return item.id;
                }
            });
        this.selected.emit(idList);
    }

    checkApprovalPendingCheckbox(item: TableTenantApproval): boolean {
        return item.status === AdminConstants.STATUS.PENDING_APPROVAL;
    }

    get isHavingPendingApprovalTenant(): boolean {
        if (this.approvalList && this.approvalList.length) {
            return this.approvalList.some(item => item.status === AdminConstants.STATUS.PENDING_APPROVAL);
        }
        return false;
    }

    requestType(item: TableTenantApproval): string {
        console.log(item.entity_type);
        if (item.entity_type === AdminConstants.ENTITY_TYPES.UPDATE_URL ||
            item.entity_type === AdminConstants.ENTITY_TYPES.URL_DEPROVISION) {
                return 'Existing';
        } else if (item.entity_type === AdminConstants.ENTITY_TYPES.URL) {
            return 'New';
        }
        return '';
    }

    get isApprovalSelected(): boolean{
        if (this.isAllSelected) {
            return true;
        }

        return this.approvalList.some(approval => {
            if (approval.checked) {
                return true;
            }
            return false;
        });
    }

    trackByFn(index: number, approval: any): number {
        return index;
    }

    onBtnApproveCLick() {
        event.stopPropagation();
        this.approved.emit();

    }
    onBtnRejectCLick() {
        event.stopPropagation();
        this.rejected.emit();
    }

    // ------header ------------
    onDatePickerToggle(dateType: string) {
       if (dateType === 'fromDate') {
           this.showFromDatePicker = !this.showFromDatePicker;
       } else {
           this.showToDatePicker = !this.showToDatePicker;
       }
    }
    onDatePickerSelected($event: any, dateType: string) {
      this.onDatePickerToggle(dateType);
      if (dateType === 'fromDate') {
         this.headerControls.fromDate = $event;
      }else {
          this.headerControls.toDate = $event;
      }

      this.controlsChanged.emit(this.headerControls);
    }

    // -----FilterBy Dropdown-------
    onFilterByDropdownSelected($event: {name: string}) {
        this.showFilterDropdown = false;
        this.headerControls.filterBy = $event.name;
        this.controlsChanged.emit(this.headerControls);
    }

    onFilterByDropdownToggle() {
        this.showFilterDropdown = !this.showFilterDropdown;

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

    ngOnDestroy() {
        if (this._clickCallback) {
            this._clickCallback();
        }
    }

}
