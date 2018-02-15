import { AfterContentInit, Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[auto-focus]',
})
export class AutoFocusDirective implements AfterContentInit {
    constructor(private target: ElementRef){}

    ngAfterContentInit() {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        this.target.nativeElement.focus();
    }
}