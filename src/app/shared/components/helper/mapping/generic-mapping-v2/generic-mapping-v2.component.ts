import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExtendedGenericMapping, GenericMappingResponse } from 'src/app/core/models/db/extended-generic-mapping.model';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { AppName, FyleField, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { PaginatorService } from 'src/app/core/services/common/paginator.service';

@Component({
  selector: 'app-generic-mapping-v2',
  templateUrl: './generic-mapping-v2.component.html',
  styleUrls: ['./generic-mapping-v2.component.scss']
})
export class GenericMappingV2Component implements OnInit, OnChanges {

  @Input() isLoading: boolean;

  @Input() sourceField: string;

  @Input() destinationField: string;

  @Input() employeeFieldMapping: FyleField;

  @Input() showAutoMapEmployee: boolean;

  @Input() destinationOptions: DestinationAttribute[];

  @Input() appName: AppName;

  @Input() isCategoryMappingGeneric: boolean;

  isInitialSetupComplete: boolean = false;

  mappingStats: MappingStats;

  mappings: ExtendedGenericMapping[];

  filteredMappings: ExtendedGenericMapping[];

  searchTerm: string = '';

  sourceType: string;

  limit: number;

  offset: number = 0;

  totalCount: number;

  filteredMappingCount: number;

  selectedMappingFilter: MappingState = MappingState.ALL;

  PaginatorPage = PaginatorPage;

  currentPage: number = 1;

  alphabetFilter: string = 'All';

  @Output() triggerAutoMapEmployee = new EventEmitter<boolean>();

  @Output() searchTrigger = new EventEmitter<string>();

  readonly brandingConfig = brandingConfig;

  constructor(
    private mappingService: MappingService,
    private paginatorService: PaginatorService,
    private route: ActivatedRoute
  ) { }

  triggerAutoMapEmployees() {
    this.triggerAutoMapEmployee.emit(true);
  }

  private getFilteredMappings() {
    this.mappingService.getGenericMappingsV2(this.limit, this.offset, this.destinationField, this.selectedMappingFilter, this.alphabetFilter, this.sourceField, this.isCategoryMappingGeneric).subscribe((mappingResponse: GenericMappingResponse) => {
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
      const query = searchValue.toLowerCase().trim();
      this.filteredMappings = this.mappings.filter((mapping) => mapping.value?.toLowerCase().includes(query));
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

  searchOptions(event: any) {
    this.searchTrigger.emit(event);
  }

  destinationOptionsBuild() {
    const mappingType = this.sourceType === FyleField.EMPLOYEE ? 'employeemapping' : 'mapping';
    this.mappings.forEach((data: any) => {
      if (data[mappingType].length > 0) {
        const destinationValue = this.destinationField === FyleField.EMPLOYEE ? data[mappingType][0].destination_employee.value : this.destinationField === FyleField.VENDOR ? data[mappingType][0].destination_vendor.value : data[mappingType][0].destination.value;
        if (!this.destinationOptions.some((map: any) => map.value === destinationValue)) {
          if (mappingType === 'employeemapping') {
            this.destinationField === FyleField.VENDOR ? this.destinationOptions.push(data[mappingType][0].destination_vendor) : this.destinationOptions.push(data[mappingType][0].destination_employee);
          } else {
            this.destinationOptions.push(data[mappingType][0].destination);
          }
        }
      }
    });
  }

  setupPage() {
    this.isLoading = true;
    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.MAPPING);
    this.limit = paginator.limit;
    this.offset = paginator.offset;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field)).toUpperCase();
    forkJoin([
      this.mappingService.getGenericMappingsV2(this.limit, 0, this.destinationField, this.selectedMappingFilter, this.alphabetFilter, this.sourceField, this.isCategoryMappingGeneric),
      this.mappingService.getMappingStats(this.sourceField, this.destinationField, this.appName)
    ]).subscribe(
      ([mappingResponse, mappingStat]) => {
        this.totalCount = mappingResponse.count;
        if (!this.isInitialSetupComplete) {
          this.filteredMappingCount = mappingResponse.count;
        }
        this.mappings = mappingResponse.results;
        this.destinationOptionsBuild();
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

  ngOnChanges() {
    this.destinationOptionsBuild();
  }

}
