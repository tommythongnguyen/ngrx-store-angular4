import { BsModalService } from 'ngx-bootstrap/modal';

import { ModalDirective } from 'ngx-bootstrap/ng2-bootstrap';

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

type ModalSize = 'lg' | 'md' | 'sm';
type SubmitBtnLabel = 'Resubmit' | 'Save' | 'Ok' | 'Confirm' |'';
type CancelBtnLabel = 'Close' | 'Cancel';

@Component({
    selector: 'erag-modal',
    styleUrls: ['erag-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div bsModal class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-{{size}}" [style.width]="customWidth">
                <div class="modal-content" [loading] ="showLoading">
                    <div class="modal-header">
                        <h4 class="modal-title pull-left">
                            <ng-content select=".erag-modal-header"></ng-content>
                        </h4>
                        <button type="button" class="close pull-right"
                                *ngIf="dismissable"
                                (click)="hideModal()" aria-label="Close">
                            &times;
                        </button>
                    </div>
                    <div class="modal-body">
                        <ng-content select=".erag-modal-body"></ng-content>
                    </div>

                    <div class="modal-footer">
                        <ng-content select=".erag-modal-footer"></ng-content>

                        <button type="button" *ngIf="submitBtnLabel" class="btn btn-submit" (click)="onClick()">{{submitBtnLabel}}</button>
                        <button type="button" class="btn btn"
                            *ngIf="dismissable"
                            [ngClass]="{'btn-cancel': cancelBtnLabel==='Cancel'}"
                            (click)="hideModal()">{{cancelBtnLabel}}</button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class EragModalComponent implements OnChanges, AfterViewInit {
    @Input() show = false;
    @Input() size: ModalSize = 'md';
    @Input() customWidth: string;

    @Input() submitBtnLabel: SubmitBtnLabel = '';
    @Input() cancelBtnLabel: CancelBtnLabel = 'Close';

    @Input() backdropClickable = false;  // true : allow user to close modal on click on the backdrop
    @Input() dismissable = true; // false: hide all close btn

    @Input() showLoading =false;

    @Output() submit = new EventEmitter<any>();
    @Output() hide = new EventEmitter<any>();
    @ViewChild(ModalDirective) modalRef: ModalDirective;

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.show) {
            if (this.modalRef) {
                if (changes.show.currentValue) {
                    // this.modalRef.config.ignoreBackdropClick = true;
                    this.modalRef.show();
                } else {
                    this.modalRef.hide();
                }
            }
        }
    }

    ngAfterViewInit() {
        if (this.modalRef) {
            this.modalRef.config.ignoreBackdropClick = !this.backdropClickable;

            this.modalRef.onHidden.subscribe(() => {
                this.hide.emit();
            });
        }
    }

    hideModal() {
        event.stopPropagation();
        this.hide.emit();
    }

    onClick() {
        event.stopPropagation();
        this.submit.emit();
    }
}
