import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FieldType, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { EmployeeMapping } from 'src/app/core/models/si/db/employee-mapping.model';
import { MappingIntacct, MappingPost, MappingResponse, MappingStats } from 'src/app/core/models/si/db/mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

@Component({
  selector: 'app-employee-mapping',
  templateUrl: './employee-mapping.component.html',
  styleUrls: ['./employee-mapping.component.scss']
})
export class EmployeeMappingComponent implements OnInit {

  isLoading: boolean = false;

  mappingState: MappingStats;

  mappings: MappingResponse;

  filteredMappings: EmployeeMapping[];

  sourceType: string;

  limit: number = 10;

  pageNo: number = 0;

  totalCount: number;

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
    private window: WindowService
  ) { }

  private getFilteredMappings() {
    this.mappingService.getEmployeeMappings(this.limit, this.pageNo).subscribe((intacctMappingResult: MappingResponse) => {
      this.filteredMappings = intacctMappingResult.results.concat();
      this.totalCount = this.mappings.count;
      this.isLoading = false;
    });
  }

  mappingStateFilter(state: MappingState): void {
    this.isLoading = true;
    this.selectedMappingFilter = state;
    this.currentPage = 1;
    this.limit = 10;
    this.pageNo = 0;
    this.getFilteredMappings();
  }

  mappingSeachingFilter(searchValue: string) {
    if (searchValue.length > 0) {
      const results: EmployeeMapping[] = this.mappings.results.filter((mapping) =>
        mapping.source_employee.value?.toLowerCase().includes(searchValue)
      );
      this.filteredMappings = results;
    } else {
      this.filteredMappings = this.mappings.results.concat();
    }
    this.totalCount = this.filteredMappings.length;
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

  postMapping(mappingPayload: EmployeeMapping) {
    this.mappingService.postEmployeeMappings(mappingPayload).subscribe(() => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Mapping done successfully');
    }, () => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving the mappings, please try again later');
    });
  }

  setupPage() {
    this.isLoading = true;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    this.mappingService.getEmployeeMappings(10,1).subscribe((response) => {
      console.log(response);
      this.mappings = response;
      this.filteredMappings = this.mappings.results.concat();
    });
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
