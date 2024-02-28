import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { brandingConfig } from 'src/app/branding/branding-config';

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

  @Input() isDropdown:boolean = false;

  @Output() handleSimpleSearch = new EventEmitter<any>();

  isSearchFocused: boolean;

  readonly brandingConfig = brandingConfig;

  constructor() { }

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
