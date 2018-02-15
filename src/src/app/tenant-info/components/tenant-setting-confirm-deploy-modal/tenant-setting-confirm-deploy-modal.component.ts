import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'confirm-deploy-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <erag-modal
            [show]="show"
            submitBtnLabel="Confirm"
            cancelBtnLabel="Cancel"
            customWidth="50%"
            (submit)="confirmed.emit();"
            (hide)="hide.emit()">

            <div class="erag-modal-header">
                <span>Deployment Confirmation</span>
            </div>
            <div class="erag-modal-body">
                <div class="alert alert-warning" role="alert">
                    Are you sure you want to deploy the tenant
                </div>
            </div>
        </erag-modal>
    `,
    styles: [``]
})
export class TenantSettingConfirmDeployModalComponent {
    @Input() show = false;

    @Output() confirmed = new EventEmitter<any>();
    @Output() hide = new EventEmitter<any>();
}
