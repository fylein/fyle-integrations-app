import { Component, Input, OnInit } from '@angular/core';
import { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-skipped-export-log-table',
  templateUrl: './skipped-export-log-table.component.html',
  styleUrls: ['./skipped-export-log-table.component.scss']
})
export class SkippedExportLogTableComponent implements OnInit {

  @Input() filteredExpenseGroups: AccountingExportList [];

  constructor(
    private windowService: WindowService
  ) { }


  openUrl(url: string) {
    this.windowService.openInNewTab(url);
  }

  ngOnInit(): void {
  }

}
