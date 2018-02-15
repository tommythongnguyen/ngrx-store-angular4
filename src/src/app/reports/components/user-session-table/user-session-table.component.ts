import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, Directive } from '@angular/core';
import { UserSessionLogData, Tenant} from '../../../state';

export interface HeaderControls {
    tenant: string;
}

export interface PaginationControls {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
}

@Component({
    selector: 'user-session-table',
    templateUrl: './user-session-table.component.html',
    styleUrls: ['./user-session-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSessionTableComponent implements OnInit {

    // --- for Footer of Table-------
    paginationChoiceList = [
        { name: 10 },
        { name: 25 },
        { name: 50 },
        { name: 100 }
    ];

    showPaginationDropdown: Boolean= false;

    @Input() userSessionList: any;
    @Output() killSession = new EventEmitter<any>();
    @Input() headerControls: HeaderControls;
    @Input() paginationControls: PaginationControls;
    @Input() tenants: Tenant[];
    @Output() controlsChanged = new EventEmitter<HeaderControls>();
    @Output() paginationChanged = new EventEmitter<PaginationControls>();

    constructor() { }

    ngOnInit() {
    }

    trackByFn(index: number, userSession: any): number {
        return index;
    }

    // Function is used to notify kill session

    notifyKillSession(sessionData) {
        this.killSession.emit(sessionData);
    }

    onTenantChange() {
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
