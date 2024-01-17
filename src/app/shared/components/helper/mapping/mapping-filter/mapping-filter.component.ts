import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { AppName, MappingState } from 'src/app/core/models/enum/enum.model';
import { MappingAlphabeticalFilterAdditionalProperty, trackingAppMap } from 'src/app/core/models/misc/tracking.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-mapping-filter',
  templateUrl: './mapping-filter.component.html',
  styleUrls: ['./mapping-filter.component.scss']
})
export class MappingFilterComponent implements OnInit {

  @Input() appName: AppName;

  @Input() mappingFilter: MappingState;

  @Output() mappingFilterChangeEvent = new EventEmitter<MappingState>();

  @Output() mappingSearchingEvent = new EventEmitter<string>();

  @Input() isAlphabetFilterHidden: boolean;

  @Input() page: string;

  filterOptions: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  mappingsFilter: SelectFormOption[] = [{
    label: 'MAPPED',
    value: MappingState.MAPPED
  }, {
    label: 'UNMAPPED',
    value: MappingState.UNMAPPED
  }];

  form: UntypedFormGroup;

  @Input() selectedAlphabeticalFilter: string;

  selectedAlphabets:string[] = [];

  isSearchBoxActive: boolean = false;

  @Output() mappingFilterUpdateHandler = new EventEmitter<string>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private trackingService: TrackingService
  ) { }

  clearSearch(): void {
    this.form.controls.searchOption.patchValue(null);
    const event = {
      target: {
        value: ''
      }
    };
    this.onFocusOut(event);
    this.mappingSearchingEvent.emit('');
  }

  onFocusOut(event: any): void {
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

  removeFilter(): void {
    this.form.controls.filterOption.patchValue('');
    this.mappingFilterChangeEvent.emit(MappingState.ALL);
  }

  filterChanges(): void {
    this.form.controls.filterOption.valueChanges.subscribe((isFilterOptions) => {
      this.mappingFilterChangeEvent.emit(isFilterOptions?.value);
    });
  }

  searchingFilter(): void {
    this.form.controls.searchOption.valueChanges.subscribe((searchValue) => {
        this.mappingSearchingEvent.emit(searchValue);
    });
  }

  setupMappingFilterWatcher(): void {
    this.filterChanges();

    this.searchingFilter();
  }

  private trackAlphabeticalFilter(allSelected: boolean = false): void {
    const properties: MappingAlphabeticalFilterAdditionalProperty = {
      alphabetList: allSelected ? [] : this.form.value.filterOption,
      allSelected: allSelected,
      page: this.page
    };
    this.trackingService.onMappingsAlphabeticalFilter(trackingAppMap[this.appName], properties);
  }

  filterOptionUpdateHandler(alphabet: string): void {
    if (alphabet === 'All' || this.selectedAlphabets.indexOf('All') > -1) {
      this.selectedAlphabets = [];
      this.selectedAlphabets.push(alphabet);
    } else if (this.selectedAlphabets.indexOf(alphabet) > -1) {
      this.selectedAlphabets.splice(this.selectedAlphabets.indexOf(alphabet), 1);
    } else {
      this.selectedAlphabets.push(alphabet);
    }
    alphabet = this.selectedAlphabets.toString();
    this.mappingFilterUpdateHandler.emit(alphabet);
    this.trackAlphabeticalFilter();
  }

  private setupFilter(): void {
    this.selectedAlphabets = this.selectedAlphabeticalFilter.split(',');
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
