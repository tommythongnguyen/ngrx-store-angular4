import { FormControl } from '@angular/forms';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';

@Component({
    selector: 'permission-control-radios',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['permission-control-radios.component.scss'],
    template: `
    
        <div class="btn-group">
            <label class="btn btn-allow" [ngClass]="{'allowed-active': radioValue ==='allow'}">
                <input type="radio" hidden value="allow" name="ipPermission" 
                        [ngModel] = "radioValue" 
                        (change)="onRadioChange($event)">Allowed
            </label>
            <label class="btn btn-denied" [ngClass]="{'denied-active': radioValue ==='denied'}">
                <input type="radio" hidden value="denied" name="ipPermission" 
                        [ngModel] = "radioValue" 
                        (change)="onRadioChange($event)">Denied
            </label>
            <label class="btn btn-all" [ngClass]="{'all-active': radioValue ==='all'}">
                <input type="radio" hidden value="all" name="ipPermission" 
                        [ngModel] = "radioValue" 
                        (change)="onRadioChange($event)">All
            </label>
        </div>

    `
})
export class PermissionControlRadiosComponent {
    @Input()radioValue ='all';
    @Output() change = new EventEmitter<string>();

    onRadioChange($event){
        $event.stopPropagation();
        this.change.emit($event.target.value);
    }
   
}