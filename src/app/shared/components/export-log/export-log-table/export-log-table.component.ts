import { Component, Input, OnInit } from '@angular/core';
import { AccountingExportCreationType, AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { ExpenseGroupList } from 'src/app/core/models/si/db/expense-group.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-export-log-table',
  templateUrl: './export-log-table.component.html',
  styleUrls: ['./export-log-table.component.scss']
})
export class ExportLogTableComponent implements OnInit {

  @Input() filteredExpenseGroups: AccountingExportList [];

  @Input() appName: AppName;

  @Input() isExportLogTable: boolean;

  @Input() isDashboardFailed: boolean;

  visible: boolean = false;

  constructor(
    private windowService: WindowService
  ) { }

  openUrl(url: string) {
    this.windowService.openInNewTab(url);
  }

  ngOnInit(): void {
  }

}
