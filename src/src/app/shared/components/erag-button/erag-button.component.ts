import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'erag-button',
    styleUrls: ['erag-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="erag-button-container">
            <div>
                <i class="fa {{icon}}"></i>
                <button type="button" class="btn btn-add" (click)="onClick($event)">
                    {{label}}
                </button>
            </div>
        </div>
    `
})

export class EragButtonComponent {

    @Input() label = '';
    @Input() icon = 'fa-plus';

    @Output() click = new EventEmitter<any>();
    constructor() { }
    onClick($event: Event) {
        $event.stopPropagation();
        this.click.emit();
    }

}
