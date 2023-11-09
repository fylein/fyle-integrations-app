import { Component, Input, OnInit } from '@angular/core';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';

@Component({
  selector: 'app-dashboard-export-summary-section',
  templateUrl: './dashboard-export-summary-section.component.html',
  styleUrls: ['./dashboard-export-summary-section.component.scss']
})
export class DashboardExportSummarySectionComponent implements OnInit {

  @Input() accountingExportSummary: AccountingExportSummary;

  constructor() { }

  ngOnInit(): void {
  }

}
