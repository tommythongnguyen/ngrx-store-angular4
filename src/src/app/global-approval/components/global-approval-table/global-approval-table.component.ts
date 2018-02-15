import { UserProfile } from './../../../auth/services/user-profile.interface';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
} from '@angular/core';
import AdminConstant from '../../../admin.constant';
import { GlobalApproval } from '../../../state';

export interface TableGlobalApproval extends GlobalApproval {
    checked: boolean;
    showUsersTable: boolean;
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
    selector: 'global-approval-table',
    templateUrl: 'global-approval-table.component.html',
    styleUrls: ['global-approval-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalApprovalTableComponent implements OnInit, OnDestroy {
    isAllSelected = false;

    // -----date picker--------
    showFromDatePicker = false;
    showToDatePicker = false;

    // ---- Filter by dropdow-----
    showFilterDropdown = false;
    dropdownStatusList= [
        {name: AdminConstant.STATUS.APPROVED},
        {name: AdminConstant.STATUS.PENDING_APPROVAL},
        {name: AdminConstant.STATUS.REJECTED}
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

    @Input() userProfile: UserProfile;

    @Input() approvalList: TableGlobalApproval[] = [];
    @Input() headerControls: HeaderControls;
    @Input() paginationControls: PaginationControls;

    @Output() selected = new EventEmitter<string[]>();
    @Output()rejected =  new EventEmitter<any>();
    @Output()approved =  new EventEmitter<any>();

    @Output() controlsChanged = new EventEmitter<HeaderControls>();
    @Output() paginationChanged = new EventEmitter<PaginationControls>();

    constructor(
        private renderer: Renderer2,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.registerEventListeners();
    }

    registerEventListeners() {
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
            if (approval.status === AdminConstant.STATUS.PENDING_APPROVAL) {
                approval.checked = this.isAllSelected;
            }
        });

        this.emitEvent();
        return false;
    }

    onCheckboxChange(approval: TableGlobalApproval) {
        approval.checked = !approval.checked;
        this.updateCheckedAll();
    }

    updateCheckedAll() {
        this.isAllSelected = !this.approvalList.some(approval => {
            if (!approval.checked && approval.status === AdminConstant.STATUS.PENDING_APPROVAL) {
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

    checkApprovalPendingCheckbox(item: TableGlobalApproval): boolean {
        return item.status === AdminConstant.STATUS.PENDING_APPROVAL;
    }

    get isHavingPendingApprovalTenant(): boolean {
        if (this.approvalList && this.approvalList.length) {
            return this.approvalList.some(item => item.status === AdminConstant.STATUS.PENDING_APPROVAL);
        }
        return false;
    }

    get isTenantSelected(): boolean{
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

    isTenantType(approval: TableGlobalApproval): boolean {
        return approval.entity_type === AdminConstant.ENTITY_TYPES.TENANT;
    }

    trackByFn(index: number, approval: GlobalApproval): string {
        return approval.id;
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

    get isAllowable(): boolean {
        if (this.userProfile) {
            if (this.userProfile.role === AdminConstant.SUPER_USER ||
                this.userProfile.role === AdminConstant.GLOBAL_APPROVER) {
                return true;
            }
        }
        return false;
    }

    ngOnDestroy() {
        if (this._clickCallback) {
            this._clickCallback();
        }
    }
}
