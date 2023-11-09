import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { CorporateCreditCardExpensesObject, FyleField, IntacctReimbursableExpensesObject, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { CategoryMappingPost } from 'src/app/core/models/si/db/category-mapping.model';
import { EmployeeMappingPost } from 'src/app/core/models/si/db/employee-mapping.model';
import { Error } from 'src/app/core/models/si/db/error.model';
import { ExtendedGenericMappingV2 } from 'src/app/core/models/si/db/generic-mapping-v2.model';
import { MappingStats } from 'src/app/core/models/si/db/mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-generic-mapping-table',
  templateUrl: './generic-mapping-table.component.html',
  styleUrls: ['./generic-mapping-table.component.scss']
})
export class GenericMappingTableComponent implements OnInit {

  @Input() filteredMappings: ExtendedGenericMappingV2[];

  @Input() mappingError: Error[];

  @Input() mappingPageName: string;

  @Input() mappingStats: MappingStats;

  @Input() destinationField: string;

  @Input() employeeFieldMapping: FyleField;

  @Input() reimbursableExpenseObject?: IntacctReimbursableExpensesObject;

  @Input() cccExpenseObject?: CorporateCreditCardExpensesObject;

  @Input() destinationOptions: DestinationAttribute[];

  isLoading: boolean = true;

  constructor(
    private mappingService: SiMappingsService,
    private toastService: IntegrationsToastService,
    private workspaceService: SiWorkspaceService
  ) { }

  tableDropdownWidth() {
    const element = document.querySelector('.p-dropdown-panel.p-component.ng-star-inserted') as HTMLElement;
    if (element) {
      element.style.width = '300px';
    }
  }

  getDropdownValue(genericMapping: ExtendedGenericMappingV2) {
    if (genericMapping.employeemapping?.length) {
      if (this.employeeFieldMapping===FyleField.VENDOR) {
        return genericMapping?.employeemapping[0].destination_vendor;
      } else if (this.employeeFieldMapping===FyleField.EMPLOYEE) {
        return genericMapping?.employeemapping[0].destination_employee;
      }
    } else if (genericMapping.categorymapping?.length) {
      if (this.destinationField === 'ACCOUNT') {
        return genericMapping.categorymapping[0].destination_account;
      } else {
        return genericMapping.categorymapping[0].destination_expense_head;
      }
    } else if (genericMapping.mapping?.length) {
      return genericMapping.mapping[0].destination;
    }
    return null;
  }

  save(selectedRow: ExtendedGenericMappingV2, event: any): void {
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

  setupTable() {
    if (this.filteredMappings) {
      return this.filteredMappings;
    } else if (this.mappingError) {
      return this.mappingError
    }
    return [];
  }

  ngOnInit(): void {
  }

}
