import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FieldType, FyleField, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Configuration } from 'src/app/core/models/si/db/configuration.model';
import { EmployeeMapping, EmployeeMappingPost, EmployeeMappingResult, EmployeeMappingsResponse } from 'src/app/core/models/si/db/employee-mapping.model';
import { MappingDestination } from 'src/app/core/models/si/db/mapping-destination.model';
import { MappingSource } from 'src/app/core/models/si/db/mapping-source.model';
import { MappingIntacct, MappingPost, MappingResponse, MappingStats } from 'src/app/core/models/si/db/mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-employee-mapping',
  templateUrl: './employee-mapping.component.html',
  styleUrls: ['./employee-mapping.component.scss']
})
export class EmployeeMappingComponent implements OnInit {

  isLoading: boolean = true;

  isInitialSetupComplete: boolean = false;

  employeeFieldMapping: FyleField;

  mappingStats: MappingStats;

  employeeMapping: EmployeeMappingsResponse;

  mappings: EmployeeMappingResult[];

  searchTerm: string = '';

  fyleEmployeeOptions: DestinationAttribute[];

  filteredfyleEmployeeOptions: DestinationAttribute[] = [];

  filteredMappings: EmployeeMappingResult[];

  sageIntacctEmployee: MappingDestination[];

  sageIntacctEmployeeOptions: MappingDestination[];

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
    }, error => {
      that.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong, please try again');
    });
  }

  private getFilteredMappings() {
    this.mappingService.getEmployeeMappings(this.limit, this.pageNo, this.getAttributesFilteredByConfig()[0], this.selectedMappingFilter).subscribe((intacctMappingResult: EmployeeMappingsResponse) => {
      this.filteredMappings = intacctMappingResult.results.concat();
      this.filteredMappingCount = this.filteredMappings.length;
      this.isLoading = false;
    });
  }

  getDropdownValue(employeeMapping: EmployeeMapping[]) {
    if (employeeMapping.length) {
      if (this.employeeFieldMapping===FyleField.VENDOR) {
        return employeeMapping[0].destination_vendor;
      } else if (this.employeeFieldMapping===FyleField.EMPLOYEE) {
        return employeeMapping[0].destination_employee;
      }
    }
    return null;
  }

  save(selectedRow: EmployeeMappingResult, event: any): void {
    const employeeMapping: EmployeeMappingPost = {
      source_employee: {
        id: selectedRow.employeemapping[0].source_employee.id
      },
      destination_vendor: {
        id: this.employeeFieldMapping===FyleField.VENDOR ? event.value.id : (selectedRow.employeemapping && selectedRow.employeemapping[0].destination_vendor ? selectedRow.employeemapping[0].destination_vendor?.id : null)
      },
      destination_employee: {
        id: this.employeeFieldMapping===FyleField.EMPLOYEE ? event.value.id : (selectedRow.employeemapping && selectedRow.employeemapping[0].destination_employee ? selectedRow.employeemapping[0].destination_employee?.id : null)
      },
      destination_card_account: {
        id: (selectedRow.employeemapping && selectedRow.employeemapping[0].destination_card_account ? selectedRow.employeemapping[0].destination_card_account?.id : null)
      },
      workspace: parseInt(this.workspaceService.getWorkspaceId())
    };
    this.mappingService.postEmployeeMappings(employeeMapping).subscribe(() => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Employee Mapping saved successfully');
      this.setupPage();
    }, err => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong');
    });
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

  mappingSearchFilter(searchValue: string) {
    if (searchValue.length > 0) {
      const results: EmployeeMappingResult[] = this.mappings.filter((mapping) =>
        mapping.value?.toLowerCase().includes(searchValue)
      );
      this.filteredMappings = results;
    } else {
      this.filteredMappings = this.mappings.concat();
    }
    this.filteredMappingCount = this.filteredMappings.length;
  }

  postMapping(mappingPayload: EmployeeMapping) {
    this.mappingService.postEmployeeMappings(mappingPayload).subscribe(() => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Mapping done successfully');
    }, () => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving the mappings, please try again later');
    });
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
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    forkJoin([
      this.mappingService.getGroupedDestinationAttributes(this.getAttributesFilteredByConfig()),
      this.mappingService.getEmployeeMappings(10, 1, this.getAttributesFilteredByConfig()[0], this.selectedMappingFilter),
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
      this.setupPage();
    });
  }

}
