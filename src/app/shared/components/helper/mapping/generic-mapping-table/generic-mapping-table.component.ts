import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryMappingPost } from 'src/app/core/models/db/category-mapping.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EmployeeMappingPost } from 'src/app/core/models/db/employee-mapping.model';
import { ExtendedGenericMapping } from 'src/app/core/models/db/extended-generic-mapping.model';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { CorporateCreditCardExpensesObject, FyleField, IntacctReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-generic-mapping-table',
  templateUrl: './generic-mapping-table.component.html',
  styleUrls: ['./generic-mapping-table.component.scss']
})
export class GenericMappingTableComponent implements OnInit {

  @Input() filteredMappings: ExtendedGenericMapping[];

  @Input() mappingError: Error[];

  @Input() sourceField: string;

  @Input() mappingStats: MappingStats;

  @Input() destinationField: string;

  @Input() employeeFieldMapping: FyleField;

  @Input() reimbursableExpenseObject?: IntacctReimbursableExpensesObject;

  @Input() cccExpenseObject?: CorporateCreditCardExpensesObject;

  @Input() destinationOptions: DestinationAttribute[];

  isLoading: boolean = true;

  constructor(
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  tableDropdownWidth() {
    const element = document.querySelector('.p-dropdown-panel.p-component.ng-star-inserted') as HTMLElement;
    if (element) {
      element.style.width = '300px';
    }
  }

  getDropdownValue(genericMapping: ExtendedGenericMapping) {
    if (genericMapping.employeemapping?.length) {
      if (this.employeeFieldMapping===FyleField.VENDOR) {
        return genericMapping?.employeemapping[0].destination_vendor;
      } else if (this.employeeFieldMapping===FyleField.EMPLOYEE) {
        return genericMapping?.employeemapping[0].destination_employee;
      }
    } else if (genericMapping.categorymapping?.length) {
      if (this.destinationField === 'ACCOUNT') {
        return genericMapping.categorymapping[0].destination_account;
      }
        return genericMapping.categorymapping[0].destination_expense_head;

    } else if (genericMapping.mapping?.length) {
      return genericMapping.mapping[0].destination;
    }
    return null;
  }

  save(selectedRow: ExtendedGenericMapping, event: any): void {
    if (selectedRow.employeemapping) {
      const employeeMapping: EmployeeMappingPost = {
        source_employee: {
          id: selectedRow.id
        },
        destination_vendor: {
          id: this.employeeFieldMapping===FyleField.VENDOR ? event.value.id : (selectedRow.employeemapping?.length && selectedRow.employeemapping[0].destination_vendor ? selectedRow.employeemapping[0].destination_vendor?.id : null)
        },
        destination_employee: {
          id: this.employeeFieldMapping===FyleField.EMPLOYEE ? event.value.id : (selectedRow.employeemapping?.length && selectedRow.employeemapping[0].destination_employee ? selectedRow.employeemapping[0].destination_employee?.id : null)
        },
        destination_card_account: {
          id: (selectedRow.employeemapping?.length && selectedRow.employeemapping[0].destination_card_account ? selectedRow.employeemapping[0].destination_card_account?.id : null)
        },
        workspace: parseInt(this.workspaceService.getWorkspaceId())
      };
      this.mappingService.postEmployeeMappings(employeeMapping).subscribe((response) => {
        // Decrement unmapped count only for new mappings, ignore updates
        if (!selectedRow.employeemapping?.length) {
          this.mappingStats.unmapped_attributes_count -= 1;
        }

        selectedRow.employeemapping = [response];
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Employee Mapping saved successfully');
      }, () => {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
      });
    } else if (selectedRow.categorymapping) {
      const sourceId = selectedRow.id;

      const categoryMappingsPayload: CategoryMappingPost = {
        source_category: {
          id: sourceId
        },
        destination_account: {
          id: this.destinationField === 'ACCOUNT' ? event.value.id : null
        },
        destination_expense_head: {
          id: this.destinationField !== 'ACCOUNT' ? event.value.id : null
        },
        workspace: parseInt(this.workspaceService.getWorkspaceId())
      };

      this.mappingService.postCategoryMappings(categoryMappingsPayload).subscribe((response) => {
        // Decrement unmapped count only for new mappings, ignore updates
        if (!selectedRow.categorymapping?.length) {
          this.mappingStats.unmapped_attributes_count -= 1;
        }

        selectedRow.categorymapping = [response];
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Category Mapping saved successfully');
      }, () => {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
      });
    }
  }

  getTableSourceData() {
    if (this.filteredMappings) {
      return this.filteredMappings;
    } else if (this.mappingError) {
      return this.mappingError;
    }
    return [];
  }

  ngOnInit(): void {
  }

}
