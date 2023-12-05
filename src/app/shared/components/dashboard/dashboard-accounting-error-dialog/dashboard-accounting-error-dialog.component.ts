import { Component, Input, OnInit } from '@angular/core';
import { Expense } from 'src/app/core/models/si/db/expense.model';

@Component({
  selector: 'app-dashboard-accounting-error-dialog',
  templateUrl: './dashboard-accounting-error-dialog.component.html',
  styleUrls: ['./dashboard-accounting-error-dialog.component.scss']
})
export class DashboardAccountingErrorDialogComponent implements OnInit {

  @Input() errorExpenses: Expense[];

  constructor() { }

  openUrl(event: Event, url: string) {
    window.open(url, '_blank');
    event.stopPropagation();
  }

  ngOnInit(): void {
  }

}
