import { Observable, Subscription } from 'rxjs/Rx';
import {
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    ElementRef,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { Toast, ToastContainer, ToastOptions, ToastsManager } from 'ng2-toastr';

type Action = 'error' | 'info' | 'success' | 'warning' | 'custom';
type ToastPosition =
    'toast-top-right'
    | 'toast-top-center'
    | 'toast-bottom-left'
    | 'toast-bottom-center'
    | 'toast- bottom - right'
    | 'toast-bottom-left'
    | 'toast-middle-center';

type Dismiss = 'auto' | 'click' | 'controlled';

export type ConfigType = 'errorDismissable' | 'error' | 'success';

export interface ToastFullOptions {
    positionClass?: ToastPosition;   // default = 'toast-top-right';
    maxShown?: number;               // default = 5;
    newestOnTop?: boolean;           // default = false;
    animate?: string;                // default = 'fade';
    toastLife?: number;              // default = 5000;
    enableHTML?: boolean;             // default = false;
    dismiss?: Dismiss;                // default 'auto' | 'click' | 'controlled'
    messageClass?: string;             // default = 'toast-message';
    titleClass?: string;                // default = 'toast-title';
    showCloseButton?: boolean;          // default = false;
}
export const DefaultOptions: ToastFullOptions = {
    animate: 'fade',
    newestOnTop : false,
    positionClass: 'toast-top-right',
    dismiss: 'auto',
    toastLife : 3000
};

export const ErrorDismissOption: ToastFullOptions = { // type =2
    positionClass: 'toast-top-center',
    showCloseButton: true,
    toastLife: 5000
};
export const ErrorOption: ToastFullOptions = { // type =2
    positionClass: 'toast-top-center',
    toastLife: 5000
};

export const SuccessOption: ToastFullOptions = { // type =1
    positionClass: 'toast-top-center',
    toastLife: 1000
};

export interface ToastConfig {
    configType?: ConfigType;
    title?: string;
    message: string;
    action: string;
}

@Component({
    selector: 'erag-toaster',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['erag-toaster.component.scss'],
    template: `<div #container></div>`
})

export class EragToasterComponent implements OnChanges, AfterContentInit, OnDestroy{
    private toastContainerRef: ComponentRef<ToastContainer>;

    private _toast: Toast;
    private _toastSubscription: Subscription;
    private _toastTimerId: any;

    @ViewChild('container', { read: ViewContainerRef }) vcr: ViewContainerRef;

    @Input() show = false;
    @Input() config: ToastConfig;
    constructor(
        private toastConfig: ToastOptions,
        private toastr: ToastsManager,
        private injector: Injector,
        private componentFactoryResolver: ComponentFactoryResolver) {
        Object.assign(this.toastConfig, DefaultOptions);
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.config && !changes.config.firstChange && changes.config.currentValue) {
            const type = changes.config.currentValue.configType;
            if (type) {
                if (type === 'errorDismissable') {
                    Object.assign(this.toastConfig, ErrorDismissOption);
                } else if (type === 'error') {
                    Object.assign(this.toastConfig, ErrorOption);
                } else if (type === 'success') {
                    Object.assign(this.toastConfig, SuccessOption);
                }
            }
        }
        if (changes.show && !!changes.show.currentValue) {
            this._toastSubscription = this.showToaster()
                .subscribe(val => {
                    this._toast = val;
                    this._toastTimerId = setTimeout(() => {
                        if (this.toastConfig.dismiss === 'auto') {
                            this.toastr.dispose();
                        }
                    }, 1000);
            });
        }else {
                if (this._toast) {
                    this.toastr.dispose();
                }
        }
    }

    ngAfterContentInit() {
        this.toastr.setRootViewContainerRef(this.vcr);
    }

    showToaster(): Observable<Toast> {
        switch (this.config.action) {
            case 'error':
                return Observable.fromPromise( this.toastr.error(this.config.message || '', this.config.title || ''));
            case 'info':
                return Observable.fromPromise(this.toastr.info(this.config.message || '', this.config.title || ''));
            case 'success':
                return Observable.fromPromise(this.toastr.success(this.config.message || '', this.config.title || ''));
            case 'warning':
                return Observable.fromPromise(this.toastr.warning(this.config.message || '', this.config.title || ''));
            case 'custom':
                return Observable.fromPromise(this.toastr.custom(this.config.message || '', this.config.title || ''));
        }
    }

    ngOnDestroy() {
        if (this._toastSubscription) {
            this._toastSubscription.unsubscribe();
        }
        if (this._toastTimerId) {
            clearTimeout(this._toastTimerId);
        }
        if (this.toastr) {
            this.toastr.dispose();
        }
    }

}
