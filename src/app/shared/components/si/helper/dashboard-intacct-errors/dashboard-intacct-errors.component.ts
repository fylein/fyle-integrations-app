import { Component, Input, OnInit } from '@angular/core';
import { ExpenseGroup } from 'src/app/core/models/si/db/expense-group.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';

@Component({
  selector: 'app-dashboard-intacct-errors',
  templateUrl: './dashboard-intacct-errors.component.html',
  styleUrls: ['./dashboard-intacct-errors.component.scss']
})
export class DashboardIntacctErrorsComponent implements OnInit {

  @Input() intacctErrorExpenses: Expense[];

  constructor() { }

  ngOnInit(): void {
  }

}
