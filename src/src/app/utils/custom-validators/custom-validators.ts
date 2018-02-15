import { AbstractControl } from '@angular/forms';

export class CustomValidators {
    // Password confirm password validation
    static MatchPassword(password: string) {
        return ((AC: AbstractControl) => {
            const confirmPassword = AC.value; // to get value in input tag
            return (password !== confirmPassword) ? ({ mismatch: true }) : null;
        });
    }

    // Alpha validaations
    static Alpha(AC: AbstractControl) {
        const value = AC.value; // to get value in input tag
        const pattern = /^[a-zA-Z]*$/g;
        return (value && !value.match(pattern)) ? ({ alpha: true }) : null;
    }

    // Domain validaations
    static domain(AC: AbstractControl) {
        const value = AC.value; // to get value in input tag

        const pattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/gm;

        return (value && !value.match(pattern)) ? ({ domain: true }) : null;
    }

    // AlphaNumeric validaations
    static alphaNumeric(AC: AbstractControl) {
        const value = AC.value; // to get value in input tag
        const pattern = /^[a-zA-Z0-9\s]*$/g;
        return (value && !value.match(pattern)) ? ({ alphanumeric: true }) : null;
    }

    // CustomEmail validaations
    static customEmail(AC: AbstractControl) {
        const value = AC.value; // to get value in input tag
       //  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi;
        const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (value && !value.match(pattern)) ? ({ customEmail: true }) : null;
    }

    // DomainMatch validaations
    static domainMismatch(domainmatch: string) {
        return ((AC: AbstractControl) => {
            const value = AC.value; // to get value in input tag

            return (domainmatch && value && value.indexOf(domainmatch) === -1) ? ({ domainMismatch: true }) : null;
        });
    }

    // Duplicate validaations
    static duplicate(excludeItems: Array<string>) {
        return ((AC: AbstractControl) => {

            const value = AC.value; // to get value in input tag

            if (value && excludeItems.length > 0) {
                for (let i = 0; i < excludeItems.length; i++) {
                    if (excludeItems[i] && value.toUpperCase() === excludeItems[i].toUpperCase()) {
                        return { duplicate: true };
                    }
                }
            }
            return null;
        });
    }

    // Input Url validate
    static includeUrlKeys(keys: Array<string>) {
        return ((AC: AbstractControl) => {

            const value = AC.value; // to get value in input tag
            if (value && keys.length > 0) {
                // get http or https from keys
                const protocol = keys[0];
                const domain = keys[1];
                if (protocol) {
                    const inputProtocols = value.split(protocol);
                    if (inputProtocols.length > 2) {
                        return { multiProtocol: true };
                    } else if (inputProtocols.length < 2) {
                        return { protocol: true };
                    }
                }
                if (domain) {
                    const inputDomains = value.split(domain);
                    if (inputDomains.length > 2) {
                        return { multiDomain: true };
                    } else if (inputDomains.length < 2) {
                        return { domainRequired: true };
                    }
                }
            }
            return null;
        });
    }

    static DnaIpAddress(AC: AbstractControl) {
        const value = AC.value;
        const firstAlphabetPattern = /^[a-zA-Z]/;
        const firstNumberPattern = /^[1-9]/;
        const ipPattern = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
        const dnaPattern = /[^a-zA-Z0-9._-]/;
        if (firstAlphabetPattern.test(value)) { // start with alphabet
            if (dnaPattern.test(value)) {
                return { invalidDna: true };
            }
            return null;
        } else if (firstNumberPattern.test(value)) { // start with digi
            if (!value.match(ipPattern)) { // not mat ip address
                return { mismatched: true };
            }
            // check if they are more than x.x.x.x
            if (value.split('.').length > 4) {
                return { mismatched: true };
            }
            return null;
        }
        return { invalidDnaAndIp: true };
    }

    static ipAddress(AC: AbstractControl) {
        const value = AC.value;

        const ipPattern = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
        if (value) {
            if (!value.match(ipPattern)) { // not mat ip address
                return { mismatched: true };
            }
            // check if they are more than x.x.x.x
            if (value.split('.').length > 4) {
                return { mismatched: true };
            }
        }
        return null;
    }
    static UrlValidation(AC: AbstractControl) {
        const value = AC.value; // to get value in input tag
        const pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[0-9a-zA-Z_\-]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        return (value && !value.match(pattern)) ? ({ isValid: true }) : null;
    }

    static CheckBoxRequired(values: any) {
        return ((AC: AbstractControl) => {
            let valid = false;
            Object.keys(values).forEach(key => {
                if (values[key] === true) {
                    valid = true;
                }
            });
            if (valid === false) {
                console.log('return false');
                return { checkrequired: true };
            }
            return null;
        });
    }

    static checkLimitValue(value: number) {
        return ((control: AbstractControl) => {
            if (isNaN(control.value)) {
                return { nan: true };
            }
            if (Number(control.value) < 1) {
                return { negative: true };
            }
            if (Number(control.value) > value) {
                return { outOfLimit: true };
            }
            return null;
        });
    }

    // Password Validations
    static password(AC: AbstractControl) {
        const value = AC.value; // to get value in input tag
        const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
        return (value && !value.match(pattern)) ? ({ invalid: true }) : null;
    }

    // --- not allow charactor
    static whiteSpaceCheck(control: AbstractControl) {
        const pattern = /^$|\s+/;
        const value = control.value;
        if (control.value && pattern.test(value)) {
            return  { notAllow: true };
        }
        return null;
    }

    // ----- not allow empty space
    static emptySpaceCheck(control: AbstractControl) {
        const pattern = /^\s+$/;

        const value = control.value;
        if (control.value && pattern.test(value)) {
            return { emptySpace: true };
        }
        return null;
    }
}
