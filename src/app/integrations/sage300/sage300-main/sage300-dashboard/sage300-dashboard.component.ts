import { Component, OnInit } from '@angular/core';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';

@Component({
  selector: 'app-sage300-dashboard',
  templateUrl: './sage300-dashboard.component.html',
  styleUrls: ['./sage300-dashboard.component.scss']
})
export class Sage300DashboardComponent implements OnInit {

  isImportInProgress: boolean;

  exportInProgress: boolean;

  exportableExpenseGroupIds: number[];

  failedExpenseGroupCount: number;

  exportProgressPercentage: number;

  accountingExportSummary: AccountingExportSummary;

  processedCount: number;

  constructor(
    private dashboardService: DashboardService
  ) { }

  export(eventData: boolean) {
    // Polling
  }

  private setupPage(): void {
    // GET: Dashboard Service
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
