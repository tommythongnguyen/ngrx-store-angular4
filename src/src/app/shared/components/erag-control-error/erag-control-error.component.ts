import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Component, Host, Input, OnInit, Optional } from '@angular/core';
const ERROR_LIST = {
        required: 'is required',
        minlength: 'is too short',
        maxlength: 'is too long'
};
@Component({
    selector: 'control-error',
    styleUrls: ['erag-control-error.component.scss'],
    template: `
        <p class="error-style-{{errorStyle}}" *ngIf="error">{{error}}</p>
    `,
})
export class EragControlErrorComponent {
    private _errorList = ERROR_LIST;

    @Input() parent: FormGroup;
    @Input() control: string | AbstractControl;
    @Input() label: string;
    @Input() errorStyle = 1;
    @Input() set errors(obj: Object) {
        if (obj) {
            this._errorList = Object.assign(ERROR_LIST, obj);
        }
    }
    get errors(): Object{
        return this._errorList;
    }

    get error(): string {
        let control: AbstractControl;
        if (typeof this.control === 'string') {
            control = this.parent.controls[this.control];
        }else {
            control = this.control;
        }
        let errorMessage = '';
        if (control && control.dirty) {
            if (control.errors) {
                Object.keys(this._errorList).some(err => {
                    if (control.hasError(err)) {
                        const label = this.label || this.control;
                        errorMessage = label + ' ' + this.errors[err];
                        return true;
                    }
                });
                return errorMessage;
            } else {
                return;
            }
        }
    }
}
