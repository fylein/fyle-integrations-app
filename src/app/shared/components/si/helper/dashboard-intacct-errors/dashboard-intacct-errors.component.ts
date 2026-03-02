import { Component, Input, OnInit } from '@angular/core';
import { ExpenseGroup } from 'src/app/core/models/intacct/db/expense-group.model';
import { Expense } from 'src/app/core/models/intacct/db/expense.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-dashboard-intacct-errors',
    templateUrl: './dashboard-intacct-errors.component.html',
    styleUrls: ['./dashboard-intacct-errors.component.scss'],
    standalone: false
})
export class DashboardIntacctErrorsComponent implements OnInit {

  @Input() intacctErrorExpenses: Expense[];

  constructor() { }

  openUrl(event: Event, expense_id: string) {
    const url = `${environment.fyle_app_url}/app/admin/company_expenses?txnId=${expense_id}`;
    window.open(url, '_blank');
    event.stopPropagation();
  }

  ngOnInit(): void {
  }

}
