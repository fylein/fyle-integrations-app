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

  // pageSizeChanges(limit: number): void {
  //   this.isLoading = true;
  //   this.limit = limit;
  //   this.pageNo = 0;
  //   this.currentPage = 1;
  //   this.getFilteredMappings();
  // }

  // pageOffsetChanges(pageNo: number): void {
  //   this.isLoading = true;
  //   this.pageNo = pageNo;
  //   this.currentPage = Math.ceil(this.pageNo / this.limit)+1;
  //   this.getFilteredMappings();
  // }

  // mappingStateFilter(state: MappingState): void {
  //   this.isLoading = true;
  //   this.selectedMappingFilter = state;
  //   this.currentPage = 1;
  //   this.limit = 10;
  //   this.pageNo = 0;
  //   this.getFilteredMappings();
  // }

  setupPage() {
    this.isLoading = true;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    // forkJoin([
    //   this.mappingService.getMappingStats(this.sourceType),
    //   this.mappingService.getMappings(this.limit, this.pageNo, this.sourceType, MappingState.ALL)
    // ]).subscribe((response) => {
    //   this.mappingState = response[0];
    //   this.mappings = response[1];
    //   this.filteredMappings = this.mappings.results.concat();
    //   this.totalCount = this.mappings.count;
    //   this.getOps();
    //   this.isLoading = false;
    // });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
