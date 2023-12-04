import { Component, Input, OnInit } from '@angular/core';
import { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-dashboard-export-log-dialog',
  templateUrl: './dashboard-export-log-dialog.component.html',
  styleUrls: ['./dashboard-export-log-dialog.component.scss']
})
export class DashboardExportLogDialogComponent implements OnInit {

  @Input() exportLogHeader: string;

  @Input() isExportLogVisible: boolean;

  @Input() accountingExports: AccountingExportList[];

  @Input() isExportLogFetchInProgress: boolean;

  appName: AppName = AppName.SAGE300

  readonly dummyExpenseGroupList: AccountingExportList[] = [{
    exportedAt: new Date(),
    employee: ['a', 'b'],
    expenseType: 'Corporate Card',
    referenceNumber: '123',
    exportedAs: 'a',
    integrationUrl: 'a',
    fyleUrl: 'a',
    expenses: []
  }];

  constructor(
    private windowService: WindowService
  ) { }

  openUrl(event: any, url: string) {
    this.windowService.openInNewTab(url);
    event.stopPropagation();
  }

  ngOnInit(): void {
  }

}
