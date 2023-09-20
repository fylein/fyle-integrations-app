import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FieldType, MappingState, PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { MappingStats } from 'src/app/core/models/qbd/db/mapping.model';
import { Configuration } from 'src/app/core/models/db/configuration.model';
import { MappingSetting, MappingSettingResponse, MinimalMappingSetting } from 'src/app/core/models/si/db/mapping-setting.model';
import { MappingIntacct, MappingResponse } from 'src/app/core/models/si/db/mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { TitleCasePipe } from '@angular/common';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';

@Component({
  selector: 'app-generic-mapping',
  templateUrl: './generic-mapping.component.html',
  styleUrls: ['./generic-mapping.component.scss']
})
export class GenericMappingComponent implements OnInit {

  isLoading: boolean;

  configuration: Configuration;

  mappingSetting: MinimalMappingSetting;

  mappingStats: MappingStats;

  mappings: MappingSettingResponse;

  filteredMappings: MappingSetting[];

  page: string;

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
    private route: ActivatedRoute,
    private toastService: IntegrationsToastService,
    private window: WindowService,
    private mappingService: SiMappingsService
  ) { }

  private getFilteredMappings() {
    // This.mappingService.getEmployeeMappings(this.limit, this.pageNo, this.getAttributesFilteredByConfig()[0], this.selectedMappingFilter).subscribe((intacctMappingResult: EmployeeMappingsResponse) => {
    //   This.filteredMappings = intacctMappingResult.results.concat();
    //   This.filteredMappingCount = this.filteredMappings.length;
    //   This.isLoading = false;
    // });
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
    // If (searchValue.length > 0) {
    //   Const results: EmployeeMappingResult[] = this.mappings.filter((mapping) =>
    //     Mapping.value?.toLowerCase().includes(searchValue)
    //   );
    //   This.filteredMappings = results;
    // } else {
    //   This.filteredMappings = this.mappings.concat();
    // }
    // This.filteredMappingCount = this.filteredMappings.length;
  }

  setupPage() {
    this.isLoading = true;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    forkJoin([
      this.mappingService.getConfiguration(),
      this.mappingService.getMappingSettings()
    ]).subscribe((response) => {
      const mappingSetting = response[1].results.filter((mappingSetting) => mappingSetting.source_field === this.sourceType.toUpperCase());
      this.mappingSetting = mappingSetting[0];
      this.page = `${new TitleCasePipe().transform(new SnakeCaseToSpaceCasePipe().transform(this.mappingSetting.source_field))} Mapping`;
      this.configuration = response[0];
      this.mappings = response[1];
      this.filteredMappings = this.mappings.results.concat();
      this.totalCount = this.mappings.count;

      this.mappingService.getMappingStats(this.sourceType.toUpperCase(), this.mappingSetting.destination_field).subscribe((mappingStats: MappingStats) => {
        this.mappingStats = mappingStats;
      });

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
