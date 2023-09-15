import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FieldType, MappingState, PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { MappingStats } from 'src/app/core/models/qbd/db/mapping.model';
import { MappingIntacct, MappingResponse } from 'src/app/core/models/si/db/mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

@Component({
  selector: 'app-generic-mapping',
  templateUrl: './generic-mapping.component.html',
  styleUrls: ['./generic-mapping.component.scss']
})
export class GenericMappingComponent implements OnInit {

  isLoading: boolean;

  mappingState: MappingStats;

  mappings: MappingResponse;

  filteredMappings: MappingIntacct[];

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

  getOps() {
    this.operationgSystem = this.window.getOperatingSystem();
  }

  // PageSizeChanges(limit: number): void {
  //   This.isLoading = true;
  //   This.limit = limit;
  //   This.pageNo = 0;
  //   This.currentPage = 1;
  //   This.getFilteredMappings();
  // }

  // PageOffsetChanges(pageNo: number): void {
  //   This.isLoading = true;
  //   This.pageNo = pageNo;
  //   This.currentPage = Math.ceil(this.pageNo / this.limit)+1;
  //   This.getFilteredMappings();
  // }

  // MappingStateFilter(state: MappingState): void {
  //   This.isLoading = true;
  //   This.selectedMappingFilter = state;
  //   This.currentPage = 1;
  //   This.limit = 10;
  //   This.pageNo = 0;
  //   This.getFilteredMappings();
  // }

  setupPage() {
    this.isLoading = true;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    // ForkJoin([
    //   This.mappingService.getMappingStats(this.sourceType),
    //   This.mappingService.getMappings(this.limit, this.pageNo, this.sourceType, MappingState.ALL)
    // ]).subscribe((response) => {
    //   This.mappingState = response[0];
    //   This.mappings = response[1];
    //   This.filteredMappings = this.mappings.results.concat();
    //   This.totalCount = this.mappings.count;
    //   This.getOps();
    //   This.isLoading = false;
    // });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
