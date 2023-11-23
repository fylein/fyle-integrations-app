import { Component, Input, OnInit } from '@angular/core';
import { Expense } from 'src/app/core/models/si/db/expense.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-export-log-dialog',
  templateUrl: './export-log-dialog.component.html',
  styleUrls: ['./export-log-dialog.component.scss']
})
export class ExportLogDialogComponent implements OnInit {

  @Input() visible: boolean;

  @Input() expenses: Expense [] = [];

  constructor() { }

  openExpenseinFyle(expense_id: string) {
    const url = `${environment.fyle_app_url}/app/main/#/view_expense/${expense_id}`;
    window.open(url, '_blank');
  }

  ngOnInit(): void {
  }

}
