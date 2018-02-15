
import { AgmInfoWindow, AgmMap, LatLngLiteral } from '@agm/core';

import {
    ControlPosition,
    MapTypeControlOptions,
    StreetViewControlOptions,
    ZoomControlOptions,
} from '@agm/core/services/google-maps-types';

import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';

interface Marker {
    latitude: number;
    longitude: number;
    iconUrl?: string;
    label?: string;
}
@Component({
    selector: 'google-map',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['google-map.component.scss'],
    template: `
        <agm-map    [latitude]="mapOptions.latitude"
                    [longitude]="mapOptions.longitude"
                    [usePanning] ="mapOptions.center"
                    [zoom]="mapOptions.zoomLevel"
                    [minZoom]="mapOptions.minZoom"
                    [streetViewControl]="mapOptions.streetViewControl"
                    [streetViewControlOptions]="streetControlOptions"
                    [zoomControlOptions]="zoomControlOptions"
                    mapTypeControl="true"
                    [mapTypeControlOptions]="mapTypeControlOptions"
                    (mapReady)="onMapReady($event)">

            <ng-container *ngFor="let marker of markers; index as i; trackBy: trackByFn">
                <agm-marker [latitude]="marker?.latitude"
                            [longitude]="marker?.longitude"
                            [iconUrl] ="marker?.iconUrl"
                            [label]="marker?.label"
                            [openInfoWindow] ="true"
                            (markerClick)="onMarkerClick(marker)">

                            <agm-info-window [disableAutoPan]="true">
                                 <marker-info-window [report]="marker"
                                                     (select)="onSelectIp($event, marker)">
                                 </marker-info-window>
                            </agm-info-window>
                </agm-marker>
            </ng-container>
        </agm-map>
    `,
})
export class GoogleMapComponent implements OnInit {
    @Input() markers: Marker[];

    @Input() mapOptions: any;

    @ViewChild(AgmMap) googleMap: AgmMap;
    @ViewChildren(AgmInfoWindow) infoWindows: QueryList<AgmInfoWindow>;

    streetControlOptions: StreetViewControlOptions = {
        position: ControlPosition.LEFT_CENTER
    };
    zoomControlOptions: ZoomControlOptions = {
        position: ControlPosition.LEFT_CENTER
    };
    mapTypeControlOptions: MapTypeControlOptions = {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
    }

    @Output() ready = new EventEmitter<any>();
    @Output() markerClick = new EventEmitter<Marker>();
    @Output() idle = new EventEmitter<any>();
    @Output() zoomChange = new EventEmitter<number>();
    @Output() centerChange = new EventEmitter<LatLngLiteral>();

    @Output() selectIp = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
        this.registerEventListeners();
    }
    onMapReady($event) {
        this.ready.emit($event);
    }

    trackByFn(index: number, item: any): number {
        return index;
    }

    onMarkerClick(marker: Marker): boolean {
        this.markerClick.emit(marker);
        return false;
    }

    registerEventListeners() {
        // ------click event---------
        this.googleMap.mapClick.subscribe(() => {
            this.closeAllMarkerInfoWindow();
        });

        // ----- zoom change event--------
        this.googleMap.zoomChange.subscribe(($event: number) => {
            this.closeAllMarkerInfoWindow();
            this.zoomChange.emit($event);
        });
        // ----- zoom change event--------
        this.googleMap.centerChange.subscribe(($event: LatLngLiteral) => {
            // this.closeAllMarkerInfoWindow();
            this.centerChange.emit($event);
        });

        // ------idle event: which is fire after panning/dragging or zooming
        this.googleMap.idle.subscribe(() => {
            this.idle.emit();
        });
    }

    closeAllMarkerInfoWindow() {
        if (this.infoWindows) {
            this.infoWindows.forEach(item => {
                item.close();
            });
        }
    }

    // -----select ip from markerInfoWindow popup----
    onSelectIp(address, marker) {
        this.selectIp.emit({ address: address, marker: marker });
    }

}
