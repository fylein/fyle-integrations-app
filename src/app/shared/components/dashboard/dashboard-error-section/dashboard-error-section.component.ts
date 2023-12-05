import { Component, Input, OnInit } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';
import { Error, AccountingGroupedErrors, AccountingGroupedErrorStat } from 'src/app/core/models/db/error.model';
import { AccountingErrorType, AppName } from 'src/app/core/models/enum/enum.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';

@Component({
  selector: 'app-dashboard-error-section',
  templateUrl: './dashboard-error-section.component.html',
  styleUrls: ['./dashboard-error-section.component.scss']
})
export class DashboardErrorSectionComponent implements OnInit {

  @Input() appName: AppName;

  @Input() errors: AccountingGroupedErrors;

  @Input() groupedErrorStat: AccountingGroupedErrorStat;

  errorDialogVisible: boolean = false;

  errorDetail: string;

  errorExpenses: Expense[] = [];

  eventStartTime: Date;

  errorType: AccountingErrorType;

  groupedError: Error[];

  isMappingResolveVisible: boolean = false;

  ErrorType = AccountingErrorType;

  readonly brandingConfig = brandingConfig;

  constructor() { }

  showMappingResolve(errorType: AccountingErrorType, groupedError: Error[]) {
    this.eventStartTime = new Date();
    this.errorType = errorType;
    this.groupedError = groupedError;
    this.isMappingResolveVisible = true;
  }

  showErrorDialog(accountingError: Error) {
    this.errorDialogVisible = true;
    this.errorDetail = accountingError.error_detail;
    this.errorExpenses = accountingError.expense_group?.expenses;
  }

  ngOnInit(): void {
  }

}
