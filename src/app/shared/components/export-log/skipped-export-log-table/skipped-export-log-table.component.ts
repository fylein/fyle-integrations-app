import { Component, Input, OnInit } from '@angular/core';
import { SkipExportList } from 'src/app/core/models/si/db/expense-group.model';
import { Expense } from 'src/app/core/models/si/db/expense.model';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-skipped-export-log-table',
  templateUrl: './skipped-export-log-table.component.html',
  styleUrls: ['./skipped-export-log-table.component.scss']
})
export class SkippedExportLogTableComponent implements OnInit {

  @Input() filteredExpense: SkipExportList[];

  constructor(
    private windowService: WindowService
  ) { }


  openUrl(url: string) {
    this.windowService.openInNewTab(url);
  }

  ngOnInit(): void {
  }

}
