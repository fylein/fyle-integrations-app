import { Component, Input, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { brandingConfig } from 'src/app/branding/branding-config';
import { DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { Error, AccountingGroupedErrors, AccountingGroupedErrorStat } from 'src/app/core/models/db/error.model';
import { ExtendedGenericMapping, GenericMappingResponse } from 'src/app/core/models/db/extended-generic-mapping.model';
import { AccountingErrorType, AppName, MappingState } from 'src/app/core/models/enum/enum.model';
import { ResolveMappingErrorProperty } from 'src/app/core/models/misc/tracking.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-dashboard-error-section',
  templateUrl: './dashboard-error-section.component.html',
  styleUrls: ['./dashboard-error-section.component.scss']
})
export class DashboardErrorSectionComponent implements OnInit {

  isLoading: boolean;

  @Input() appName: AppName;

  @Input() errors: AccountingGroupedErrors;

  @Input() destinationFieldMap: DestinationFieldMap;

  @Input() groupedErrorStat: AccountingGroupedErrorStat;

  @Input() isExportLogFetchInProgress: boolean;

  @Input() exportLogHeader: string;

  filteredMappings: ExtendedGenericMapping[];

  destinationOptions: DestinationAttribute[];

  sourceField: string;

  destinationField: string;

  isAccountingErrorDialogVisible: boolean = false;

  errorDetail: string;

  errorExpenses: Expense[] = [];

  eventStartTime: Date;

  errorType: AccountingErrorType;

  groupedError: Error[];

  isMappingResolveVisible: boolean = false;

  ErrorType = AccountingErrorType;

  selectedMappingFilter: MappingState = MappingState.ALL;

  alphabetFilter: string = 'All';

  readonly brandingConfig = brandingConfig;

  getExportErrors$: Observable<Error[]> = this.dashboardService.getExportErrors();

  constructor(
    private dashboardService: DashboardService,
    private mappingService: MappingService,
    private trackingService: TrackingService
  ) { }

  getSourceType() {
    return this.destinationFieldMap[this.sourceField];
  }

  private getOptions() {
    const groupedDestinationAttributes$ = this.mappingService.getGroupedDestinationAttributes([this.destinationField]);
    const genericMappings$ = this.mappingService.getGenericMappingsV2(100, 0, this.destinationField, this.selectedMappingFilter, this.alphabetFilter, this.sourceField);

    forkJoin([groupedDestinationAttributes$, genericMappings$]).subscribe(
      ([groupedDestinationResponse, genericMappingsResponse]: [any, GenericMappingResponse]) => {
        if (this.sourceField === 'EMPLOYEE') {
          this.destinationOptions = this.destinationField ? groupedDestinationResponse.EMPLOYEE : groupedDestinationResponse.VENDOR;
        }
        if (this.sourceField === 'CATEGORY') {
          if (this.destinationField === 'EXPENSE_TYPE') {
            this.destinationOptions = groupedDestinationResponse.EXPENSE_TYPE;
          } else {
            this.destinationOptions = groupedDestinationResponse.ACCOUNT;
          }
        }

        this.filteredMappings = genericMappingsResponse.results.concat();

        this.isLoading = false;
      }
    );
  }

  showMappingResolve(errorType: AccountingErrorType, groupedError: Error[], sourceField: string) {
    this.eventStartTime = new Date();
    this.errorType = errorType;
    this.groupedError = groupedError;
    this.sourceField = sourceField;
    this.getOptions();
    this.destinationField = this.getSourceType();
    this.isMappingResolveVisible = true;
  }

  showErrorDialog(accountingError: Error) {
    this.isAccountingErrorDialogVisible = true;
    this.errorDetail = accountingError.error_detail;
    this.errorExpenses = accountingError.expense_group?.expenses;
  }

  private formatErrors(errors: Error[]): AccountingGroupedErrors {
    return errors.reduce((groupedErrors: AccountingGroupedErrors, error: Error) => {
      const group: Error[] = groupedErrors[error.type] || [];
      group.push(error);
      groupedErrors[error.type] = group;

      return groupedErrors;
    }, {
      [AccountingErrorType.EMPLOYEE_MAPPING]: [],
      [AccountingErrorType.CATEGORY_MAPPING]: [],
      [AccountingErrorType.SAGE300_ERROR]: []
    });
  }

  private trackTimeTakenForResolvingMappingErrors(): void {
    if (this.errorType === AccountingErrorType.CATEGORY_MAPPING || this.errorType === AccountingErrorType.EMPLOYEE_MAPPING) {
      const error = this.groupedErrorStat[this.errorType];

      if (error?.totalCount && error?.totalCount > 0) {
        const properties: ResolveMappingErrorProperty = {
          resolvedCount: error?.resolvedCount ? error?.resolvedCount : 0,
          totalCount: error?.totalCount ? error?.totalCount : 0,
          unresolvedCount: error?.totalCount - error?.resolvedCount,
          resolvedAllErrors: error.resolvedCount === error.totalCount,
          startTime: this.eventStartTime,
          endTime: new Date(),
          durationInSeconds: Math.floor((new Date().getTime() - this.eventStartTime.getTime()) / 1000),
          errorType: this.errorType
        };

        this.trackingService.onErrorResolve(properties);
      }
    }
  }

  showErrorStats(): void {
    this.getExportErrors$.subscribe((errors) => {
      const newError: AccountingGroupedErrors = this.formatErrors(errors);

      if (this.errors.CATEGORY_MAPPING.length !== newError.CATEGORY_MAPPING.length) {
        const totalCount = this.groupedErrorStat.CATEGORY_MAPPING ? this.groupedErrorStat.CATEGORY_MAPPING.totalCount : this.errors.CATEGORY_MAPPING.length;

        this.groupedErrorStat.CATEGORY_MAPPING = {
          resolvedCount: totalCount - newError.CATEGORY_MAPPING.length,
          totalCount: totalCount
        };
      }

      if (this.errors.EMPLOYEE_MAPPING.length !== newError.EMPLOYEE_MAPPING.length) {
        const totalCount = this.groupedErrorStat.EMPLOYEE_MAPPING ? this.groupedErrorStat.EMPLOYEE_MAPPING.totalCount : this.errors.EMPLOYEE_MAPPING.length;

        this.groupedErrorStat.EMPLOYEE_MAPPING = {
          resolvedCount: totalCount - newError.EMPLOYEE_MAPPING.length,
          totalCount: totalCount
        };
      }

      this.errors = newError;
      this.trackTimeTakenForResolvingMappingErrors();
    });
  }

  ngOnInit(): void {
  }

}
