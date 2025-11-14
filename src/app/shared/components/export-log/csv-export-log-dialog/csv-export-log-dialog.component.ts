import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpenseDetails } from 'src/app/core/models/db/expense-details.model';
import { CsvExpensesTableComponent } from "../csv-expenses-table/csv-expenses-table.component";
import { CsvExportLogItem } from 'src/app/core/models/db/csv-export-log.model';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';
import { ClickEvent, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
    selector: 'app-csv-export-log-dialog',
    imports: [SharedModule, CommonModule, CsvExpensesTableComponent],
    templateUrl: './csv-export-log-dialog.component.html',
    styleUrl: './csv-export-log-dialog.component.scss'
})
export class CsvExportLogDialogComponent {

  @Input() isDialogOpen = false;

  @Output() isDialogOpenChange = new EventEmitter<boolean>();

  @Input({ required: true }) expenses!: ExpenseDetails[];

  @Input({ required: true }) exportLog!: CsvExportLogItem;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(
    public exportLogService: ExportLogService,
    private trackingService: TrackingService
  ) { }

  downloadFile(exportLog: CsvExportLogItem) {
    this.trackingService.onClickEvent(TrackingApp.SAGE50, ClickEvent.DOWNLOAD_CSV, {fileName: exportLog.file_name, fileId: exportLog.file_id, view: 'Export Log dialog view'});
    this.exportLogService.downloadFile(exportLog);
  }

  handleDialogClose(): void {
    this.isDialogOpenChange.emit(false);
  }
}
