import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
@Component({
    selector: 'erag-table-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['erag-table-layout.component.scss'],
    template: `
        <div class="table-layout-container">
            <div class="col-md-12 table-header-container">
                <div class="padding-zero no-wrap col-md-{{leftHeadColSize}}">
                    <ng-content select=".table-header-left-side"></ng-content>
                </div>
                <div class="padding-zero no-wrap col-md-{{rightHeadColSize}}">
                    <div class="pull-right">
                        <div class="form-inline">
                            <ng-content select=".table-header-right-side"></ng-content>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-12 table-body-container">
                <ng-content select=".table-body"></ng-content>
            </div>

            <div class="col-md-12 table-footer-container">
                <div class="col-md-2 no-wrap">
                    <ng-content select=".table-footer-left-side"></ng-content>
                </div>
                <div class="col-md-10 form-group">
                    <ng-content select=".table-footer-right-side"></ng-content>
                </div>
            </div>
        </div>
    `,
})
export class EragTableLayoutComponent {
    @Input() records: any[];
    @Input() caption: string;
    @Input() leftHeadColSize = 1;
    @Input() rightHeadColSize = 11;
}
