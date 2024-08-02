import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { AppName, FieldType, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Mapping, MappingPost, MappingResponse, MappingStats } from 'src/app/core/models/qbd/db/qbd-mapping.model';
import { QBDFieldMappingGet } from 'src/app/core/models/qbd/qbd-configuration/qbd-field-mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { QbdFieldMappingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-field-mapping.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';

@Component({
  selector: 'app-qbd-generic-mapping',
  templateUrl: './qbd-generic-mapping.component.html',
  styleUrls: ['./qbd-generic-mapping.component.scss']
})
export class QbdGenericMappingComponent implements OnInit {

  isLoading: boolean;

  mappingStats: MappingStats;

  mappings: MappingResponse;

  filteredMappings: Mapping[];

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

  destinationHeaderName: string;

  fieldMapping: QBDFieldMappingGet;

  readonly brandingConfig = brandingConfig;

  readonly AppName = AppName;

  constructor(
    private mappingService: QbdMappingService,
    private fieldMappingService: QbdFieldMappingService,
    private route: ActivatedRoute,
    private toastService: IntegrationsToastService,
    private window: WindowService
  ) { }

  private getFilteredMappings(): void {
    this.mappingService.getMappings(this.limit, this.pageNo, this.sourceType, this.selectedMappingFilter, this.fieldMapping?.item_type).subscribe((qbdMappingResult: MappingResponse) => {
      this.filteredMappings = qbdMappingResult.results.concat();
      this.totalCount = qbdMappingResult.count;
      this.isLoading = false;
    });
  }

  getOperatingSystem(): void {
    this.operationgSystem = this.window.getOperatingSystem();
  }

  mappingSeachingFilter(searchValue: string): void {
    if (searchValue.length > 0) {
      const results: Mapping[] = this.mappings.results.filter((mapping) =>
        mapping.source_value.toLowerCase().includes(searchValue)
      );
      this.filteredMappings = results;
    } else {
      this.filteredMappings = this.mappings.results.concat();
    }
    this.totalCount = this.filteredMappings.length;
  }

  postMapping(mappingPayload: MappingPost): void {
    this.mappingService.postMappings(mappingPayload).subscribe(() => {
      this.mappingService.getMappingStats(this.sourceType, this.fieldMapping?.item_type).subscribe((mappingStat: MappingStats) => {
        this.mappingStats = mappingStat;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Changes saved successfully');
      });
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

  private setupPage(): void {
    this.isLoading = true;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    forkJoin([
      this.mappingService.getMappingStats(this.sourceType, this.fieldMapping?.item_type),
      this.mappingService.getMappings(this.limit, this.pageNo, this.sourceType, MappingState.ALL, this.fieldMapping?.item_type)
    ]).subscribe((response) => {
      this.mappingStats = response[0];
      this.mappings = response[1];
      this.filteredMappings = this.mappings.results.concat();
      this.totalCount = this.mappings.count;
      this.getOperatingSystem();
      this.isLoading = false;
    });
  }

  getFieldMapping() {
    this.destinationHeaderName = this.sourceType === 'item' ? 'Account in QuickBooks Desktop' : 'QuickBooks Desktop Credit Card Account';
    this.fieldMappingService.getQbdFieldMapping().subscribe((fieldMappingResponse : QBDFieldMappingGet) => {
      this.fieldMapping = fieldMappingResponse;
    });
  }

  ngOnInit(): void {
    this.getFieldMapping();
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.setupPage();
    });
  }

}
