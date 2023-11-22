import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { MappingStats } from 'src/app/core/models/qbd/db/mapping.model';
import { Configuration } from 'src/app/core/models/db/configuration.model';
import { MinimalMappingSetting } from 'src/app/core/models/si/db/mapping-setting.model';
import { MappingPost } from 'src/app/core/models/si/db/mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { TitleCasePipe } from '@angular/common';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { ExtendedExpenseAttribute, ExtendedExpenseAttributeResponse } from 'src/app/core/models/si/db/expense-attribute.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { IntacctDestinationAttribute } from 'src/app/core/models/si/db/destination-attribute.model';
import { brandingConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-generic-mapping',
  templateUrl: './generic-mapping.component.html',
  styleUrls: ['./generic-mapping.component.scss']
})
export class GenericMappingComponent implements OnInit {

  isLoading: boolean;

  configuration: Configuration;

  mappingSetting: MinimalMappingSetting;

  mappingStats: MappingStats;

  mappings: ExtendedExpenseAttribute[];

  filteredMappings: ExtendedExpenseAttribute[];

  dropdownOptions: IntacctDestinationAttribute[];

  page: string;

  sourceType: string;

  limit: number;

  offset: number = 0;

  totalCount: number;

  filteredMappingCount: number;

  isInitialSetupComplete: boolean = false;

  selectedMappingFilter: MappingState = MappingState.ALL;

  PaginatorPage = PaginatorPage;

  currentPage: number = 1;

  searchValue: string;

  destinationFieldType: string;

  operationgSystem: string;

  alphabetFilter: string = 'All';

  readonly brandingConfig = brandingConfig;

  constructor(
    private paginatorService: PaginatorService,
    private route: ActivatedRoute,
    private toastService: IntegrationsToastService,
    private mappingService: SiMappingsService
  ) { }

  tableDropdownWidth() {
    const element = document.querySelector('.p-dropdown-panel.p-component.ng-star-inserted') as HTMLElement;
    if (element) {
      element.style.width = '300px';
    }
  }

  getDropdownValue(mapping: ExtendedExpenseAttribute) {
    if (mapping.mapping.length) {
      return mapping.mapping[0].destination;
    }
    return null;
  }

  save(selectedRow: ExtendedExpenseAttribute, event:any) {
    const payload: MappingPost = {
      source_type: this.mappingSetting.source_field,
      source_value: selectedRow.value,
      destination_type: this.mappingSetting.destination_field,
      destination_id: event.value.destination_id,
      destination_value: event.value.value
    };
    this.mappingService.postMapping(payload).subscribe((response) => {
      // Decrement unmapped count only for new mappings, ignore updates
      if (!selectedRow.mapping.length) {
        this.mappingStats.unmapped_attributes_count -= 1;
      }

      selectedRow.mapping = [response];
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Mapping saved successfully');
    }, () => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
    });
  }

  private getFilteredMappings() {
    this.mappingService.getMappings(this.selectedMappingFilter, this.limit, this.offset, this.sourceType, this.mappingSetting.destination_field, this.alphabetFilter).subscribe((response: ExtendedExpenseAttributeResponse) => {
      this.filteredMappings = response.results.concat();
      this.filteredMappingCount = this.filteredMappings.length;
      this.totalCount = response.count;
      this.isLoading = false;
    });
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.MAPPING, limit);
    }
    this.limit = limit;
    this.offset = 0;
    this.currentPage = 1;
    this.getFilteredMappings();
  }

  pageOffsetChanges(offset: number): void {
    this.isLoading = true;
    this.offset = offset;
    this.currentPage = Math.ceil(this.offset / this.limit)+1;
    this.getFilteredMappings();
  }

  mappingFilterUpdate(alphabet: string) {
    this.isLoading = true;
    this.alphabetFilter = alphabet;
    this.currentPage = 1;
    this.offset = 0;
    this.getFilteredMappings();
  }

  mappingStateFilter(state: MappingState): void {
    this.isLoading = true;
    this.selectedMappingFilter = state;
    this.currentPage = 1;
    this.offset = 0;
    this.getFilteredMappings();
  }

  mappingSearchFilter(searchValue: string) {
    if (searchValue.length > 0) {
      const results: ExtendedExpenseAttribute[] = this.filteredMappings.filter((mapping) =>
        mapping.value?.toLowerCase().includes(searchValue)
      );
      this.filteredMappings = results;
    } else {
      this.filteredMappings = this.mappings.concat();
    }
    this.filteredMappingCount = this.filteredMappings.length;
  }

  setupPage() {
    this.isLoading = true;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.MAPPING);
    this.limit = paginator.limit;
    this.offset = paginator.offset;

    forkJoin([
      this.mappingService.getConfiguration(),
      this.mappingService.getMappingSettings()
    ]).subscribe((response) => {
      const mappingSetting = response[1].results.filter((mappingSetting) => mappingSetting.source_field === this.sourceType.toUpperCase());
      this.mappingSetting = mappingSetting[0];
      this.destinationFieldType = this.mappingSetting.destination_field;
      this.page = `${new TitleCasePipe().transform(new SnakeCaseToSpaceCasePipe().transform(this.mappingSetting.source_field))} Mapping`;
      this.configuration = response[0];
      forkJoin([
        this.mappingService.getSageIntacctDestinationAttributes(this.mappingSetting.destination_field),
        this.mappingService.getMappingStats(this.sourceType.toUpperCase(), this.mappingSetting.destination_field),
        this.mappingService.getMappings(MappingState.ALL, this.limit, this.offset, this.sourceType, this.mappingSetting.destination_field, this.alphabetFilter)
      ]).subscribe(([options, mappingStats, mappings]) => {
        this.mappingStats = mappingStats;
        this.totalCount = mappings.count;
        if (!this.isInitialSetupComplete) {
          this.filteredMappingCount = mappings.count;
        }
        this.isInitialSetupComplete = true;
        this.mappings = mappings.results;
        this.filteredMappings = this.mappings.concat();
        this.dropdownOptions = options;
        this.isLoading = false;
      });
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.setupPage();
    });
  }

}
