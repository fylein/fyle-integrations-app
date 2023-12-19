import { Component, Input, OnInit } from '@angular/core';
import { Expense } from 'src/app/core/models/si/db/expense.model';
import { WindowService } from 'src/app/core/services/common/window.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-export-log-child-table-dialog',
  templateUrl: './export-log-child-table-dialog.component.html',
  styleUrls: ['./export-log-child-table-dialog.component.scss']
})
export class ExportLogChildTableDialogComponent implements OnInit {

  @Input() isDialogOpen: boolean;

  @Input() expenses: Expense [] = [];

  constructor(
    private windowService: WindowService
  ) { }

  openExpenseinFyle(expense_id: string) {
    const url = `${environment.fyle_app_url}/app/admin/#/view_expense/${expense_id}`;
    this.windowService.openInNewTab(url);
  }

  ngOnInit(): void {
  }

}
