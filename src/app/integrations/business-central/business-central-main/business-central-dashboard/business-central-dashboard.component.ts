import { Component, OnInit } from '@angular/core';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { DestinationFieldMap } from 'src/app/core/models/db/dashboard.model';
import { AccountingGroupedErrorStat, AccountingGroupedErrors } from 'src/app/core/models/db/error.model';
import { AccountingErrorType, AppName } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-business-central-dashboard',
  templateUrl: './business-central-dashboard.component.html',
  styleUrls: ['./business-central-dashboard.component.scss']
})
export class BusinessCentralDashboardComponent implements OnInit {

  isLoading: boolean = true;

  appName: AppName = AppName.BUSINESS_CENTRAL;

  isImportInProgress: boolean = true;

  isExportInProgress: boolean = false;

  exportableAccountingExportIds: number[] = [];

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary;

  processedCount: number = 0;

  errors: AccountingGroupedErrors;

  groupedErrorStat: AccountingGroupedErrorStat = {
    [AccountingErrorType.EMPLOYEE_MAPPING]: null,
    [AccountingErrorType.CATEGORY_MAPPING]: null
  };

  readonly destinationFieldMap : DestinationFieldMap = {
    'EMPLOYEE': 'VENDOR',
    'CATEGORY': 'ACCOUNT'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
