import { Component, Input, OnInit } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { AppName } from 'src/app/core/models/enum/enum.model';
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

  expenses: Expense [] = [];

  brandingConfig: BrandingConfiguration = brandingConfig;

  isChildTableVisible: boolean = false;

  constructor(
    private windowService: WindowService
  ) { }

  handleDialogClose(){
    this.isChildTableVisible = false;
  }

  displayChildTable(rowData: AccountingExportList) {
    this.expenses = rowData.expenses;
    this.isChildTableVisible = true;
  }

  openUrl(url: string) {
    this.windowService.openInNewTab(url);
    event?.stopPropagation();
  }

  ngOnInit(): void {
  }

}
