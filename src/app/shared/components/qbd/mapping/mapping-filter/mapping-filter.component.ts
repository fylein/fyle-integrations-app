import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { FilterOptions } from 'src/app/core/models/enum/enum.model';
import { SelectFormOption } from 'src/app/core/models/qbd/misc/select-form-option.model';

@Component({
  selector: 'app-mapping-filter',
  templateUrl: './mapping-filter.component.html',
  styleUrls: ['./mapping-filter.component.scss']
})
export class MappingFilterComponent implements OnInit {

  @Input() mappingData: any;

  @Input() mappingFilter: boolean | null;

  @Output() mappingFilterChangeEvent = new EventEmitter<boolean | null>();

  @Output() mappingSearchingEvent = new EventEmitter<string>();

  mappingsFilter: SelectFormOption[] = [{
    label: 'MAPPED',
    value: FilterOptions.MAPPED
  }, {
    label: 'UNMAPPED',
    value: FilterOptions.UNMAPPED
  }];

  form: UntypedFormGroup;

  selectedFilter: any;

  openSearchBox: boolean = false;

  isInputFocused: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder
  ) { }

  clearSearch() {
    this.form.controls.searchOption.patchValue(null);
    this.isInputFocused = false;
    this.mappingSearchingEvent.emit('');
  }

  onBlurEvent(event: any) {
    if (event.target.value === null) {
      this.openSearchBox = true;
    } else {
      this.openSearchBox = false;
    }
  }

  openSerchBoxFn() {
    this.openSearchBox = false;
  }

  getItemClass(item: string): string {
    if (item === FilterOptions.MAPPED) {
      return 'mapped';
    }
    return 'unmapped';
  }

  removeFilter() {
    this.form.controls.filterOption.patchValue(null);
    this.mappingFilterChangeEvent.emit(null);
  }

  filterChanges() {
    this.form.controls.filterOption.valueChanges.subscribe((isFilterOptions) => {
    if (isFilterOptions.value === FilterOptions.MAPPED) {
      this.mappingFilterChangeEvent.emit(false);
    } else if (isFilterOptions.value === FilterOptions.UNMAPPED) {
      this.mappingFilterChangeEvent.emit(true);
    } else {
      this.mappingFilterChangeEvent.emit(null);
    }
    });
  }

  searchingFilter() {
    this.form.controls.searchOption.valueChanges
    .pipe(debounceTime(1500))
    .subscribe((searchValue) => {
        this.mappingSearchingEvent.emit(searchValue);
    });
  }

  filterWatcher() {
    this.filterChanges();

    this.searchingFilter();
  }

  setupFilter() {
    this.form = this.formBuilder.group({
      searchOption: ['kjhkjh'],
      filterOption: []
    });
    if (this.mappingFilter === null) {
      const filter = this.mappingFilter ? this.mappingsFilter[1] : this.mappingsFilter[0];
      this.form.controls.filterOption.patchValue(filter);
    } else {
      this.form.controls.filterOption.patchValue(null);
    }
    this.filterWatcher();
  }

  ngOnInit(): void {
    this.setupFilter();
  }

}
