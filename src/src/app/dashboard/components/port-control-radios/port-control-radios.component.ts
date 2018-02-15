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
    selector: 'port-control-radios',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['port-control-radios.component.scss'],
    template: `
        
        <div class="btn-group port-container">
            <div class="radio radio-all-port radio-info" (click)="onClick()">
                <input type="radio" value="allPorts" id="inlineRadio1" name="ipControl" 
                        [ngModel] = "radioValue" 
                        (change)="onRadioChange($event)">

                <label for="inlineRadio1">All Ports</label>
            </div> 

            <div class="radio radio--443-port radio-info"(click)="onClick()">
                <input type="radio" value="443" name="ipControl" 
                        [ngModel] = "radioValue" 
                        (change)="onRadioChange($event)" id="inlineRadio2">
                <label for="inlineRadio2">443 Port</label>
            </div>
            
        </div>

    `
})
export class PortControlRadiosComponent {
    @Input()radioValue ='allPorts';
    @Output() change = new EventEmitter<string>();

    onRadioChange($event){
        $event.stopPropagation();
        this.change.emit($event.target.value);
    }

    onClick(){}
   
}