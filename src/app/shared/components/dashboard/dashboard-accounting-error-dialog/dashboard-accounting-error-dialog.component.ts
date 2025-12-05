import { Component, Input, OnInit } from '@angular/core';
import { Expense, ExpenseModel } from 'src/app/core/models/intacct/db/expense.model';

@Component({
    selector: 'app-dashboard-accounting-error-dialog',
    templateUrl: './dashboard-accounting-error-dialog.component.html',
    styleUrls: ['./dashboard-accounting-error-dialog.component.scss'],
    standalone: false
})
export class DashboardAccountingErrorDialogComponent implements OnInit {

  @Input() isLoading: boolean;

  @Input() errorExpenses: Expense[];

  constructor() { }

  openUrl(event: Event, expense_id: string) {
    window.open(ExpenseModel.constructViewExpenseUrl(expense_id), '_blank');
    event.stopPropagation();
  }

  ngOnInit(): void {
  }

}
