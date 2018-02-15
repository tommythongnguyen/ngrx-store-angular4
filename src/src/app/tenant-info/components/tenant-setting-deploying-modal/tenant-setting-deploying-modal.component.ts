import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'deploying-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <erag-modal
            [show]="show"
            [dismissable]='false'
            customWidth="50%">

            <div class="erag-modal-header">
                <span>Deployment Status</span>
            </div>
            <div class="erag-modal-body">
                <div class="alert alert-info" role="alert">
                    <p>Deploying a Tenant Cluster may take 10 to 30 minutes. You can continue to perform other tabs.</p>
                    <p>We will inform you on the status of deployment by email once the deployment is successfully completed.</p>
                </div>
            </div>

            <div class="erag-modal-footer">
                <div class="alert alert-warning" role="alert">
                    Note: Actions related to this tenant cannot be performedwhen Cluster Deploymentis in Process.
                </div>
            </div>
        </erag-modal>
    `,
    styles: [``]
})
export class TenantSettingDeployingModalComponent {
    @Input() show = false;
}
