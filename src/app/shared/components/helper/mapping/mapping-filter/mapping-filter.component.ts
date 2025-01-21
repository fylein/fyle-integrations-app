import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { brandingConfig, brandingContent } from 'src/app/branding/branding-config';
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

  readonly brandingContent = brandingContent.mapping;

  mappingsFilter: SelectFormOption[] = [{
    label: this.brandingContent.mappedHeader,
    value: MappingState.MAPPED
  }, {
    label: this.brandingContent.unMappedHeader,
    value: MappingState.UNMAPPED
  }];

  form: UntypedFormGroup;

  @Input() selectedAlphabeticalFilter: string;

  @Output() mappingFilterUpdateHandler = new EventEmitter<string>();

  readonly brandingConfig = brandingConfig;

  constructor(
    @Inject(FormBuilder) private formBuilder: UntypedFormBuilder,
    private trackingService: TrackingService
  ) { }

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
      this.mappingSearchingEvent.emit((searchValue as string).trim());
    });
  }

  setupMappingFilterWatcher(): void {
    this.filterChanges();

    this.searchingFilter();
  }

  private trackAlphabeticalFilter(allSelected: boolean = false): void {
    const properties: MappingAlphabeticalFilterAdditionalProperty = {
      alphabetList: allSelected ? [] : this.form.get('filterOption')?.value,
      allSelected: allSelected,
      page: this.page
    };
    this.trackingService.onMappingsAlphabeticalFilter(trackingAppMap[this.appName], properties);
  }

  filterOptionUpdateHandler(alphabet: string): void {
    this.selectedAlphabeticalFilter = alphabet;
    this.mappingFilterUpdateHandler.emit(alphabet);
    this.trackAlphabeticalFilter();
  }

  private setupFilter(): void {
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
