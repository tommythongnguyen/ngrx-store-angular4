import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'marker-info-window',
    styleUrls:['marker-info-window.component.scss'],
    template: `
       <ul class="report-container">
            <li class="data-row">
                <span class="label">City</span>
                <span class="info">{{report.city}}</span>
            </li>
            <li class="data-row">
                <span class="label">Region</span>
                <span class="info">{{report.region_name}}</span>
            </li>
            <li class="data-row">
                <span class="label">Country</span>
                <span class="info">{{report.country_name}}</span>
            </li>
            <li class="data-row">
                <span class="label">Location</span>
                <span class="info">{{report.latitude}}, {{report.longitude}}</span>
            </li>
            <li class="data-row">
                <span class="label">Zipcode</span>
                <span class="info">{{report.zip_code}}</span>
            </li>
            <li class="data-row">
                <ul class="ip-count">
                    <li>
                        <span class="ip">IP</span>
                        <span class="count-label">Count</span>
                    </li>
                    <li *ngFor="let address of report.ipaddress">
                        <span class="ip-address" [ngClass]="{'ip-address-true': address.THDIP}"  (click)="onClickIpAddress(address)">{{address.ip}}</span>
                        <span class="count-value">{{address.count}}</span>                        
                    </li>
                </ul>
            </li>
       </ul>
    `
})
export class MarkerInfoWindowComponent implements OnInit {
    @Input() report: any;
    @Output() select = new EventEmitter<any>();

    constructor() { }

    ngOnInit() { }

    onClickIpAddress(address):boolean{
        this.select.emit(address);
        return false;
    }
}