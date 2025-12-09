import { Component, Input, OnInit } from '@angular/core';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { SkipExportList } from 'src/app/core/models/intacct/db/expense-group.model';
import { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-skipped-export-log-table',
  templateUrl: './skipped-export-log-table.component.html',
  styleUrls: ['./skipped-export-log-table.component.scss'],
  standalone: false,
})
export class SkippedExportLogTableComponent implements OnInit {
  @Input() filteredExpense: SkipExportList[];

  readonly brandingFeatureConfig = brandingFeatureConfig;

  constructor(private windowService: WindowService) {}

  openUrl(url: string) {
    this.windowService.openInNewTab(url);
  }

  ngOnInit(): void {}
}
