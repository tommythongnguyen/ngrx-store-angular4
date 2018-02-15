import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/skip';

import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { AuthService } from '../../../auth/services/auth.service';
import { MapControl } from '../../../state';
import { Store } from '../../../store';
import { DashboardService } from '../../services/dasboard.service';

export interface MapOptions {
    latitude: number;
    longitude: number;
    zoomLevel: number;
    minZoom: number;
    center: boolean;
    streetViewControl: boolean;
}
export interface Pagination {
    page: number;
    itemsPerPage: number;
}


@Component({
    selector: 'dashboard',
    providers: [DatePipe],
    styleUrls: ['dashboard.component.scss'],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
    isLoading = false; // true => show the loading icon
    // ----ip Reports---------
    showIpReport = false;

    // --- pagination-------
    pageMaxSize = 7;
    itemsPerPage = 2;
    currentPage = 1;
    totalIps = 0;

    // ----- ipDetails--------
    showIpDetailsModal = false;
    ipDetails$: Observable<any>;
    ipDetailsMarker: any;
    currentIpAddress: string;
    totalIpDetails = 0;
    currentIpPage: Pagination = {
        page: 1,
        itemsPerPage: 10
    };
    ipDetailFilterValue = '';
    ipDetailSortValue = '';

    // -----googlemap Option -----
    mapOptions: MapOptions = {
        latitude: Number(localStorage.getItem('lat')) || 0,
        longitude: Number(localStorage.getItem('lng')) || 0,
        zoomLevel: Number(localStorage.getItem('zoomLevel')) || 2,
        minZoom: 2,
        center: true,
        streetViewControl: true
    };

    private _map: any;
    private _mapControls: MapControl;

    private _mapControlsSubscription: Subscription;
    private _reportDataSubscription: Subscription;
    private _ipAddressDataSubscription: Subscription;
    private _ipReportListSubscription: Subscription;

    private _clickCallback: Function;

    ipReportList: any;

    markers$: Observable<any[]>;

    constructor(private dashboardService: DashboardService,
        private store: Store,
        private authService: AuthService,
        private renderer: Renderer2,
        private datePipe: DatePipe,
    ) { }

    ngOnInit() {
        this._mapControlsSubscription = this.store.select('mapControls')
            .filter(Boolean)
            .distinctUntilChanged()
            .subscribe((val: MapControl) => {
                this._mapControls = val;
            });

        const reportData$ = this.store.select('ipReportData')
            .skip(1)
            .filter(Boolean)
            .distinctUntilChanged()
            .map(reports => reports.filter(report => report.latitude))
            .map(this.getIpReportList.bind(this))
            .share();

        // -- get markers from store-----
        this.markers$ = reportData$
            .filter(Boolean)
            .map(this.getMarkerList.bind(this));

        // ---- get ipReportList ---
        this._ipReportListSubscription = reportData$
            .subscribe(reports => {
                this.ipReportList = this.getIpReportPagination(reports);
            });

        // ---- ip details for modal----------
        this.ipDetails$ = this.store.select('ipDetails')
            .filter(Boolean)
            .do(ipDList => this.totalIpDetails = ipDList.length)
            .map(ipDlist => {
                if (this.ipDetailFilterValue) {
                    return this.getFilteredIpDetailsList(ipDlist, this.ipDetailFilterValue);
                }
                return ipDlist;
            })
            .map(this.getIpDetailsPagination.bind(this));

        // register event
        this.registerEventListener();
    }

    registerEventListener() {
        this._clickCallback = this.renderer.listen('document', 'click', () => {
            this.showIpReport = false;
        });
    }

    // --- getIpReportList------
    getIpReportList(reports) {
        this.totalIps = 0;
        const bounds = this._map.getBounds();
        const reportArr = reports.filter((report: any) => {
            return bounds.contains({ lat: report.latitude, lng: report.longitude });
        });

        reportArr.forEach(report => {
            this.totalIps += report.ipaddress.length;
        });
        return reportArr;
    }

    // --- getIpDetailsList -----
    getIpDetailsList(ipDetails) {
        this.totalIps = ipDetails.length;
        return ipDetails;
    }

    // ---- getMarkerList---
    getMarkerList(reports) {
        return reports.map(report => {
            if (report.THDIP_STATE === 1) { // in home deport network and unique THDIP-> blue
                report.iconUrl = '../../../../assets/images/green.png';
            } else if (report.THDIP_STATE === -1) { // mix THDI =>brown
                report.iconUrl = '../../../../assets/images/brown.png';
            } else { // outside home deport network and unique THDIP-> need to check for permission
                if (this._mapControls.radioPermission === 'allow') {
                    report.iconUrl = '../../../../assets/images/blue.png';
                } else if (this._mapControls.radioPermission === 'denied') {
                    report.iconUrl = '../../../../assets/images/red.png';
                } else { // all
                    report.iconUrl = '../../../../assets/images/orange.png';
                }
            }
            report.label = report.ipaddress.length.toString();
            return report;
        });
    }

    // ---  getIpReportPagination----
    getIpReportPagination(reports) {
        const test = reports.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
        return reports;
    }

    // ------google map is ready------
    onMapReady($event) {
        this._map = $event;
    }

    // ----google map currently idle-------
    onMapIdle() {
        // -- change the ipReportData reference  --> trigger the update
        const reportData: any[] = this.store.value.ipReportData;

        this.store.set('ipReportData', Object.assign([], reportData));
    }

    onZoomChange($event: number) {
        localStorage.setItem('zoomLevel', $event.toString());
    }

    onCenterChange($event: { lat: number, lng: number }) {
        if ($event) {
            localStorage.setItem('lat', $event.lat.toString());
            localStorage.setItem('lng', $event.lng.toString());
        }
    }

    onSelectIpAddress($event: { address: any, marker: any }) {
        this.ipDetailsMarker = $event.marker;
        this.currentIpAddress = $event.address.ip;
        this.getIpAddressData(this.currentIpAddress);
    }

    // ----reports ------
    onToggleIpReport() {
        this.showIpReport = !this.showIpReport;
    }

    // -----view Traffice-----
    onViewTraffic() {
        // make ajax call to get google data
        this.getGoogleMapReportsData();
    }

    /**
     * getGoogleMapReportsData:
     *         + get all reportsData for either all tenants or particular tenant
     *         + store the reponsed reportsData into store
     *
    */
    getGoogleMapReportsData() {
        this.isLoading = true;
        // const fromDate = this.datePipe.transform(this._mapControls.fromDate, 'yyyy-MM-dd HH:mm');
        // const toDate = this.datePipe.transform(this._mapControls.toDate, 'yyyy-MM-dd HH:mm');

        const fromDate = this._mapControls.fromDate.toISOString();
        const toDate = this._mapControls.toDate.toISOString();

        const tenantName = this._mapControls.mapTenant ? this._mapControls.mapTenant.name : null;

        this._reportDataSubscription = this.dashboardService
            .getIpReportsData(fromDate, toDate, tenantName, this._mapControls.radioPermission, this._mapControls.radioPort)
            .subscribe(
            next => { },
            err => { },
            () => this.isLoading = false
            );

    }

    getIpAddressData(ip: string) {
        this.isLoading = true;
        this.showIpDetailsModal = true;

        // const fromDate = this.datePipe.transform(this._mapControls.fromDate, 'yyyy-MM-dd HH:mm');
        // const toDate = this.datePipe.transform(this._mapControls.toDate, 'yyyy-MM-dd HH:mm');

        const fromDate = this._mapControls.fromDate.toISOString();
        const toDate = this._mapControls.toDate.toISOString();

        const tenantName = this._mapControls.mapTenant ? this._mapControls.mapTenant.name : null;
        this._ipAddressDataSubscription = this.dashboardService
            .getIpAddressData(fromDate, toDate, tenantName, this._mapControls.radioPermission, this._mapControls.radioPort, ip)
            .subscribe(
            next => { },
            err => { },
            () => this.isLoading = false
            );
    }


    onMarkerClick($event) { }

    /**
     *  + get all ipReportData within current bound
     *  + get all ipReportData for select pagination Page
    */
    onPaginationChange($event: Pagination) {
        const reportsInBound = this.getIpReportList(this.store.value.ipReportData);
        this.currentPage = $event.page;
        this.ipReportList = this.getIpReportPagination(reportsInBound);
    }

    // ------IpDetails Modal------
    onHideModalIpDetails() {
        this.showIpDetailsModal = false;
    }

    /**
     *  get ipDetail of current pagination for Modal
     */
    onIpDetailsPaginationChange($event: Pagination) {
        this.currentIpPage = $event;
        const ipDList = this.store.value.ipDetails;
        this.store.set('ipDetails', Object.assign([], ipDList));
    }

    // ---  getIpDetailsPagination----
    getIpDetailsPagination(ipDList: any[]) {
        return ipDList.slice((this.currentIpPage.page - 1) * this.currentIpPage.itemsPerPage, this.currentIpPage.page * this.currentIpPage.itemsPerPage);
    }
    // ---- getFilteredIpDetailsList ----
    getFilteredIpDetailsList(ipDList: any[], filteredValue): any[] {
        return ipDList.filter(item => {
            for (const prop in item) {
                if (item.hasOwnProperty(prop) && item[prop].toString().toLowerCase().includes(filteredValue.toLowerCase())) {
                    return true;
                }
            }
        });
    }

    // -----  onIpDetailTableSort ------
    onIpDetailTableSort($event: string) {
        this.ipDetailSortValue = $event;
        const ipDList = this.store.value.ipDetails;
        this.store.set('ipDetails', Object.assign([], ipDList));
    }


    // ---------- onIpDetailsInputSearch-------
    onIpDetailsInputSearch($event: string) {
        this.ipDetailFilterValue = $event;
        const ipDList = this.store.value.ipDetails;
        this.store.set('ipDetails', Object.assign([], ipDList));
    }

    ngOnDestroy() {
        if (this._reportDataSubscription) {
            this._reportDataSubscription.unsubscribe();
        }
        if (this._mapControlsSubscription) {
            this._mapControlsSubscription.unsubscribe();
        }
        if (this._ipAddressDataSubscription) {
            this._ipAddressDataSubscription.unsubscribe();
        }
        if (this._ipReportListSubscription) {
            this._ipReportListSubscription.unsubscribe();
        }

        if (this._clickCallback) {
            this._clickCallback();
        }
        // delete the ipReportData when user navigate away or reload the page
        this.store.set('ipReportData', undefined);
    }
}
