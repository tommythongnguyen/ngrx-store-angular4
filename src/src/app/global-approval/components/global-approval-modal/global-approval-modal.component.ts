import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

export type Action = 'approve' | 'reject';
@Component({
    selector: 'global-approval-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
       <erag-modal [show]="show"
                   submitBtnLabel="OK"
                   cancelBtnLabel ="Cancel"
                   customWidth="50%"
                   [showLoading] ="submitting"
                   (submit)="onSubmit()"
                   (hide)="onHide()">

            <div class="erag-modal-header">
                <span>{{action === 'approve'? 'Approve Request' : 'Reject Request'}}</span>
            </div>
            <div class="erag-modal-body">
                <div class="message-container">
                   <div class="message" style="color:green;padding:10px;">{{action === 'approve' ?
                                                'Are you sure you want to approve the Request':
                                                'Are you sure you want to Reject the Request?'
                                         }}
                     </div>
                </div>

                <ng-container *ngIf="action === 'reject'">
                   <div class="row message-container" style="background-color:#f4f4f4;border:1px solid #ccc;padding:15px 20px 15px 20px;margin:15px 5px 5px 5px;border-radius:5px">
                      <div class="reject-message text-left" >Reason for the Rejection
                      <textarea class="form-control col-xs-12" rows="2" [(ngModel)]="rejectReason"></textarea>
                      </div>
                      
                   </div>
                </ng-container>
            </div>
        </erag-modal>
    `
})
export class GlobalApprovalModalComponent {
   rejectReason = '';
   @Input() action: Action;
   @Input() show = false;
   @Input() submitting = false;

   @Output() hide = new EventEmitter<any>();
   @Output() confirmed = new EventEmitter<{action: string, message: string}>();
   onHide(){
       this.rejectReason = '';
       this.hide.emit();
   }
   onSubmit(){
       this.confirmed.emit({action: this.action, message: this.rejectReason});
       this.rejectReason = '';
   }

}
