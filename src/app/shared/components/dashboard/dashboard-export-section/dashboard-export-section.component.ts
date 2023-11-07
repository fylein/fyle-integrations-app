import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { AppName } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-dashboard-export-section',
  templateUrl: './dashboard-export-section.component.html',
  styleUrls: ['./dashboard-export-section.component.scss']
})
export class DashboardExportSectionComponent implements OnInit {

  @Input() appName: AppName;

  @Input() isImportInProgress: boolean;

  @Input() isExportInProgress: boolean;

  @Input() exportableExpenseGroupIds: number[];

  @Input() failedExpenseGroupCount: number;

  @Input() exportProgressPercentage: number;

  @Input() accountingExportSummary: AccountingExportSummary;

  @Input() processedCount: number;

  @Output() export = new EventEmitter<boolean>();

  constructor() { }

  triggerExport() {
    this.export.emit(true);
  }

  ngOnInit(): void {
  }

}
