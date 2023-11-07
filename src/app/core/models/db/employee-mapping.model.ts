import { MappingDestination } from "./mapping-destination.model";
import { MappingSource } from "./mapping-source.model";
import { MappingResult } from "./mapping.model";

export type EmployeeMapping = {
    id: number;
    source_employee: MappingSource;
    destination_employee?: MappingDestination;
    destination_vendor?: MappingDestination;
    destination_card_account?: MappingDestination;
    workspace: number;
  };

  export interface EmployeeMappingResult extends MappingResult {
    employeemapping: EmployeeMapping;
  }