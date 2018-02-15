import { Component, OnInit, Input } from '@angular/core';

export interface Tab {
    title: string;
    context: any;
}

@Component({
    selector: 'erag-tabs',
    styleUrls: ['./erag-tabs.component.scss'],
    template: `
        <tabset [justified]="true">
            <tab heading="Justified">Justified content</tab>
            <tab heading="SJ">Short Labeled Justified content</tab>
            <tab heading="Long Justified">Long Labeled Justified content</tab>
        </tabset>
    ` 
})
export class EragTabsComponent implements OnInit {

    @Input() tabs: Tab[];

    constructor() { }

    ngOnInit() { }
}