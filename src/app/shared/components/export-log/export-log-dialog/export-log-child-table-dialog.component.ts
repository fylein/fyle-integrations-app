import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Expense } from 'src/app/core/models/intacct/db/expense.model';
import type { WindowService } from 'src/app/core/services/common/window.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-export-log-child-table-dialog',
  templateUrl: './export-log-child-table-dialog.component.html',
  styleUrls: ['./export-log-child-table-dialog.component.scss']
})
export class ExportLogChildTableDialogComponent implements OnInit {

  @Input() isDialogOpen: boolean;

  @Input() expenses: Expense[] = [];

  @Output() hideChildTable = new EventEmitter<void>();

  constructor(
    private windowService: WindowService
  ) { }

  openExpenseinFyle(expense_id: string, org_id: string) {
    const url = `${environment.fyle_app_url}/app/admin/#/view_expense/${expense_id}?org_id=${org_id}`;
    this.windowService.openInNewTab(url);
  }

  handleDialogClose() {
    this.hideChildTable.emit();
  }

  ngOnInit(): void {
  }

}
