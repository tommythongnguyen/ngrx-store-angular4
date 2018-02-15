import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface IDate {
    name: string;
    value: string;
}
@Component({
    selector: 'date-nav',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['date-nav.component.scss'],
    template: `
        <ul>
            <li *ngFor="let item of list"
                [ngClass]="{'disable': disable, 'active': activeItem === item}"
                (click)="selectDate(item)">

                {{item.name}}
            </li>
        </ul>
    `
})
export class DateNavComponent implements OnInit {
    @Input() activeItem: IDate | null;
    @Input()disable = false;
    @Input() list: IDate[];

    @Output() select = new EventEmitter<IDate>();
    constructor() { }

    ngOnInit() { }
    selectDate(item: IDate) {
        this.activeItem = item;
        this.select.emit(item);
    }
}
