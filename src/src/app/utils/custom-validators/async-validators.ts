import { AbstractControl } from '@angular/forms';
import {AsyncValidatorService} from '../services/async.service';

export class AsyncValidators {
    // Database duplicate check validation
    static asyncValidator(asyncValidatorService: AsyncValidatorService, type, checkNotExist: boolean = true, excludeid: string = null) {
    return (control: AbstractControl) => {
      return asyncValidatorService.checkAsyncValidation(type, control.value, excludeid).map(res => {
          if (checkNotExist) {
            return (res.data === 'Not Exist') ? null : { dbduplicate: true };
          } else {
            return (res.data === 'Exist') ? null : { notexist: true };
          }
      });
    };
  }

  // Database duplicate check validation for url
    static duplicateDBURL(asyncValidatorService: AsyncValidatorService, type, tenantID , excludeid: string = null) {
    return (control: AbstractControl) => {
      return asyncValidatorService.checkURLDBDuplicate(type, control.value, tenantID, excludeid).map(res => {
            return (res.data === 'Not Exist') ? null : { dbduplicate: true };
      });
    };
  }
}
