import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CorporateCreditCardExpensesObject, FieldType, FyleField, IntacctReimbursableExpensesObject, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { CategoryMappingsResponse } from 'src/app/core/models/si/db/category-mapping-response.model';
import { CategoryMapping } from 'src/app/core/models/si/db/category-mapping.model';
import { MappingStats } from 'src/app/core/models/si/db/mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-category-mapping',
  templateUrl: './category-mapping.component.html',
  styleUrls: ['./category-mapping.component.scss']
})
export class CategoryMappingComponent implements OnInit {

  isLoading: boolean = false;

  isInitialSetupComplete: boolean = false;

  mappingStats: MappingStats;

  employeeFieldMapping: FyleField;

  reimbursableExpenseObject?: IntacctReimbursableExpensesObject;

  cccExpenseObject?: CorporateCreditCardExpensesObject;

  sageIntacctAccounts: DestinationAttribute[];

  sageIntacctExpenseTypes: DestinationAttribute[];

  mappingState: MappingStats;

  mappings: CategoryMapping[];

  filteredMappings: CategoryMapping[];

  sourceType: string;

  limit: number = 10;

  pageNo: number = 0;

  totalCount: number;

  filteredMappingCount: number;

  selectedMappingFilter: MappingState = MappingState.ALL;

  PaginatorPage = PaginatorPage;

  currentPage: number = 1;

  searchValue: string;

  destinationFieldType = FieldType;

  operationgSystem: string;

  constructor(
    private mappingService: SiMappingsService,
    private route: ActivatedRoute,
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
    if (this.getAttributesFilteredByConfig()[0]==='EXPENSE_TYPE'){
      return this.sageIntacctExpenseTypes;
    }
    return this.sageIntacctAccounts;
  }

  private getFilteredMappings() {
    this.mappingService.getCategoryMappings(this.limit, this.pageNo, this.getAttributesFilteredByConfig()[0], this.selectedMappingFilter).subscribe((intacctMappingResult: CategoryMappingsResponse) => {
      this.filteredMappings = intacctMappingResult.results.concat();
      this.filteredMappingCount = this.filteredMappings.length;
      this.isLoading = false;
    });
  }

  mappingSeachingFilter(searchValue: string) {
    if (searchValue.length > 0) {
      const results: CategoryMapping[] = this.mappings.filter((mapping) =>
        mapping.source_category.value?.toLowerCase().includes(searchValue)
      );
      this.filteredMappings = results;
    } else {
      this.filteredMappings = this.mappings.concat();
    }
    this.filteredMappingCount =this.filteredMappings.length;
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
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
    this.limit = 10;
    this.pageNo = 0;
    this.getFilteredMappings();
  }

  getAttributesFilteredByConfig() {
    const attributes = [];

    if (this.reimbursableExpenseObject === IntacctReimbursableExpensesObject.EXPENSE_REPORT) {
      attributes.push('EXPENSE_TYPE');
    }

    if ( this.reimbursableExpenseObject === IntacctReimbursableExpensesObject.BILL ||  this.reimbursableExpenseObject === IntacctReimbursableExpensesObject.JOURNAL_ENTRY || (! this.reimbursableExpenseObject && (this.cccExpenseObject === CorporateCreditCardExpensesObject.JOURNAL_ENTRY || this.cccExpenseObject === CorporateCreditCardExpensesObject.BILL || this.cccExpenseObject === CorporateCreditCardExpensesObject.CHARGE_CARD_TRANSACTION))) {
      attributes.push('ACCOUNT');
    }
    return attributes;
  }

  getDropdownValue(categoryMapping: CategoryMapping[]) {
    if (categoryMapping.length) {
      if (this.getAttributesFilteredByConfig()[0]==='ACCOUNT') {
        return categoryMapping[0].destination_account?.id;
      } else if (this.getAttributesFilteredByConfig()[0]==='EXPENSE_TYPE') {
        return categoryMapping[0].destination_expense_head?.id;
      }
    }
    return null;
  }

  save(selectedRow: CategoryMapping, event: any) {
    const sourceId = selectedRow.source_category.id;
    const destinationAccountId = this.getAttributesFilteredByConfig()[0]==='ACCOUNT' ? event.value.id : null;
    const destinationExpenseHeadId = this.getAttributesFilteredByConfig()[0]==='EXPENSE_TYPE' ? event.value.id : null;

    if ((destinationAccountId || destinationExpenseHeadId)) {
      this.isLoading = true;

      const categoryMappingsPayload: CategoryMapping = {
        source_category: {
          id: sourceId
        },
        destination_account: {
          id: destinationAccountId
        },
        destination_expense_head: {
          id: destinationExpenseHeadId
        },
        workspace: parseInt(this.workspaceService.getWorkspaceId())
      };

      this.mappingService.postCategoryMappings(categoryMappingsPayload).subscribe(() => {
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Category Mapping saved successfully');
        this.setupPage();
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
      });
    }
  }

  setupPage() {
    this.isLoading = true;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    forkJoin([
      this.mappingService.getGroupedDestinationAttributes(this.getAttributesFilteredByConfig()),
      this.mappingService.getCategoryMappings(10, 1, this.getAttributesFilteredByConfig()[0], this.selectedMappingFilter),
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
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.mappingService.getConfiguration().subscribe((response) => {
      this.isLoading = true;
      this.employeeFieldMapping = response.employee_field_mapping;
      this.reimbursableExpenseObject = response.reimbursable_expenses_object;
      this.cccExpenseObject = response.corporate_credit_card_expenses_object;
      this.setupPage();
    });
  }
}
