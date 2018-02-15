import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/pluck';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { State } from './state';

const state: State = {
  allTenants: [],
  selectedTenants: [], // list of seleted tenant from dropdown
  currentTenant: undefined,
  ipReportData: undefined,
  ipReportsError: undefined,
  mapControls: undefined,
  notification: undefined,
  ipDetails: undefined,
  selectedTenantUrlData: undefined,  // single
  globalApprovalAllData: [],
  globalActivityData: undefined,
  tenantUserData: [],
  tenantUrlData: [],  // array
  tenantApprovalAllData: [],
  tenantGroupAllData: [],
  tenantGroupEndUserAllData: [],
  currentGroup: undefined,
  tenantAdSyncGroupAllData : [],
  userSessionLogData: []
};

export class Store {

  private subject = new BehaviorSubject<State>(state);
  private store = this.subject.asObservable().distinctUntilChanged();

  get value() {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.store.pluck(name);
  }

  set(name: string, _state: any) {
    this.subject.next({
      ...this.value, [name]: _state
    });
  }

}
