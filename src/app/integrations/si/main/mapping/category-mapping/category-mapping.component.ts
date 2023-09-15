import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FieldType, MappingState, PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { CategoryMappingsResponse } from 'src/app/core/models/si/db/category-mapping-response.model';
import { CategoryMapping } from 'src/app/core/models/si/db/category-mapping.model';
import { MappingStats } from 'src/app/core/models/si/db/mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

@Component({
  selector: 'app-category-mapping',
  templateUrl: './category-mapping.component.html',
  styleUrls: ['./category-mapping.component.scss']
})
export class CategoryMappingComponent implements OnInit {

  isLoading: boolean = false;

  mappingState: MappingStats;

  mappings: CategoryMapping[];

  filteredMappings: CategoryMapping[];

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

  mappingStats: MappingStats;

  constructor(
    private mappingService: SiMappingsService,
    private route: ActivatedRoute,
    private toastService: IntegrationsToastService,
    private window: WindowService
  ) { }

  mappingStateFilter(state: MappingState): void {
    this.isLoading = true;
    this.selectedMappingFilter = state;
    this.currentPage = 1;
    this.limit = 10;
    this.pageNo = 0;
    // This.getFilteredMappings();
  }

  mappingSeachingFilter(searchValue: string) {
    if (searchValue.length > 0) {
      const results: CategoryMapping[] = this.mappings.filter((mapping) =>
        mapping.source_category.value?.toLowerCase().includes(searchValue)
      );
      this.filteredMappings = results;
    } else {
      this.filteredMappings = this.mappings.concat();
    }
    this.totalCount = this.filteredMappings.length;
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.pageNo = 0;
    this.currentPage = 1;
    // This.getFilteredMappings();
  }

  pageOffsetChanges(pageNo: number): void {
    this.isLoading = true;
    this.pageNo = pageNo;
    this.currentPage = Math.ceil(this.pageNo / this.limit)+1;
    // This.getFilteredMappings();
  }

  setupPage() {
    this.isLoading = true;
    this.sourceType = decodeURIComponent(decodeURIComponent(this.route.snapshot.params.source_field));
    this.mappingService.getCategoryMappings(10, 1).subscribe((response) => {
      this.totalCount = response.count;
      this.mappings = response.results;
      this.filteredMappings = this.mappings.concat();
    });
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
