import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface Address{
    ip: string;
    count: number;
    THDIP: boolean
}
export interface Report{
    THDIP_STATE: number;
    city: string;
    country_name: string;
    ipaddress: Address[];
}

@Component({
    selector: 'ip-report',
    styleUrls: ['ip-report.component.scss'],
    template: `
        <div class="ip-slider">
            <div class="col-lg-12 slider-toggle" (click)="toggleReport($event)">
                <i class="fa fa-angle-down"></i>
            </div>
            <div class="col-sm-12 map-table" [ngClass]="{'hidden': !show}">
                <table class="table table-fixed">
                    <thead>
                        <tr>
                            <th class="title">{{title}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let report of reportList; index as i;  trackBy: trackByFn">
                            <td class="report-block" *ngFor="let address of report?.ipaddress; trackByFn">
                                <h4 class="ip">
                                    <a (click)="onClick(address)" [ngClass]="{'thdip':report.THDIP}">{{address.ip}}</a>
                                </h4>
                                <p class="location">City : {{report.city}} <br>
                                                    Country : {{report.country_name}} <br>
                                                    Count: {{address.count}}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <ng-content></ng-content>
                
                <div class="report-footer">
                    <span   class="view-all"
                            *ngIf="checkNumIp"
                            (click)="onClickViewAll()">
                        View All...
                    </span>
                </div>
            </div>
        </div>
    `
})
export class IpReportComponent implements OnInit {

    @Input() reportList: Report[];
    @Input() show = false;
    @Input() title ='IP Reports';
    
    @Output() toggle = new EventEmitter<any>();
    @Output() select = new EventEmitter<Address>();
    @Output() viewAll = new EventEmitter<any>();

    constructor() { }

    ngOnInit() { 
    }

    trackByFn( index, report){
        return index;
    }
    toggleReport($event: Event){
        $event.stopPropagation();
        this.toggle.emit();
    }
    onClick(address: Address){
        this.select.emit(address);
    }
    onClickViewAll(){
        this.viewAll.emit();
    }

    get checkNumIp():boolean{
        if(this.reportList){
            let count=0;
            for(let report of this.reportList){
               if(count >1) return true;
               count += report.ipaddress.length;
            }
        }
        return false;
    }
}