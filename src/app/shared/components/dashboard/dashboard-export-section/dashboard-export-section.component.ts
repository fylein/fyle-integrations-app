import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';

@Component({
  selector: 'app-dashboard-export-section',
  templateUrl: './dashboard-export-section.component.html',
  styleUrls: ['./dashboard-export-section.component.scss']
})
export class DashboardExportSectionComponent implements OnInit {

  @Input() isImportInProgress: boolean;

  @Input() exportInProgress: boolean;

  @Input() exportableExpenseGroupIds: number[] = [];

  @Input() failedExpenseGroupCount: number;

  @Input() exportProgressPercentage: number = 0;

  @Input() accountingExportSummary: AccountingExportSummary;

  @Input() processedCount: any;

  @Output() export = new EventEmitter<boolean>();

  constructor() { }

  emitExport() {
    this.export.emit(true);
  }

  ngOnInit(): void {
  }

}
