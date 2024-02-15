import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() placeholder: string;

  @Input() styleClasses: string = '';

  @Input() formControllerName: string = 'searchOption';

  @Output() handleSimpleSearch = new EventEmitter<any>();

  isSearchFocused: boolean;

  constructor() { }

  searchIconStyle() {
    return this.isSearchFocused ? '!tw-text-search-focused-search-icon !tw-pr-8-px' : '!tw-text-icon-muted !tw-pr-8-px';
  }

  clearSearch(): void {
    this.form.controls.searchOption.setValue('');
  }

  private searchQueryWatcher(): void {
    this.form.controls.searchOption.valueChanges.subscribe((value) => {
      this.handleSimpleSearch.emit(value);
    });
  }

  ngOnInit(): void {
    this.searchQueryWatcher();
  }

}
