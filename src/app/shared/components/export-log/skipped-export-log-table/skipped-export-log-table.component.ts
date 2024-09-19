import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import type { SkipExportList } from 'src/app/core/models/intacct/db/expense-group.model';
import type { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-skipped-export-log-table',
  templateUrl: './skipped-export-log-table.component.html',
  styleUrls: ['./skipped-export-log-table.component.scss']
})
export class SkippedExportLogTableComponent implements OnInit {

  @Input() filteredExpense: SkipExportList[];

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.exportLog;

  constructor(
    private windowService: WindowService
  ) { }


  openUrl(url: string) {
    this.windowService.openInNewTab(url);
  }

  ngOnInit(): void {
  }

}
