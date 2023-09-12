import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MappingState } from 'src/app/core/models/enum/enum.model';
import { Mapping } from 'src/app/core/models/qbd/db/mapping.model';
import { SelectFormOption } from 'src/app/core/models/qbd/misc/select-form-option.model';

@Component({
  selector: 'app-mapping-filter',
  templateUrl: './mapping-filter.component.html',
  styleUrls: ['./mapping-filter.component.scss']
})
export class MappingFilterComponent implements OnInit {

  @Input() mappingFilter: MappingState;

  @Output() mappingFilterChangeEvent = new EventEmitter<MappingState>();

  @Output() mappingSearchingEvent = new EventEmitter<string>();

  mappingsFilter: SelectFormOption[] = [{
    label: 'MAPPED',
    value: MappingState.MAPPED
  }, {
    label: 'UNMAPPED',
    value: MappingState.UNMAPPED
  }];

  form: UntypedFormGroup;

  selectedFilter: any;

  isSearchBoxActive: boolean = false;


  constructor(
    private formBuilder: UntypedFormBuilder
  ) { }

  clearSearch() {
    this.form.controls.searchOption.patchValue(null);
    const event = {
      target: {
        value: ''
      }
    };
    this.onFocusOut(event);
    this.mappingSearchingEvent.emit('');
  }

  onFocusOut(event: any) {
    if (event.target.value === '') {
      this.isSearchBoxActive = false;
    } else {
      this.isSearchBoxActive = true;
    }
  }

  getSelectedFilter(item: string): string {
    if (item === MappingState.MAPPED) {
      return 'mapped';
    }
    return 'unmapped';
  }

  removeFilter() {
    this.form.controls.filterOption.patchValue(null);
    this.mappingFilterChangeEvent.emit(MappingState.ALL);
  }

  filterChanges() {
    this.form.controls.filterOption.valueChanges.subscribe((isFilterOptions) => {
      this.mappingFilterChangeEvent.emit(isFilterOptions.value);
    });
  }

  searchingFilter() {
    this.form.controls.searchOption.valueChanges.subscribe((searchValue) => {
        this.mappingSearchingEvent.emit(searchValue);
    });
  }

  setupMappingFilterWatcher() {
    this.filterChanges();

    this.searchingFilter();
  }

  setupFilter() {
    this.form = this.formBuilder.group({
      searchOption: [],
      filterOption: []
    });
    if (this.mappingFilter !== MappingState.ALL) {
      const filter = this.mappingsFilter.filter((filter: SelectFormOption) => filter.value === this.mappingFilter);
      this.form.controls.filterOption.patchValue(filter[0]);
    } else {
      this.form.controls.filterOption.patchValue(null);
    }
    this.setupMappingFilterWatcher();
  }

  ngOnInit(): void {
    this.setupFilter();
  }

}
