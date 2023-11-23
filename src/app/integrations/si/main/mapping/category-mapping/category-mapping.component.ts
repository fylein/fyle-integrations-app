import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CorporateCreditCardExpensesObject, FieldType, FyleField, IntacctReimbursableExpensesObject, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { CategoryMappingsResponse } from 'src/app/core/models/si/db/category-mapping-response.model';
import { CategoryMapping, CategoryMappingPost, CategoryMappingResult } from 'src/app/core/models/si/db/category-mapping.model';
import { IntacctDestinationAttribute } from 'src/app/core/models/si/db/destination-attribute.model';
import { MappingStats } from 'src/app/core/models/si/db/mapping.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-category-mapping',
  templateUrl: './category-mapping.component.html',
  styleUrls: ['./category-mapping.component.scss']
})
export class CategoryMappingComponent implements OnInit {

  isLoading: boolean = true;

  isInitialSetupComplete: boolean = false;

  mappingStats: MappingStats;

  reimbursableExpenseObject?: IntacctReimbursableExpensesObject;

  cccExpenseObject?: CorporateCreditCardExpensesObject;

  sageIntacctAccounts: IntacctDestinationAttribute[];

  sageIntacctExpenseTypes: IntacctDestinationAttribute[];

  mappings: CategoryMappingResult[];

  filteredMappings: CategoryMappingResult[];

  sourceType: string;

  limit: number;

  offset: number = 0;

  pageNo: number = 0;

  totalCount: number;

  filteredMappingCount: number;

  selectedMappingFilter: MappingState = MappingState.ALL;

  PaginatorPage = PaginatorPage;

  currentPage: number = 1;

  searchValue: string;

  destinationFieldType = FieldType;

  operationgSystem: string;

  alphabetFilter: string = 'All';

  readonly brandingConfig = brandingConfig;

  constructor(
    private mappingService: SiMappingsService,
    private route: ActivatedRoute,
    private paginatorService: PaginatorService,
    private workspaceService: SiWorkspaceService,
    private toastService: IntegrationsToastService
  ) { }

  tableDropdownWidth() {
    const element = document.querySelector('.p-dropdown-panel.p-component.ng-star-inserted') as HTMLElement;
    if (element) {
      element.style.width = '300px';
    }
  }

  getCategoryMappingOptions() {
    if (this.isExpenseTypeRequired()) {
      return this.sageIntacctExpenseTypes;
    }
    return this.sageIntacctAccounts;
  }

  private getFilteredMappings() {
    this.mappingService.getCategoryMappings(this.limit, this.pageNo, this.getAttributesFilteredByConfig()[0], this.selectedMappingFilter, this.alphabetFilter).subscribe((intacctMappingResult: CategoryMappingsResponse) => {
      this.filteredMappings = intacctMappingResult.results.concat();
      this.filteredMappingCount = this.filteredMappings.length;
      this.totalCount = intacctMappingResult.count;
      this.isLoading = false;
    });
  }

  mappingSearchFilter(searchValue: string) {
    if (searchValue.length > 0) {
      const results: CategoryMappingResult[] = this.filteredMappings.filter((mapping) =>
        mapping.value?.toLowerCase().includes(searchValue)
      );
      this.filteredMappings = results;
    } else {
      this.filteredMappings = this.mappings.concat();
    }
    this.filteredMappingCount =this.filteredMappings.length;
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    if (this.limit !== limit) {
      this.paginatorService.storePageSize(PaginatorPage.MAPPING, limit);
    }
    this.limit = limit;
    this.pageNo = 0;
    this.currentPage = 1;
    this.getFilteredMappings();
  }

  pageOffsetChanges(pageNo: number): void {
    this.isLoading = true;
    this.pageNo = pageNo;
    this.currentPage = Math.ceil(this.pageNo / this.limit)+1;
    this.getFilteredMappings();
  }

  mappingStateFilter(state: MappingState): void {
    this.isLoading = true;
    this.selectedMappingFilter = state;
    this.currentPage = 1;
    this.pageNo = 0;
    this.getFilteredMappings();
  }

  mappingFilterUpdate(alphabet: string) {
    this.isLoading = true;
    this.alphabetFilter = alphabet;
    this.currentPage = 1;
    this.offset = 0;
    this.getFilteredMappings();
  }

  getAttributesFilteredByConfig() {
    const attributes = [];

    if (this.isExpenseTypeRequired()) {
      attributes.push('EXPENSE_TYPE');
    } else {
      attributes.push('ACCOUNT');
    }

    return attributes;
  }

  getDropdownValue(categoryMapping: CategoryMapping[]) {
    if (categoryMapping?.length) {
      if (!this.isExpenseTypeRequired()) {
        return categoryMapping[0].destination_account;
      }
        return categoryMapping[0].destination_expense_head;

    }
    return null;
  }

  private isExpenseTypeRequired(): boolean {
    return this.reimbursableExpenseObject === IntacctReimbursableExpensesObject.EXPENSE_REPORT || this.cccExpenseObject === CorporateCreditCardExpensesObject.EXPENSE_REPORT;
  }

  save(selectedRow: CategoryMappingResult, event: any) {
    const sourceId = selectedRow.id;

    const categoryMappingsPayload: CategoryMappingPost = {
      source_category: {
        id: sourceId
      },
      destination_account: {
        id: !this.isExpenseTypeRequired() ? event.value.id : null
      },
      destination_expense_head: {
        id: this.isExpenseTypeRequired() ? event.value.id : null
      },
      workspace: parseInt(this.workspaceService.getWorkspaceId())
    };

    this.mappingService.postCategoryMappings(categoryMappingsPayload).subscribe((response) => {
      // Decrement unmapped count only for new mappings, ignore updates
      if (!selectedRow.categorymapping.length) {
        this.mappingStats.unmapped_attributes_count -= 1;
      }

      selectedRow.categorymapping = [response];
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Category Mapping saved successfully');
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
    });
  }

  setupPage() {
    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.MAPPING);
    this.limit = paginator.limit;
    this.offset = paginator.offset;

    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    forkJoin([
      this.mappingService.getGroupedDestinationAttributes(this.getAttributesFilteredByConfig()),
      this.mappingService.getCategoryMappings(paginator.limit, paginator.offset, this.getAttributesFilteredByConfig()[0], this.selectedMappingFilter, this.alphabetFilter),
      this.mappingService.getMappingStats('CATEGORY', this.getAttributesFilteredByConfig()[0])
    ]).subscribe(
      ([groupedDestResponse, categoryMappingResponse, mappingStat]) => {
        this.sageIntacctExpenseTypes = groupedDestResponse.EXPENSE_TYPE;
        this.sageIntacctAccounts = groupedDestResponse.ACCOUNT;
        this.mappingStats = mappingStat;
        this.mappings = categoryMappingResponse.results;
        this.filteredMappings = this.mappings.concat();
        this.totalCount = categoryMappingResponse.count;
        if (!this.isInitialSetupComplete) {
          this.filteredMappingCount = categoryMappingResponse.count;
        }
        this.isInitialSetupComplete = true;
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.mappingService.getConfiguration().subscribe((response) => {
      this.reimbursableExpenseObject = response.reimbursable_expenses_object;
      this.cccExpenseObject = response.corporate_credit_card_expenses_object;
      this.setupPage();
    });
  }
}
