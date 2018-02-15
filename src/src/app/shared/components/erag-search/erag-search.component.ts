import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'erag-search',
  styleUrls: ['erag-search.component.scss'],
  template: `
  <div class="search-container">
    <div class="row">
    <div class="input-group">
      <input class="form-control" style="width:110px" placeholder="Search" [formControl]="searchInput" >
      <div class="input-group-btn">
        <button class="btn btn-default search-button" [disabled]="true">
            <i class="glyphicon glyphicon-search"></i>
        </button>
      </div>
    </div>
    </div>
  </div>
  `
})
export class EragSearchComponent implements OnInit {
  searchInput: FormControl;
  
  @Input() delay = 400; //default

  @Output() search = new EventEmitter<string>();
  
  constructor() { }
  ngOnInit() {
    this.searchInput = new FormControl('');
    this.searchInput.valueChanges
      .debounceTime(this.delay)
      .subscribe(val => this.search.emit(val));
  }
}
