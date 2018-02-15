import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'delete-tenant-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['delete-tenant-modal.component.scss'],
    template: `
        <erag-modal
            [show]="show"
            submitBtnLabel="OK"
            cancelBtnLabel="Cancel"
            customWidth="50%"
            (submit)="onModalSubmitted()"
            (hide)="onModalHide()">

            <div class="erag-modal-header">
                <span>Delete Tenant</span>
            </div>
            <div class="erag-modal-body" style="color:green;padding:10px;">
                <span>Are you sure if you want to delete the Tenant?</span>
            </div>
        </erag-modal>
    `
})
export class DeleteTenantModalComponent implements OnInit {
    @Input() show = false;

    @Output() hide = new EventEmitter<any>();
    @Output() confirmed = new EventEmitter<any>();
    constructor() { }

    ngOnInit() { }

    onModalHide() {
        this.hide.emit();
    }
    onModalSubmitted() {
        this.confirmed.emit();
    }
}
