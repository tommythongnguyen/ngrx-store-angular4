import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';

interface Wizard {
    label: string;
    step: number;
    customClass?: string;
}
@Component({
    selector: 'step-wizard',
    styleUrls: ['step-wizard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="step-wizard-container">
            <div class="stepwizard-row">
                <div *ngFor = "let item of list; index as i"
                     class="step-{{i}} {{item.customClass}}"
                     [ngClass]="{'hover-step':(allowForward || item.step <= currentStep)}"
                     (click)="onStepClick(item)">

                    <span
                        [ngClass]="{'active':(item.step=== activeStepStep)}">
                            {{item.label}}
                    </span>
                </div>
            </div>
        </div>
    `
})
export class StepWizardComponent {
    activeStepStep = 0;

    @Input() currentStep = 0;
    @Input() list: Wizard[];
    @Input() allowForward = false; // don't allow user to move next step in adding new tenant
    @Input() set moveToStep(next: number) {
        if ((next >= 0) && (next < this.list.length)) {
            this.activeStepStep = next;
        }
    }

    @Output() seleted = new EventEmitter<Wizard>();

    constructor() { }

    /**
     * Only allow to move forward if `allowForward === true`
     */
    public onStepClick(move: Wizard) {
        if (this.allowForward) {
            this.activeStepStep = move.step;
            this.seleted.emit(move);
        } else {
            if (move.step <= this.currentStep) { // allow to move to completed step only
                this.activeStepStep = move.step;
                this.seleted.emit(move);
            }
        }
    }
}
