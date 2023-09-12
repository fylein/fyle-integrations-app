import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppName, FieldType, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Mapping, MappingPost, MappingResponse, MappingStats } from 'src/app/core/models/qbd/db/mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';

@Component({
  selector: 'app-generic-mapping',
  templateUrl: './generic-mapping.component.html',
  styleUrls: ['./generic-mapping.component.scss']
})
export class GenericMappingComponent implements OnInit {

  isLoading: boolean;

  mappingState: MappingStats;

  mappings: MappingResponse;

  sourceType: string;

  limit: number = 10;

  pageNo: number = 0;

  totalCount: number;

  selectedMappingFilter: MappingState = MappingState.ALL;

  PaginatorPage = PaginatorPage;

  currentPage: number = 1;

  searchValue: string;

  destinationFieldType = FieldType;

  appName: AppName = AppName.QBD;

  operationgSystem: string;

  constructor(
    private mappingService: QbdMappingService,
    private route: ActivatedRoute,
    private toastService: IntegrationsToastService,
    private window: WindowService
  ) { }

  private getFilteredMappings() {
    this.mappingService.getMappings(this.limit, this.pageNo, this.sourceType, this.selectedMappingFilter).subscribe((qbdMappingResult: MappingResponse) => {
      this.mappings = qbdMappingResult;
      this.totalCount = this.mappings.count;
      this.isLoading = false;
    });
  }

  getOps() {
    this.operationgSystem = this.window.getOperatingSystem();
  }

  mappingSeachingFilter(searchValue: string) {
    if (searchValue.length > 0) {
      const results: Mapping[] = this.mappings.results.filter((mapping) =>
        mapping.source_value.toLowerCase().includes(searchValue)
      );
      this.mappings.results = results;
    } else {
      this.getFilteredMappings();
    }
    this.totalCount = this.mappings.results.length;
  }

  postMapping(mappingPayload: MappingPost) {
    this.mappingService.postMappings(mappingPayload).subscribe(() => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Mapping done successfully');
    }, () => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving the mappings, please try again later');
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

  setupPage() {
    this.isLoading = true;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    forkJoin([
      this.mappingService.getMappingStats(this.sourceType),
      this.mappingService.getMappings(this.limit, this.pageNo, this.sourceType, MappingState.ALL)
    ]).subscribe((response) => {
      this.mappingState = response[0];
      this.mappings = response[1];
      this.totalCount = this.mappings.count;
      this.getOps();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
