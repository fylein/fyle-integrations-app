import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, FieldType, MappingState, PaginatorPage, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QBDMapping, QBDMappingPost, QBDMappingResponse, QBDMappingStats } from 'src/app/core/models/qbd/db/qbd-mapping.model';
import { QBDFieldMappingGet } from 'src/app/core/models/qbd/qbd-configuration/qbd-field-mapping.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { QbdFieldMappingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-field-mapping.service';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-generic-mapping',
  templateUrl: './qbd-generic-mapping.component.html',
  styleUrls: ['./qbd-generic-mapping.component.scss']
})
export class QbdGenericMappingComponent implements OnInit {

  isLoading: boolean;

  mappingStats: QBDMappingStats;

  mappings: QBDMappingResponse;

  filteredMappings: QBDMapping[];

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

  readonly brandingStyle = brandingStyle;

  constructor(
    private mappingService: QbdMappingService,
    private fieldMappingService: QbdFieldMappingService,
    private route: ActivatedRoute,
    private toastService: IntegrationsToastService,
    private window: WindowService,
    private translocoService: TranslocoService
  ) { }

  private getFilteredMappings(): void {
    this.mappingService.getMappings(this.limit, this.pageNo, this.sourceType, this.selectedMappingFilter, this.fieldMapping?.item_type).subscribe((qbdMappingResult: QBDMappingResponse) => {
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
      const results: QBDMapping[] = this.mappings.results.filter((mapping) =>
        mapping.source_value.toLowerCase().includes(searchValue)
      );
      this.filteredMappings = results;
    } else {
      this.filteredMappings = this.mappings.results.concat();
    }
    this.totalCount = this.filteredMappings.length;
  }

  postMapping(mappingPayload: QBDMappingPost): void {
    this.mappingService.postMappings(mappingPayload).subscribe(() => {
      this.mappingService.getMappingStats(this.sourceType, this.fieldMapping?.item_type).subscribe((mappingStat: QBDMappingStats) => {
        this.mappingStats = mappingStat;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qbdGenericMapping.changesSavedSuccessfully'));
      });
    }, () => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdGenericMapping.errorSavingMappings'));
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
    this.destinationHeaderName = this.sourceType === 'item' ? this.translocoService.translate('qbdGenericMapping.accountInQBD') : this.translocoService.translate('qbdGenericMapping.qbdCreditCardAccount');
    forkJoin([
      this.mappingService.getMappingStats(this.sourceType, this.fieldMapping?.item_type),
      this.mappingService.getMappings(this.limit, this.pageNo, this.sourceType, MappingState.ALL, this.fieldMapping?.item_type),
      this.fieldMappingService.getQbdFieldMapping()
    ]).subscribe((response) => {
      this.mappingStats = response[0];
      this.mappings = response[1];
      this.fieldMapping = response[2];
      this.filteredMappings = this.mappings.results.concat();
      this.totalCount = this.mappings.count;
      this.getOperatingSystem();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.setupPage();
    });
  }

}
