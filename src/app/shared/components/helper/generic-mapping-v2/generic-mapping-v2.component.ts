import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExtendedGenericMapping, GenericMappingResponse } from 'src/app/core/models/db/extended-generic-mapping.model';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { FyleField, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';

@Component({
  selector: 'app-generic-mapping-v2',
  templateUrl: './generic-mapping-v2.component.html',
  styleUrls: ['./generic-mapping-v2.component.scss']
})
export class GenericMappingV2Component implements OnInit {

  isLoading: boolean = false;

  @Input() sourceField: string;

  @Input() destinationField: string;

  @Input() employeeFieldMapping: FyleField;

  isInitialSetupComplete: boolean = false;

  @Input() showAutoMapEmployee: boolean;

  mappingStats: MappingStats;

  mappings: ExtendedGenericMapping[];

  filteredMappings: ExtendedGenericMapping[];

  searchTerm: string = '';

  @Input() destinationOptions: DestinationAttribute[];

  sourceType: string;

  limit: number;

  offset: number = 0;

  totalCount: number;

  filteredMappingCount: number;

  selectedMappingFilter: MappingState = MappingState.ALL;

  PaginatorPage = PaginatorPage;

  currentPage: number = 1;

  alphabetFilter: string = 'All';

  constructor(
    private mappingService: MappingService,
    private paginatorService: PaginatorService,
    private route: ActivatedRoute,
    private toastService: IntegrationsToastService
  ) { }

  triggerAutoMapEmployees() {
    this.isLoading = true;
    this.mappingService.triggerAutoMapEmployees().subscribe(() => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Auto mapping of employees may take few minutes');
    }, () => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong, please try again');
    });
  }

  private getFilteredMappings() {
    this.mappingService.getGenericMappingsV2(this.limit, this.offset, this.destinationField, this.selectedMappingFilter, this.alphabetFilter, this.sourceField).subscribe((mappingResponse: GenericMappingResponse) => {
      this.filteredMappings = mappingResponse.results.concat();
      this.filteredMappingCount = this.filteredMappings.length;
      this.totalCount = mappingResponse.count;
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

  mappingStateFilter(state: MappingState): void {
    this.isLoading = true;
    this.selectedMappingFilter = state;
    this.currentPage = 1;
    this.offset = 0;
    this.getFilteredMappings();
  }

  mappingSearchFilter(searchValue: string) {
    if (searchValue.length > 0) {
      const results: ExtendedGenericMapping[] = this.filteredMappings.filter((mapping) =>
        mapping.value?.toLowerCase().includes(searchValue)
      );
      this.filteredMappings = results;
    } else {
      this.filteredMappings = this.mappings.concat();
    }
    this.filteredMappingCount = this.filteredMappings.length;
  }

  mappingFilterUpdate(alphabet: string) {
    this.isLoading = true;
    this.alphabetFilter = alphabet;
    this.currentPage = 1;
    this.offset = 0;
    this.getFilteredMappings();
  }

  setupPage() {
    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.MAPPING);
    this.limit = paginator.limit;
    this.offset = paginator.offset;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    forkJoin([
      this.mappingService.getGenericMappingsV2(10, 0, this.destinationField, this.selectedMappingFilter, this.alphabetFilter, this.sourceField),
      this.mappingService.getMappingStats(this.sourceField, this.destinationField, 'SAGE300')
    ]).subscribe(
      ([mappingResponse, mappingStat]) => {
        this.totalCount = mappingResponse.count;
        if (!this.isInitialSetupComplete) {
          this.filteredMappingCount = mappingResponse.count;
        }
        this.mappings = mappingResponse.results;
        this.mappingStats = mappingStat;
        this.filteredMappings = this.mappings.concat();
        this.isInitialSetupComplete = true;
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
