import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import type { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import type { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { AppName } from 'src/app/core/models/enum/enum.model';
import type { Expense } from 'src/app/core/models/intacct/db/expense.model';
import type { WindowService } from 'src/app/core/services/common/window.service';

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

  AppName = AppName;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.exportLog;

  constructor(
    private windowService: WindowService
  ) { }

  handleDialogClose(){
    this.isChildTableVisible = false;
  }

  displayChildTable(rowData: AccountingExportList) {
    if (this.isExportLogTable) {
      this.expenses = rowData.expenses;
      this.isChildTableVisible = true;
    }
  }

  openUrl(url: string) {
    this.windowService.openInNewTab(url);
    event?.stopPropagation();
  }

  ngOnInit(): void {
  }

}
