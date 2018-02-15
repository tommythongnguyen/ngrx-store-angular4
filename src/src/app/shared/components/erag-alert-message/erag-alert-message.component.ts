import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
type Action = 'success' | 'info' | 'warning' | 'danger';
@Component({
    selector: 'erag-alert-message',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="alert alert-{{action}}" role="alert" *ngIf="show">
            <button type="button" class="close" aria-label="Close"
                    *ngIf="dismissable"
                    (click)="onClick()">
                <span aria-hidden="true">&times;</span>
            </button>
            <ng-content></ng-content>
        </div>
    `
})
export class EragAlertMessageComponent {
    @Input() show = false;
    @Input() dismissable = false;
    @Input() action: Action = 'danger';

    @Output() close = new EventEmitter<any>();

    onClick() {
        event.stopPropagation();
        this.close.emit();
    }
}
