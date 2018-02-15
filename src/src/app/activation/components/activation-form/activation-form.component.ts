import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { CustomValidators } from '../../../utils/custom-validators/custom-validators';

@Component({
    selector: 'activation-form',
    styleUrls: [`./activation-form.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'activation-form.html'
})

export class ActivationFormComponent implements OnInit {
    activationForm = this.fb.group({
        // password: ['', [Validators.required, Validators.minLength(8), CustomValidators.password]],
        // confirmPassword: ['', [Validators.required, Validators.minLength(8), CustomValidators.password]]
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });

    @Output() submitForm = new EventEmitter<any>();
    constructor(private fb: FormBuilder) { }

    ngOnInit() { }

    resetFormValidations() {
        this.activationForm.controls.confirmPassword.setValidators([
            Validators.required,
            CustomValidators.MatchPassword(this.activationForm.controls.password.value),
            Validators.minLength(8)
            // CustomValidators.password
        ]);
        this.activationForm.updateValueAndValidity();
    }

    submit() {
        this.submitForm.emit(this.activationForm.value);
    }
}
