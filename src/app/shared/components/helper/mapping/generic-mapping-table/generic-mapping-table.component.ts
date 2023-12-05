import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { even } from '@rxweb/reactive-form-validators';
import { CategoryMappingPost } from 'src/app/core/models/db/category-mapping.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EmployeeMappingPost } from 'src/app/core/models/db/employee-mapping.model';
import { ExtendedGenericMapping } from 'src/app/core/models/db/extended-generic-mapping.model';
import { GenericMapping, GenericMappingPost, MappingClass, MinimalMappingSetting } from 'src/app/core/models/db/generic-mapping.model';
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

  @Input() isLoading: boolean = true;

  @Input() filteredMappings: ExtendedGenericMapping[];

  @Input() mappingError: Error[];

  @Input() sourceField: string;

  @Input() mappingStats: MappingStats;

  @Input() destinationField: string;

  @Input() employeeFieldMapping: FyleField;

  @Input() reimbursableExpenseObject?: IntacctReimbursableExpensesObject;

  @Input() cccExpenseObject?: CorporateCreditCardExpensesObject;

  @Input() destinationOptions: DestinationAttribute[];

  @Input() mappingSetting: MinimalMappingSetting;

  @Input() isDashboardMappingResolve: boolean;

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
      const employeeMapping = MappingClass.constructEmployeeMappingPayload(selectedRow, event, this.employeeFieldMapping, this.workspaceService.getWorkspaceId());
      this.mappingService.postEmployeeMappings(employeeMapping).subscribe((response) => {
        this.decrementUnmappedCountIfNeeded(selectedRow.employeemapping);
        selectedRow.employeemapping = [response];
        this.displaySuccessToast('Employee Mapping saved successfully');
      }, () => {
        this.displayErrorToast();
      });
    } else if (selectedRow.categorymapping) {
      const categoryMappingsPayload = MappingClass.constructCategoryMappingPayload(selectedRow, event, this.destinationField, this.workspaceService.getWorkspaceId());

      this.mappingService.postCategoryMappings(categoryMappingsPayload).subscribe((response) => {
        this.decrementUnmappedCountIfNeeded(selectedRow.categorymapping);
        selectedRow.categorymapping = [response];
        this.displaySuccessToast('Category Mapping saved successfully');
      }, () => {
        this.displayErrorToast();
      });
    } else {
      const genericMappingPayload = MappingClass.constructGenericMappingPayload(selectedRow, event, this.mappingSetting);

      this.mappingService.postMapping(genericMappingPayload).subscribe((response: GenericMapping) => {
        this.decrementUnmappedCountIfNeeded(selectedRow.mapping);
        selectedRow.mapping = [response];
        this.displaySuccessToast('Mapping saved successfully');
      }, () => {
        this.displayErrorToast();
      });
    }
  }

  decrementUnmappedCountIfNeeded(mapping: any): void {
    if (!mapping?.length) {
      this.mappingStats.unmapped_attributes_count -= 1;
    }
  }

  displaySuccessToast(message: string): void {
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, message);
  }

  displayErrorToast(): void {
    this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
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
