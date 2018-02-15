import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'ip-details-table',
    styleUrls: ['ip-details-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<div class="ipDetail-Container">
                    <div>
                        <div class="ipDetail-left-container">
                            <span><b>Region:</b> {{marker?.region_name}}</span>
                            <span><b>City:</b> {{marker?.city}}</span>
                            <span><b>Country:</b> {{marker?.country_name}}</span>
                        </div>

                        <ng-content select=".input-search"></ng-content>

                    </div>
                    <div class="ipDetail-table-container">
                        <table class="table table-striped" id='ipDisplay'>
                            <thead>
                                <tr>
                                    <th (click)="onSort('code')">Code<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('port')">Requested Port<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('server_port')">Server Port<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('remote')">Remote<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('host')">Host<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('user')">User<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('erag_cookie')">Erag Cookie<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('method')">Method<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('path')">Path<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('time')">Time<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('time_millis')">Time Millis<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('http_x_forwarded_for')">HTTP X Forward For<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('server_name')">Server Name<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('server_addr')">Server Address<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('ssl_verify_client')">SSL Verify Client<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('ssl_client_s_dn')">SSL Client S DN<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('agent')">Agent<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('referer')">Referer<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                    <th (click)="onSort('size')">Size<i class="glyphicon glyphicon-triangle-bottom"></i></th>
                                </tr>
                            </thead>
                            <tr *ngFor="let ipDetail of ipDetails">
                                <td>{{ipDetail.code}}</td>
                                <td>{{ipDetail.port}}</td>
                                <td>{{ipDetail.server_port}}</td>
                                <td>{{ipDetail.remote}}</td>
                                <td>{{ipDetail.host}}</td>
                                <td>{{ipDetail.user}}</td>
                                <td class="table-content">{{ipDetail.erag_cookie}}</td>
                                <td>{{ipDetail.method}}</td>
                                <td class="table-content">{{ipDetail.path}}</td>
                                <td>{{ipDetail.time | date:'yyyy-MM-dd HH:mm:ss' : 'UTC'}} UTC</td>
                                <td class="table-content">{{ipDetail.time_millis}}</td>
                                <td class="table-content">{{ipDetail.http_x_forwarded_for}}</td>
                                <td class="table-content">{{ipDetail.server_name}}</td>
                                <td>{{ipDetail.server_addr}}</td>
                                <td class="table-content">{{ipDetail.ssl_verify_client}}</td>
                                <td class="table-content">{{ipDetail.ssl_client_s_dn}}</td>
                                <td class="table-content">{{ipDetail.agent}}</td>
                                <td class="table-content">{{ipDetail.referer}}</td>
                                <td>{{ipDetail.size}}</td>
                            </tr>
                        </table>
                    </div>

                     <ng-content></ng-content>
                </div>`
})

export class IPDetailTableComponent implements OnInit {
    @Input() ipDetails: any;
    @Input() marker: any;

    @Output() sort = new EventEmitter<string>();
    // --- pagination-------
    pageMaxSize = 3;
    itemsPerPage = 10;
    currentPage = 1;
    totalIps = 100;

    constructor() { }

    ngOnInit() { }

    onSort($event: string) {
        this.sort.emit($event);
    }
}
