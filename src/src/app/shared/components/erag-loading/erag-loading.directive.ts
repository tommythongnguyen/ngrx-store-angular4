import { Directive, ElementRef, Renderer2, OnInit, Output, OnDestroy, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
export type Target = 'self' | 'body';
@Directive({
    selector: '[loading]',
})
export class EragLoadingDirective implements OnDestroy, OnChanges {
    loadingMask: HTMLDivElement;
    spinnerIcon: HTMLSpanElement;

    private _maskClickListener: Function;

    @Input() appendTo: Target = 'self';
    @Input() loading = false;
    @Input() spinner = 'show';

    @Output() onBeforeClose: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.loading && !changes.loading.firstChange) {
            if (changes.loading.currentValue) {
                if (this.loadingMask) {
                    this.showLoadingMask();
                } else {
                    this.createLoadingMask();
                    if (this.spinner !== 'hide' && !this.spinnerIcon) {
                        this.createAndAppendSpinner();
                    }
                }
            } else {
                this.hideLoadingMask();
            }
        }
    }
    createAndAppendSpinner() {
        // create spinning icon
        this.spinnerIcon = this._renderer.createElement('span');
        this._renderer.addClass(this.spinnerIcon, 'loading-icon');

        // add loadingSpan to loadingMask
        this._renderer.appendChild(this.loadingMask, this.spinnerIcon);
    }
    createLoadingMask() {
        // create loadingMask
        this.loadingMask = this._renderer.createElement('div');
        this._renderer.addClass(this.loadingMask, 'loading-mask');
        if (this.appendTo === 'body') {
            this._renderer.setStyle(this.loadingMask, 'position', 'fixed');
        }
        // show Loading Mask
        this.showLoadingMask();
        this.registerEventListeners();
    }

    showLoadingMask(): void {
        if (this.appendTo === 'body') {
            this._renderer.appendChild(document.body, this.loadingMask);
        } else {// default append to host element
            // add the relative position to host element
            this._renderer.addClass(this._elementRef.nativeElement, 'hostPosition');

            // append the loadingMask to it host element
            this._renderer.appendChild(this._elementRef.nativeElement, this.loadingMask);
        }
    }

    hideLoadingMask(): void {
        if (this.loadingMask) {
            this._renderer.removeChild(this.loadingMask.parentNode, this.loadingMask);
        }
    }

    registerEventListeners() {
        this._maskClickListener = this._renderer.listen(this.loadingMask, 'click', this.emitEvent.bind(this));
    }
    emitEvent($event: any) {
        this.onBeforeClose.emit({});
    }
    ngOnDestroy() {
        this.hideLoadingMask();
        this.loadingMask = null;
    }
}
