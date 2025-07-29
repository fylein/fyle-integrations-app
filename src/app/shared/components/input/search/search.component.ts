import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: false
})
export class SearchComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() placeholder: string;

  @Input() styleClasses: string = '';

  @Input() formControllerName: string = 'searchOption';

  @Input() isDropdown:boolean = false;

  @Input() width: string = '';

  @Input() height: string = '';

  @Output() handleSimpleSearch = new EventEmitter<any>();

  @Output() searchFocused = new EventEmitter<boolean>();

  isSearchFocused: boolean;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  @ViewChild('search') search: any;

  constructor() { }

  clearSearch(): void {
    this.form.controls.searchOption.setValue('');
  }

  onSearch(): void {
    this.isSearchFocused = true;
    this.search.nativeElement.focus();
  }

  onBlur(): void {
    if (!this.form.get(this.formControllerName)?.value) {
      this.isSearchFocused = false;
    }
    this.searchFocused.emit(false);
  }

  onFocus(): void {
    this.isSearchFocused = true;
    this.searchFocused.emit(this.isSearchFocused);
  }

  private searchQueryWatcher(): void {
    this.form.controls.searchOption.valueChanges.subscribe((value) => {
      this.handleSimpleSearch.emit((value as string).trim());
    });
  }

  ngOnInit(): void {
    this.searchQueryWatcher();
  }

}
