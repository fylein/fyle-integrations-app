import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountingExportList } from 'src/app/core/models/db/accounting-export.model';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
    selector: 'app-dashboard-export-log-dialog',
    templateUrl: './dashboard-export-log-dialog.component.html',
    styleUrls: ['./dashboard-export-log-dialog.component.scss'],
    standalone: false
})
export class DashboardExportLogDialogComponent implements OnInit {

  @Input() exportLogHeader: string;

  @Input() exportLogSubHeader: string;

  @Input() isExportLogVisible: boolean;

  @Input() accountingExports: AccountingExportList[];

  @Input() isExportLogFetchInProgress: boolean;

  @Input() appName: AppName;

  @Output() hideExportLogDialog = new EventEmitter<void>();

  constructor(
    private windowService: WindowService
  ) { }

  openUrl(event: any, url: string) {
    this.windowService.openInNewTab(url);
    event.stopPropagation();
  }

  handleDialogClose() {
    this.hideExportLogDialog.emit();
  }

  ngOnInit(): void {
  }

}
