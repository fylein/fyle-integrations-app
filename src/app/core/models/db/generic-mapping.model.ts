
import { FyleField } from "../enum/enum.model";
import type { CategoryMappingPost } from "./category-mapping.model";
import type { DestinationAttribute } from "./destination-attribute.model";
import type { EmployeeMappingPost } from "./employee-mapping.model";
import type { ExpenseAttribute } from "./expense-attribute.model";
import type { ExtendedGenericMapping } from "./extended-generic-mapping.model";

export interface GenericMappingPost {
    source_type: string;
    source_value: string;
    destination_type: string;
    destination_id: string;
    destination_value: string;
}

export interface GenericMapping {
  created_at: Date;
  destination: DestinationAttribute;
  destination_type: string;
  id: number;
  source: ExpenseAttribute;
  source_type: string,
  updated_at: Date;
  workspace: number;
}

export interface MinimalMappingSetting {
  source_field: string;
  destination_field: string;
}

export class MappingClass {

  static constructEmployeeMappingPayload(selectedRow: ExtendedGenericMapping, event: any, employeeFieldMapping: FyleField, workspaceId: string) {
    const employeeMapping: EmployeeMappingPost = {
      source_employee: {
        id: selectedRow.id
      },
      destination_vendor: {
        id: employeeFieldMapping===FyleField.VENDOR ? event.value.id : (selectedRow.employeemapping?.length && selectedRow.employeemapping[0].destination_vendor ? selectedRow.employeemapping[0].destination_vendor?.id : null)
      },
      destination_employee: {
        id: employeeFieldMapping===FyleField.EMPLOYEE ? event.value.id : (selectedRow.employeemapping?.length && selectedRow.employeemapping[0].destination_employee ? selectedRow.employeemapping[0].destination_employee?.id : null)
      },
      destination_card_account: {
        id: (selectedRow.employeemapping?.length && selectedRow.employeemapping[0].destination_card_account ? selectedRow.employeemapping[0].destination_card_account?.id : null)
      },
      workspace: parseInt(workspaceId)
    };

    return employeeMapping;
  }

  static constructCategoryMappingPayload(selectedRow: ExtendedGenericMapping, event: any, destinationField: string, workspaceId: string) {
    const sourceId = selectedRow.id;

    const categoryMappingsPayload: CategoryMappingPost = {
      source_category: {
        id: sourceId
      },
      destination_account: {
        id: destinationField === 'ACCOUNT' ? event.value.id : null
      },
      destination_expense_head: {
        id: destinationField !== 'ACCOUNT' ? event.value.id : null
      },
      workspace: parseInt(workspaceId)
    };

    return categoryMappingsPayload;
  }

  static constructGenericMappingPayload(selectedRow: ExtendedGenericMapping, event: any, mappingSetting: MinimalMappingSetting) {
    const genericMappingPayload: GenericMappingPost = {
      source_type: mappingSetting.source_field,
      source_value: selectedRow.value,
      destination_type: mappingSetting.destination_field,
      destination_id: event.value.destination_id,
      destination_value: event.value.value
    };

    return genericMappingPayload;
  }
}