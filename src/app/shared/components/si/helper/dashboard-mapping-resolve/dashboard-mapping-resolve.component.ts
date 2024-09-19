import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FyleField, IntacctCategoryDestination, IntacctErrorType, SageIntacctField, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import type { CategoryMappingPost } from 'src/app/core/models/intacct/db/category-mapping.model';
import type { IntacctDestinationAttribute } from 'src/app/core/models/intacct/db/destination-attribute.model';
import type { EmployeeMappingPost } from 'src/app/core/models/intacct/db/employee-mapping.model';
import type { Error } from 'src/app/core/models/intacct/db/error.model';
import type { ExpenseAttribute } from 'src/app/core/models/intacct/db/expense-attribute.model';
import type { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import type { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import type { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-dashboard-mapping-resolve',
  templateUrl: './dashboard-mapping-resolve.component.html',
  styleUrls: ['./dashboard-mapping-resolve.component.scss']
})
export class DashboardMappingResolveComponent implements OnInit {

  isLoading: boolean = true;

  @Input() mappingType: IntacctErrorType;

  @Input() isDialogVisible: boolean = false;

  @Input() groupedError: Error[];

  @Input() employeeFieldMapping: FyleField;

  intacctErrorType: IntacctErrorType;

  // Employee Mapping
  fyleEmployeeOptions: IntacctDestinationAttribute[];

  // Category Mapping
  sageIntacctAccounts: IntacctDestinationAttribute[];

  sageIntacctExpenseTypes: IntacctDestinationAttribute[];

  constructor(
    private mappingService: SiMappingsService,
    private workspaceService: SiWorkspaceService,
    private toastService: IntegrationsToastService
  ) { }

  tableDropdownWidth() {
    const element = document.querySelector('.p-dropdown-panel.p-component.ng-star-inserted') as HTMLElement;
    if (element) {
      element.style.width = '300px';
    }
  }

  saveEmployeeMapping(selectedRow: ExpenseAttribute, event: any): void {
    const employeeMapping: EmployeeMappingPost = {
      source_employee: {
        id: selectedRow.id
      },
      destination_vendor: {
        id: this.employeeFieldMapping === FyleField.VENDOR ? event.value.id : null
      },
      destination_employee: {
        id: this.employeeFieldMapping === FyleField.EMPLOYEE ? event.value.id : null
      },
      destination_card_account: {
        id: null
      },
      workspace: parseInt(this.workspaceService.getWorkspaceId())
    };
    this.mappingService.postEmployeeMappings(employeeMapping).subscribe(() => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Employee mapping saved successfully');
    }, () => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
    });
  }

  getEmployeeAttributeType(): FyleField {
    if (this.employeeFieldMapping === FyleField.EMPLOYEE) {
      return FyleField.EMPLOYEE;
    }

    return FyleField.VENDOR;
  }

  // Resolve Category Mapping
  getCategoryMappingOptions() {
    if (this.employeeFieldMapping === FyleField.EMPLOYEE){
      return this.sageIntacctExpenseTypes;
    }
    return this.sageIntacctAccounts;
  }

  saveCategoryMapping(selectedRow: ExpenseAttribute, event: any) {
    const sourceId = selectedRow.id;

    const categoryMappingsPayload: CategoryMappingPost = {
      source_category: {
        id: sourceId
      },
      destination_account: {
        id: this.employeeFieldMapping === FyleField.VENDOR ? event.value.id : null
      },
      destination_expense_head: {
        id: this.employeeFieldMapping === FyleField.EMPLOYEE ? event.value.id : null
      },
      workspace: parseInt(this.workspaceService.getWorkspaceId())
    };

    this.mappingService.postCategoryMappings(categoryMappingsPayload).subscribe(() => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Category mapping saved successfully');
    }, () => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
    });
  }

  getCategoryDestinationType(): IntacctCategoryDestination | SageIntacctField {
    if (this.employeeFieldMapping === FyleField.EMPLOYEE) {
      return IntacctCategoryDestination.EXPENSE_TYPE;
    }

    return SageIntacctField.ACCOUNT;
  }

  private getDestinationAttributeType(): (FyleField | IntacctCategoryDestination | SageIntacctField)[] {
    const attributeType = [];
    if (this.mappingType === IntacctErrorType.EMPLOYEE_MAPPING) {
      if (this.employeeFieldMapping === FyleField.VENDOR) {
        attributeType.push(FyleField.VENDOR);
      } else {
        attributeType.push(FyleField.EMPLOYEE);
      }
    } else if (this.mappingType === IntacctErrorType.CATEGORY_MAPPING) {
      if (this.employeeFieldMapping === FyleField.VENDOR) {
        attributeType.push(SageIntacctField.ACCOUNT);
      } else {
        attributeType.push(IntacctCategoryDestination.EXPENSE_TYPE);
      }
    }

    return attributeType;
  }

  setupPage() {
    const attributeType = this.getDestinationAttributeType();
    this.mappingService.getGroupedDestinationAttributes(attributeType).subscribe((response) => {
      this.sageIntacctExpenseTypes = response.EXPENSE_TYPE;
      this.sageIntacctAccounts = response.ACCOUNT;
      this.fyleEmployeeOptions = this.getEmployeeAttributeType() === FyleField.EMPLOYEE ? response.EMPLOYEE : response.VENDOR;
      this.isLoading = false;
    });
 }

  ngOnInit(): void {
    this.setupPage();
  }

}
