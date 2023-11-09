import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AutoMapEmployeeOptions, CorporateCreditCardExpensesObject, FieldType, FyleField, IntacctReimbursableExpensesObject, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { CategoryMappingPost } from 'src/app/core/models/si/db/category-mapping.model';
import { EmployeeMapping, EmployeeMappingPost, EmployeeMappingsResponse } from 'src/app/core/models/si/db/employee-mapping.model';
import { ExtendedGenericMappingV2, GenericMappingV2, GenericMappingV2Response } from 'src/app/core/models/si/db/generic-mapping-v2.model';
import { MappingDestination } from 'src/app/core/models/si/db/mapping-destination.model';
import { MappingStats } from 'src/app/core/models/si/db/mapping.model';
import { Paginator } from 'src/app/core/models/si/misc/paginator.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-generic-mapping-v2',
  templateUrl: './generic-mapping-v2.component.html',
  styleUrls: ['./generic-mapping-v2.component.scss']
})
export class GenericMappingV2Component implements OnInit {

  isLoading: boolean = true;

  @Input() mappingPageName: string;

  @Input() destinationField: string;

  @Input() employeeFieldMapping: FyleField;

  isInitialSetupComplete: boolean = false;

  @Input() showAutoMapEmployee: boolean;

  mappingStats: MappingStats;

  employeeMapping: GenericMappingV2Response;

  mappings: ExtendedGenericMappingV2[];

  filteredMappings: ExtendedGenericMappingV2[];

  searchTerm: string = '';

  @Input() destinationOptions: DestinationAttribute[];

  sourceType: string;

  limit: number = 10;

  offset: number = 0;

  totalCount: number;

  filteredMappingCount: number;

  selectedMappingFilter: MappingState = MappingState.ALL;

  PaginatorPage = PaginatorPage;

  currentPage: number = 1;

  searchValue: string;

  destinationFieldType = FieldType;

  operationgSystem: string;

  alphabetFilter: string = 'All';

  reimbursableExpenseObject?: IntacctReimbursableExpensesObject;

  cccExpenseObject?: CorporateCreditCardExpensesObject;

  constructor(
    private mappingService: SiMappingsService,
    private paginatorService: PaginatorService,
    private route: ActivatedRoute,
    private toastService: IntegrationsToastService
  ) { }

  triggerAutoMapEmployees() {
    const that = this;
    that.isLoading = true;
    that.mappingService.triggerAutoMapEmployees().subscribe(() => {
      that.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Auto mapping of employees may take few minutes');
    }, () => {
      that.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong, please try again');
    });
  }

  private getFilteredMappings() {
    this.mappingService.getGenericMappingsV2(this.limit, this.offset, this.destinationField, this.selectedMappingFilter, this.alphabetFilter, this.mappingPageName).subscribe((intacctMappingResult: GenericMappingV2Response) => {
      this.filteredMappings = intacctMappingResult.results.concat();
      this.filteredMappingCount = this.filteredMappings.length;
      this.totalCount = intacctMappingResult.count;
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
      const results: ExtendedGenericMappingV2[] = this.filteredMappings.filter((mapping) =>
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
      this.mappingService.getGenericMappingsV2(10, 0, this.destinationField, this.selectedMappingFilter, this.alphabetFilter, this.mappingPageName),
      this.mappingService.getMappingStats(this.mappingPageName, this.destinationField)
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
