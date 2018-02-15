import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'erag-pagination',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./erag-pagination.component.scss'],
    template: `
        <ng-container *ngIf ="totalItems > itemsPerPage">
            <pagination class="pagination-sm"
                        [totalItems]="totalItems"
                        [itemsPerPage]="itemsPerPage"
                        [(ngModel)]="currentPage"
                        [maxSize]="maxSize"
                        [boundaryLinks]="true"
                        firstText ="<"
                        lastText =">"
                        [directionLinks]="false"
                        [rotate]="false"
                        (pageChanged)="onPageChanged($event)"
                        (numPages)="onNumPages($event)">
            </pagination>
        </ng-container>
    `
})
export class EragPaginationComponent implements OnInit {
    @Input() maxSize = 3; // total page show in the pagination
    @Input() totalItems = 20;  // total item of all pages
    @Input() itemsPerPage = 20; // number of item of 1 page
    @Input() currentPage = 1;

    @Output() pageChange = new EventEmitter<any>();
    onPageChanged($event: any): void {
        event.stopPropagation();
        this.pageChange.emit($event);
    }

    onNumPages($event: number) {
        // console.log('numPage: ' , $event);
    }
    constructor() { }

    ngOnInit() { }
}
