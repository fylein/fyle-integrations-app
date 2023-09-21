import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CorporateCreditCardExpensesObject, FyleField, IntacctErrorType, IntacctReimbursableExpensesObject, MappingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { CategoryMapping, CategoryMappingPost, CategoryMappingResult } from 'src/app/core/models/si/db/category-mapping.model';
import { EmployeeMapping, EmployeeMappingPost, EmployeeMappingResult, EmployeeMappingsResponse } from 'src/app/core/models/si/db/employee-mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-dashboard-mapping-resolve',
  templateUrl: './dashboard-mapping-resolve.component.html',
  styleUrls: ['./dashboard-mapping-resolve.component.scss']
})
export class DashboardMappingResolveComponent implements OnInit {

  isLoading: boolean = true;

  @Input() mappingType: IntacctErrorType;

  @Input() isDialogVisible: boolean = false;

  employeeFieldMapping: FyleField;

  reimbursableExpenseObject?: IntacctReimbursableExpensesObject;

  cccExpenseObject?: CorporateCreditCardExpensesObject;

  intacctErrorType: IntacctErrorType;

  // Employee Mapping
  fyleEmployeeOptions: DestinationAttribute[];

  employeeMapping: EmployeeMappingsResponse;

  filteredEmployeeMappings: EmployeeMappingResult[];

  // Category Mapping

  filteredCategoryMappings: CategoryMapping[];

  sageIntacctAccounts: DestinationAttribute[];

  sageIntacctExpenseTypes: DestinationAttribute[];

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

  // Resolve Employee Mapping

  getEmployeeDropdownValue(employeeMapping: EmployeeMapping[]) {
    if (employeeMapping.length) {
      if (this.employeeFieldMapping===FyleField.VENDOR) {
        return employeeMapping[0].destination_vendor;
      } else if (this.employeeFieldMapping===FyleField.EMPLOYEE) {
        return employeeMapping[0].destination_employee;
      }
    }
    return null;
  }

  saveEmployeeMapping(selectedRow: EmployeeMappingResult, event: any): void {
    const employeeMapping: EmployeeMappingPost = {
      source_employee: {
        id: selectedRow.id
      },
      destination_vendor: {
        id: this.employeeFieldMapping===FyleField.VENDOR ? event.value.id : (selectedRow.employeemapping.length && selectedRow.employeemapping[0].destination_vendor ? selectedRow.employeemapping[0].destination_vendor?.id : null)
      },
      destination_employee: {
        id: this.employeeFieldMapping===FyleField.EMPLOYEE ? event.value.id : (selectedRow.employeemapping.length && selectedRow.employeemapping[0].destination_employee ? selectedRow.employeemapping[0].destination_employee?.id : null)
      },
      destination_card_account: {
        id: (selectedRow.employeemapping.length && selectedRow.employeemapping[0].destination_card_account ? selectedRow.employeemapping[0].destination_card_account?.id : null)
      },
      workspace: parseInt(this.workspaceService.getWorkspaceId())
    };
    this.mappingService.postEmployeeMappings(employeeMapping).subscribe(() => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Employee Mapping saved successfully');
    }, err => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
    });
  }

  getEmployeeAttributeType() {
    const attributes = [];

    if (this.employeeFieldMapping === 'VENDOR') {
      attributes.push('VENDOR');
    } else if (this.employeeFieldMapping === 'EMPLOYEE') {
      attributes.push('EMPLOYEE');
    }

    return attributes;
  }

  setupEmployeeMapping() {
    forkJoin([
      this.mappingService.getGroupedDestinationAttributes(this.getEmployeeAttributeType()),
      this.mappingService.getEmployeeMappings(500, 0, this.getEmployeeAttributeType()[0], MappingState.UNMAPPED)
    ]).subscribe(
      ([groupedDestResponse, employeeMappingResponse]) => {
        this.fyleEmployeeOptions = this.getEmployeeAttributeType()[0] === 'EMPLOYEE' ? groupedDestResponse.EMPLOYEE : groupedDestResponse.VENDOR;
        this.employeeMapping = employeeMappingResponse;
        this.filteredEmployeeMappings = employeeMappingResponse.results;
        this.isLoading = false;
      }
    );
  }

  // Resolve Category Mapping
  getCategoryMappingOptions() {
    if (this.employeeFieldMapping === FyleField.EMPLOYEE){
      return this.sageIntacctExpenseTypes;
    }
    return this.sageIntacctAccounts;
  }

  getCategoryDropdownValue(categoryMapping: CategoryMapping[]) {
    if (categoryMapping.length) {
      if (this.employeeFieldMapping === FyleField.VENDOR) {
        return categoryMapping[0].destination_account;
      } else if (this.employeeFieldMapping === FyleField.EMPLOYEE) {
        return categoryMapping[0].destination_expense_head;
      }
    }
    return null;
  }

  saveCategoryMapping(selectedRow: CategoryMappingResult, event: any) {
    const sourceId = selectedRow.id;
    this.isLoading = true;

    const categoryMappingsPayload: CategoryMappingPost = {
      source_category: {
        id: sourceId
      },
      destination_account: {
        id: this.employeeFieldMapping===FyleField.VENDOR ? event.value.id : (selectedRow.categorymapping.length && selectedRow.categorymapping[0].destination_account ? selectedRow.categorymapping[0].destination_account?.id : null)
      },
      destination_expense_head: {
        id: this.employeeFieldMapping===FyleField.EMPLOYEE ? event.value.id : (selectedRow.categorymapping.length && selectedRow.categorymapping[0].destination_expense_head ? selectedRow.categorymapping[0].destination_expense_head?.id : null)
      },
      workspace: parseInt(this.workspaceService.getWorkspaceId())
    };

    this.mappingService.postCategoryMappings(categoryMappingsPayload).subscribe(() => {
      this.mappingService.getCategoryMappings(500, 0, this.getCategoryAttributeType()[0], MappingState.UNMAPPED).subscribe((response) => {
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Category Mapping saved successfully');
        this.filteredCategoryMappings = response.results;
        this.isLoading = false;
      });
    }, () => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
      this.isLoading = false;
    });
  }

  getCategoryAttributeType() {
    const attributes = [];

    if (this.reimbursableExpenseObject === IntacctReimbursableExpensesObject.EXPENSE_REPORT) {
      attributes.push('EXPENSE_TYPE');
    } else {
      attributes.push('ACCOUNT');
    }
    return attributes;
  }

  setupCategoryMapping() {
    forkJoin([
      this.mappingService.getGroupedDestinationAttributes(this.getCategoryAttributeType()),
      this.mappingService.getCategoryMappings(500, 0, this.getCategoryAttributeType()[0], MappingState.UNMAPPED)
    ]).subscribe(
      ([groupedDestResponse, categoryMappingResponse]) => {
        this.sageIntacctExpenseTypes = groupedDestResponse.EXPENSE_TYPE;
        this.sageIntacctAccounts = groupedDestResponse.ACCOUNT;
        this.filteredCategoryMappings = categoryMappingResponse.results;
        this.isLoading = false;
      }
    );
  }

  setupPage() {
    this.mappingService.getConfiguration().subscribe((response) => {
      this.employeeFieldMapping = response.employee_field_mapping;
      this.reimbursableExpenseObject = response.reimbursable_expenses_object;
      this.cccExpenseObject = response.corporate_credit_card_expenses_object;
      if (this.mappingType===IntacctErrorType.EMPLOYEE_MAPPING) {
        this.setupEmployeeMapping();
      } else if (this.mappingType===IntacctErrorType.CATEGORY_MAPPING) {
        this.setupCategoryMapping();
      }
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
