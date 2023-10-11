import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AutoMapEmployeeOptions, FieldType, FyleField, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { EmployeeMapping, EmployeeMappingPost, EmployeeMappingsResponse } from 'src/app/core/models/si/db/employee-mapping.model';
import { ExtendedGenericMappingV2, GenericMappingV2, GenericMappingV2Response } from 'src/app/core/models/si/db/generic-mapping-v2.model';
import { MappingDestination } from 'src/app/core/models/si/db/mapping-destination.model';
import { MappingStats } from 'src/app/core/models/si/db/mapping.model';
import { Paginator } from 'src/app/core/models/si/misc/paginator.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
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

  isInitialSetupComplete: boolean = false;

  employeeFieldMapping: FyleField;

  autoMapEmployee: AutoMapEmployeeOptions | null;

  mappingStats: MappingStats;

  employeeMapping: GenericMappingV2Response;

  mappings: ExtendedGenericMappingV2[];

  filteredMappings: ExtendedGenericMappingV2[];

  searchTerm: string = '';

  fyleEmployeeOptions: DestinationAttribute[];

  filteredfyleEmployeeOptions: DestinationAttribute[] = [];

  sageIntacctEmployee: MappingDestination[];

  sageIntacctEmployeeOptions: MappingDestination[];

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

  constructor(
    private mappingService: SiMappingsService,
    private paginatorService: PaginatorService,
    private route: ActivatedRoute,
    private toastService: IntegrationsToastService,
    private workspaceService: SiWorkspaceService
  ) { }

  tableDropdownWidth() {
    const element = document.querySelector('.p-dropdown-panel.p-component.ng-star-inserted') as HTMLElement;
    if (element) {
      element.style.width = '300px';
    }
  }

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
    this.mappingService.getGenericMappingsV2(this.limit, this.offset, this.getAttributesFilteredByConfig()[0], this.selectedMappingFilter, this.alphabetFilter, this.mappingPageName).subscribe((intacctMappingResult: GenericMappingV2Response) => {
      this.filteredMappings = intacctMappingResult.results.concat();
      this.filteredMappingCount = this.filteredMappings.length;
      this.totalCount = intacctMappingResult.count;
      this.isLoading = false;
    });
  }

  getDropdownValue(genericMapping: ExtendedGenericMappingV2) {
    if (genericMapping.employeemapping?.length) {
      if (this.employeeFieldMapping===FyleField.VENDOR) {
        return genericMapping?.employeemapping[0].destination_vendor;
      } else if (this.employeeFieldMapping===FyleField.EMPLOYEE) {
        return genericMapping?.employeemapping[0].destination_employee;
      }
    } else if (genericMapping.categorymapping?.length) {
      if (this.employeeFieldMapping === FyleField.VENDOR) {
        return genericMapping.categorymapping[0].destination_account;
      } else if (this.employeeFieldMapping === FyleField.EMPLOYEE) {
        return genericMapping.categorymapping[0].destination_expense_head;
      }
    } else if (genericMapping.mapping?.length) {
      return genericMapping.mapping[0].destination;
    }
    return null;
  }

  save(selectedRow: ExtendedGenericMappingV2, event: any): void {
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

  getAttributesFilteredByConfig() {
    const attributes = [];

    if (this.employeeFieldMapping === 'VENDOR') {
      attributes.push('VENDOR');
    } else if (this.employeeFieldMapping === 'EMPLOYEE') {
      attributes.push('EMPLOYEE');
    }

    return attributes;
  }

  setupPage() {
    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.MAPPING);
    this.limit = paginator.limit;
    this.offset = paginator.offset;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    forkJoin([
      this.mappingService.getGroupedDestinationAttributes(this.getAttributesFilteredByConfig()),
      this.mappingService.getGenericMappingsV2(10, 0, this.getAttributesFilteredByConfig()[0], this.selectedMappingFilter, this.alphabetFilter, this.mappingPageName),
      this.mappingService.getMappingStats(FyleField.EMPLOYEE, this.getAttributesFilteredByConfig()[0])
    ]).subscribe(
      ([groupedDestResponse, employeeMappingResponse, mappingStat]) => {
        this.totalCount = employeeMappingResponse.count;
        this.fyleEmployeeOptions = this.getAttributesFilteredByConfig()[0] === 'EMPLOYEE' ? groupedDestResponse.EMPLOYEE : groupedDestResponse.VENDOR;
        this.employeeMapping = employeeMappingResponse;
        if (!this.isInitialSetupComplete) {
          this.filteredMappingCount = employeeMappingResponse.count;
        }
        this.mappings = employeeMappingResponse.results;
        this.mappingStats = mappingStat;
        this.filteredMappings = this.mappings.concat();
        this.isInitialSetupComplete = true;
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.mappingService.getConfiguration().subscribe((response) => {
      this.employeeFieldMapping = response.employee_field_mapping;
      this.autoMapEmployee = response.auto_map_employees;
      this.setupPage();
    });
  }

}
