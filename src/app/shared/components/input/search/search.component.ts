import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
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

  @Input() width: string = '';

  @Input() height: string = '';

  @Output() handleSimpleSearch = new EventEmitter<any>();

  isSearchFocused: boolean;

  readonly brandingConfig = brandingConfig;

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
    if (!this.form.value[this.formControllerName]) {
      this.isSearchFocused = false;
    }
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
