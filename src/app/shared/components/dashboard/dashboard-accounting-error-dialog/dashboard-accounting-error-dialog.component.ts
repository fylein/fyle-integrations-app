import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { brandingContent } from 'src/app/branding/branding-config';
import type { Expense } from 'src/app/core/models/intacct/db/expense.model';
import { ExpenseModel } from 'src/app/core/models/intacct/db/expense.model';

@Component({
  selector: 'app-dashboard-accounting-error-dialog',
  templateUrl: './dashboard-accounting-error-dialog.component.html',
  styleUrls: ['./dashboard-accounting-error-dialog.component.scss']
})
export class DashboardAccountingErrorDialogComponent implements OnInit {

  @Input() isLoading: boolean;

  @Input() errorExpenses: Expense[];

  readonly brandingContent = brandingContent.exportLog.tableHeaders;

  readonly brandingContentCommon = brandingContent.common;

  constructor() { }

  openUrl(event: Event, expense_id: string) {
    window.open(ExpenseModel.constructViewExpenseUrl(expense_id), '_blank');
    event.stopPropagation();
  }

  ngOnInit(): void {
  }

}
