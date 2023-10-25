import { Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, from, interval, map, of, switchMap, takeWhile } from 'rxjs';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-exports.model';
import { AccountingExportStatus } from 'src/app/core/models/enum/enum.model';
import { DashboardService } from 'src/app/core/services/common/dashboard.service';

@Component({
  selector: 'app-sage300-dashboard',
  templateUrl: './sage300-dashboard.component.html',
  styleUrls: ['./sage300-dashboard.component.scss']
})
export class Sage300DashboardComponent implements OnInit {

  isLoading: boolean = true;

  isImportInProgress: boolean = true;

  exportInProgress: boolean = false;

  exportableExpenseGroupIds: number;

  readyToExportExpenseCount: number = 0;

  failedExpenseGroupCount: number = 0;

  exportProgressPercentage: number = 0;

  accountingExportSummary: AccountingExportSummary;

  processedCount: number = 1;

  constructor(
    private dashboardService: DashboardService
  ) { }

  export(eventData: boolean) {
    if (eventData) {
      this.exportInProgress = true;
    } else {
      this.exportInProgress = false;
    }
  }

  private setupPage(): void {
    forkJoin([
      this.dashboardService.getAccountingExportSummary(),
      this.dashboardService.getAccountingExportCount()
    ]).subscribe((responses) => {
      this.accountingExportSummary = responses[0];
      this.exportableExpenseGroupIds = responses[1].count;
      this.dashboardService.getAccountingExports(AccountingExportStatus.READY).subscribe((response) => {
        this.readyToExportExpenseCount = response.count;
      });
      this.isLoading = false;
      this.isImportInProgress = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
