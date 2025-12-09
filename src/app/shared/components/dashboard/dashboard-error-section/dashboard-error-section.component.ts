import { Component, Input, OnInit } from '@angular/core';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import {
  Error,
  AccountingGroupedErrors,
  AccountingGroupedErrorStat,
  ErrorModel,
  ErrorResponse,
} from 'src/app/core/models/db/error.model';
import { ExtendedGenericMapping } from 'src/app/core/models/db/extended-generic-mapping.model';
import {
  AccountingDisplayName,
  AccountingErrorType,
  AccountingField,
  AppName,
  AppUrl,
  ButtonSize,
  ButtonType,
  EmployeeFieldMapping,
  ExportErrorSourceType,
  FyleField,
  MappingState,
} from 'src/app/core/models/enum/enum.model';
import { ResolveMappingErrorProperty, trackingAppMap } from 'src/app/core/models/misc/tracking.model';
import { Expense } from 'src/app/core/models/intacct/db/expense.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { QbdDirectDestinationAttribute } from 'src/app/core/models/qbd-direct/db/qbd-direct-destination-attribuite.model';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-dashboard-error-section',
  templateUrl: './dashboard-error-section.component.html',
  styleUrls: ['./dashboard-error-section.component.scss'],
  standalone: false,
})
export class DashboardErrorSectionComponent implements OnInit {
  isLoading: boolean;

  @Input() appName: AppName;

  @Input() errors: AccountingGroupedErrors;

  @Input() destinationFieldMap: DestinationFieldMap;

  @Input() groupedErrorStat: AccountingGroupedErrorStat;

  @Input() isExportLogFetchInProgress: boolean;

  @Input() exportLogHeader: string;

  @Input() apiModuleUrl: AppUrl;

  @Input() destinationOptionsVersion: 'v1' | 'v2' = 'v2';

  @Input() errorsVersion: 'v1';

  @Input() isCategoryMappingGeneric: boolean;

  @Input() isImportItemsEnabled: boolean;

  @Input() exportKey: string = 'expense_group';

  @Input() isEmployeeMappingGeneric: boolean;

  @Input() importCodeFields: string[];

  @Input() chartOfAccounts: string[];

  @Input() exportableExpenseGroupIds: number[];

  @Input() accountingExportSummary: any;

  @Input() redirectLink: string;

  @Input() isEmployeeAndVendorAllowed: boolean = false;

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  uiExposedAppName: string;

  filteredMappings: ExtendedGenericMapping[];

  destinationOptions: DestinationAttribute[];

  ExportErrorSourceType = ExportErrorSourceType;

  sourceField: ExportErrorSourceType;

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

  alphabetFilter: string;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  employeeFieldMapping: FyleField;

  displayName: string | undefined = undefined;

  AppName = AppName;

  errorArticle: string;

  isMultiLineOption: boolean;

  detailAccountType: string[] | undefined;

  readonly brandingStyle = brandingStyle;

  get destinationAttributes(): string | string[] {
    if (this.sourceField === ExportErrorSourceType.EMPLOYEE && this.isEmployeeAndVendorAllowed) {
      return [EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR];
    }
    return this.destinationField;
  }

  get destinationFieldDisplayName(): string | undefined {
    if (this.sourceField === ExportErrorSourceType.EMPLOYEE && this.isEmployeeAndVendorAllowed) {
      return this.translocoService.translate('dashboardErrorSection.employeeOrVendorLabel');
    }
    return undefined;
  }

  constructor(
    private dashboardService: DashboardService,
    private mappingService: MappingService,
    private trackingService: TrackingService,
    public helper: HelperService,
    public windowService: WindowService,
    private translocoService: TranslocoService,
  ) {}

  get shouldShowErrorSection(): boolean {
    // TODO: Remove this once we implement the error section for all apps
    if (
      this.appName === AppName.QBO ||
      this.appName === AppName.NETSUITE ||
      this.appName === AppName.SAGE300 ||
      this.appName === AppName.INTACCT ||
      this.appName === AppName.BUSINESS_CENTRAL
    ) {
      return !!(this.exportableExpenseGroupIds?.length && this.accountingExportSummary?.total_accounting_export_count);
    }
    return true;
  }

  getSourceType() {
    return this.destinationFieldMap[this.sourceField];
  }

  getDestinationOptionsV1(errorType: AccountingErrorType): void {
    if (this.destinationField === AccountingField.ACCOUNT && this.appName === AppName.QBO) {
      this.displayName = this.isImportItemsEnabled
        ? `${AccountingDisplayName.ITEM},${AccountingDisplayName.ACCOUNT}`
        : AccountingDisplayName.ACCOUNT;
    } else {
      this.displayName = undefined;
    }

    if (this.destinationField === AccountingField.ACCOUNT && this.appName === AppName.QBD_DIRECT) {
      this.detailAccountType = this.chartOfAccounts.map((item: string) => item.replace(/\s+/g, ''));
    } else {
      this.detailAccountType = undefined;
    }

    this.mappingService
      .getPaginatedDestinationAttributes(
        this.destinationAttributes,
        undefined,
        this.displayName,
        this.appName,
        this.detailAccountType,
      )
      .subscribe((response: any) => {
        this.destinationOptions = response.results;

        this.setErrors(errorType);
      });
  }

