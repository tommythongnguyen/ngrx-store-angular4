import { EragAlertMessageComponent } from './components/erag-alert-message/erag-alert-message.component';
import { EragLoadingDirective } from './components/erag-loading/erag-loading.directive';
import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';
import { EragControlErrorComponent } from './components/erag-control-error/erag-control-error.component';
import { EragTabsComponent } from './components/erag-tabs/erag-tabs.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule, ModalModule, TabsModule, PopoverModule } from 'ngx-bootstrap';
import { PaginationModule, TimepickerModule } from 'ngx-bootstrap/ng2-bootstrap';
import { ToastModule, ToastOptions } from 'ng2-toastr';

import { AutoFocusDirective } from './components/auto-focus/auto-focus.directive';
import { DateTimePickerComponent } from './components/date-time-picker/date-time-picker.component';
import { EradDropdownComponent } from './components/erad-dropdown/erad-dropdown.component';
import { EragButtonComponent } from './components/erag-button/erag-button.component';
import { EragPaginationComponent } from './components/erag-pagination/erag-pagination.component';
import { EragSearchComponent } from './components/erag-search/erag-search.component';
import { FullTextSearchPipe } from './components/full-text-search/full-text-search.pipe';
import { IpReportComponent } from './components/ip-report/ip-report.component';
import { EragModalComponent } from './components/erag-modal/erag-modal.component';
import { EragTableLayoutComponent } from './components/erag-table-layout/erag-table-layout.component';

import { EragToasterComponent } from './components/erag-toaster/erag-toaster.component';

import { EragFileLoaderComponent } from './components/erag-file-upload/erag-file-upload.component';
/* End Import Custom Validators */


const directives = [
    EradDropdownComponent,
    FullTextSearchPipe,
    AutoFocusDirective,
    DateTimePickerComponent,
    IpReportComponent,
    EragTableLayoutComponent,
    EragSearchComponent,
    EragModalComponent,
    EragSearchComponent,
    EragPaginationComponent,
    EragButtonComponent,
    EragTabsComponent,
    EragToasterComponent,
    EragFileLoaderComponent,
    EragControlErrorComponent,
    EragLoadingDirective,
    EragAlertMessageComponent
];

@NgModule({
    declarations: [...directives],
    exports: [...directives],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploadModule,
        ToastModule.forRoot(),
        DatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        PaginationModule.forRoot(),
        TimepickerModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        PopoverModule.forRoot()
    ]
})
export class SharedModule { }
