import { ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { TimepickerConfig } from 'ngx-bootstrap/ng2-bootstrap';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

export class CustomTimePickerConfig {
    showMeridian: false;
}
@Component({
    selector: 'date-time-picker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['date-time-picker.component.scss'],
   // providers:[{ provide: TimepickerConfig, useClass: CustomTimePickerConfig}],
    template: `
        <div class="btn-group {{direction}} container" [ngStyle]="{'width': width, 'height': height}" #container>

            <div class="btn btn-default btn-block date-time-picker-input" (click)="toggleCalendar($event)">
                    <ng-container *ngIf="!!initDate">
                        <span>{{initDate | date: 'MM/dd/yyyy HH:mm'}}</span>
                    </ng-container>
                    <ng-container *ngIf="!initDate">
                        <span class="myClass">{{placeholder}}</span>
                    </ng-container>

                    <span class="calender-icon"><i class="fa fa-calendar pull-right" aria-hidden="true"></i></span>
            </div>

            <div class="dropdown-menu date-time-picker-dropdown" [ngClass]="{'visible': show}">

                <div [ngClass]="{'hidden':!isShowingDatePicker}">
                    <datepicker [ngModel]="initDate"
                                [minDate]="minDate"
                                [maxDate]="maxDate"
                                [showWeeks]="true"
                                [dateDisabled]="dateDisabled"
                                (activeDateChange)="onMonthYearChange($event)"
                                (selectionDone)="onDaySelectionDone($event)">
                    </datepicker>
                </div>

                <div class="timepicker-container" [ngClass]="{'hidden':isShowingDatePicker}">
                    <timepicker [ngModel] ="initDate"
                                [showMeridian]="showMeridian"
                                (ngModelChange)="onChangeTime($event)">
                    </timepicker>
                </div>

                <div class ="btn-control-group text-center">
                    <button type="button" class="btn btn-default btn-sm" (click)="selectNow()">Now</button>
                    <button type="button" class="btn btn-default btn-sm" (click)="toggleDateTime()" [ngClass]="{'hidden':isShowingDatePicker}">Date</button>
                    <button type="button" class="btn btn-default btn-sm" (click)="toggleDateTime()" [ngClass]="{'hidden':!isShowingDatePicker}">Time</button>
                    <button type="button" class="btn btn-default btn-sm" (click)="close()">Close</button>
                </div>
            </div>
        </div>
    `
})
export class DateTimePickerComponent implements OnInit, OnChanges, OnDestroy {
    isShowingDatePicker = true;

    // public currentTime: Date = new Date();
    public showMeridian = false;

    public dateDisabled: { date: Date, mode: string }[];

    private _clickCallback: Function;

    @Input()placeholder = 'Pick date';
    @Input() initDate: Date | null;
    @Input() minDate: Date | null = void 0;
    @Input() maxDate: Date | null;

    @Input() direction = 'dropup';
    @Input() width = '172px';
    @Input() height = '34px';
    @Input()show = false; // true: show calendar
    // @Input() dateValue: string = '08/15/2017 15:34'
    @Output()toggle = new EventEmitter<any>();
    @Output()selected = new EventEmitter<Date>();

    @ViewChild('container') container: ElementRef;
    constructor( private renderer: Renderer2) { }


    ngOnInit() {
        this._clickCallback = this.renderer.listen(this.container.nativeElement, 'click', ($event) => {
            $event.stopPropagation();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.show && changes.show.currentValue) {
            this.isShowingDatePicker = true;
        }
    }

    toggleCalendar($event: Event) {
        $event.stopPropagation();
        this.toggle.emit();
    }

    selectNow() {
        this.initDate = new Date();
        this.emitEvent();
    }
    toggleDateTime() {
        this.isShowingDatePicker = !this.isShowingDatePicker;
    }
    close() {
        this.emitEvent();
    }

    onMonthYearChange($event) {}

    onDaySelectionDone($event) {
        if (!this.checkEqual($event, this.initDate)) {
            this.initDate = $event;
        }
        this.isShowingDatePicker = false;
    }

    checkEqual(newDate: Date, oldDate: Date): boolean {
        if (!!oldDate) {
           return newDate.toDateString().substring(0, 15) === oldDate.toDateString().substring(0, 15);
        }
        return false;
    }

    clear() {
        this.initDate = void 0;
    }

    onChangeTime($event) {
        if (!this.isShowingDatePicker) {
            this.initDate = $event;
        }
    }

    emitEvent() {
        this.selected.emit(this.initDate);
    }

    ngOnDestroy() {
        if (this._clickCallback) {
            this._clickCallback();
        }
    }
}