  private setErrors(errorType: AccountingErrorType): void {
    this.errors[errorType][0].expense_attribute;
    const isCategoryMappingGeneric =
      FyleField.CATEGORY === (this.sourceField as unknown as FyleField) ? this.isCategoryMappingGeneric : false;
    this.filteredMappings = ErrorModel.getErroredMappings(
      this.errors,
      errorType,
      isCategoryMappingGeneric,
      this.isEmployeeMappingGeneric,
    );
    setTimeout(() => {
      this.isLoading = false;
    }, 100);
  }

  destinationOptionsWatcher(
    detailAccountType: string[],
    destinationOptions: QbdDirectDestinationAttribute[],
  ): DestinationAttribute[] {
    return destinationOptions.filter((account: QbdDirectDestinationAttribute) =>
      detailAccountType.includes(account.detail.account_type),
    );
  }

  private getDestinationOptionsV2(errorType: AccountingErrorType) {
    this.mappingService
      .getGroupedDestinationAttributes([this.destinationField], 'v2')
      .subscribe((groupedDestinationResponse) => {
        if (this.sourceField === 'EMPLOYEE') {
          this.destinationOptions =
            this.destinationField === FyleField.EMPLOYEE
              ? groupedDestinationResponse.EMPLOYEE
              : groupedDestinationResponse.VENDOR;
        } else if (this.sourceField === 'CATEGORY') {
          if (this.destinationField === 'EXPENSE_TYPE') {
            this.destinationOptions = groupedDestinationResponse.EXPENSE_TYPE;
          } else {
            this.destinationOptions = groupedDestinationResponse.ACCOUNT;
          }
        }

        this.setErrors(errorType);
      });
  }

  showMappingResolve(errorType: AccountingErrorType, groupedError: Error[], sourceField: ExportErrorSourceType) {
    this.isLoading = true;
    this.eventStartTime = new Date();
    this.errorType = errorType;
    this.groupedError = groupedError;
    this.sourceField = sourceField;
    this.destinationField = this.destinationFieldMap[this.sourceField];
    if ([AppName.QBD_DIRECT, AppName.QBO].includes(this.appName)) {
      this.isMultiLineOption =
        this.sourceField === ExportErrorSourceType.CATEGORY && brandingConfig.brandId !== 'co' ? true : false;
    } else {
      this.isMultiLineOption =
        this.importCodeFields?.includes(this.destinationField) && brandingConfig.brandId !== 'co' ? true : false;
    }

    if (this.destinationOptionsVersion === 'v1') {
      this.getDestinationOptionsV1(errorType);
    } else {
      this.getDestinationOptionsV2(errorType);
    }

    this.isMappingResolveVisible = true;
  }

  showErrorDialog(accountingError: Error) {
    this.isAccountingErrorDialogVisible = true;
    this.errorDetail = accountingError.error_detail;
    this.errorArticle = accountingError.article_link;
    // @ts-ignore
    this.errorExpenses = accountingError[this.exportKey]?.expenses;
  }

  closeAccountingErrorDialog(): void {
    this.isAccountingErrorDialogVisible = false;
  }

  closeMappingResolveDialog(): void {
    this.isMappingResolveVisible = false;
    this.handleResolvedMappingStat();
  }

  private formatErrors(errors: Error[]): AccountingGroupedErrors {
    return ErrorModel.formatErrors(errors);
  }

  private trackTimeTakenForResolvingMappingErrors(): void {
    if (
      this.errorType === AccountingErrorType.CATEGORY_MAPPING ||
      this.errorType === AccountingErrorType.EMPLOYEE_MAPPING
    ) {
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
          errorType: this.errorType,
        };

        this.trackingService.onErrorResolve(trackingAppMap[this.appName], properties);
      }
    }
  }

  handleResolvedMappingStat(): void {
    const errorVersion = this.appName === AppName.QBD_DIRECT ? this.appName : this.errorsVersion;
    this.dashboardService.getExportErrors(errorVersion).subscribe((errors) => {
      const argument = errorVersion === 'v1' ? errors : (errors as ErrorResponse).results;
      const newError: AccountingGroupedErrors = this.formatErrors(argument);

      if (this.errors.CATEGORY_MAPPING.length !== newError.CATEGORY_MAPPING.length) {
        const totalCount = this.groupedErrorStat.CATEGORY_MAPPING
          ? this.groupedErrorStat.CATEGORY_MAPPING.totalCount
          : this.errors.CATEGORY_MAPPING.length;

        this.groupedErrorStat.CATEGORY_MAPPING = {
          resolvedCount: totalCount - newError.CATEGORY_MAPPING.length,
          totalCount: totalCount,
        };
      }

      if (this.errors.EMPLOYEE_MAPPING.length !== newError.EMPLOYEE_MAPPING.length) {
        const totalCount = this.groupedErrorStat.EMPLOYEE_MAPPING
          ? this.groupedErrorStat.EMPLOYEE_MAPPING.totalCount
          : this.errors.EMPLOYEE_MAPPING.length;

        this.groupedErrorStat.EMPLOYEE_MAPPING = {
          resolvedCount: totalCount - newError.EMPLOYEE_MAPPING.length,
          totalCount: totalCount,
        };
      }

      this.errors = newError;
      this.trackTimeTakenForResolvingMappingErrors();
    });
  }

  ngOnInit(): void {
    this.uiExposedAppName = this.appName === AppName.QBD_DIRECT ? AppName.QBD : this.appName;
    this.employeeFieldMapping = this.destinationFieldMap.EMPLOYEE as unknown as FyleField;
    this.alphabetFilter = this.translocoService.translate('dashboardErrorSection.allFilter');
  }
}
