import { Component, Input, OnInit } from '@angular/core';
import { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { FyleReferenceType } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-dashboard-accounting-error-dialog',
  templateUrl: './dashboard-accounting-error-dialog.component.html',
  styleUrls: ['./dashboard-accounting-error-dialog.component.scss']
})
export class DashboardAccountingErrorDialogComponent implements OnInit {

  @Input() exportLogHeader: string;

  @Input() isExportLogVisible: boolean;

  @Input() accountingExports: AccountingExportList[];

  @Input() isExportLogFetchInProgress: boolean;

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
