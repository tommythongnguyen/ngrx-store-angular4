import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'enduser',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'end-user.component.html',
})
export class EndUserComponent {
    @Input()
    public enduserForm: FormGroup;
}
