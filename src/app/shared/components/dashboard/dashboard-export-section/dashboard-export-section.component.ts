import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { AppName, CCCImportState, LoaderType, ReimbursableImportState } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-dashboard-export-section',
  templateUrl: './dashboard-export-section.component.html',
  styleUrls: ['./dashboard-export-section.component.scss']
})
export class DashboardExportSectionComponent implements OnInit {

  @Input() appName: AppName;

  @Input() isImportInProgress: boolean;

  @Input() isExportInProgress: boolean;

  @Input() exportableAccountingExportIds: number[];

  @Input() failedExpenseGroupCount: number;

  @Input() exportProgressPercentage: number;

  @Input() accountingExportSummary: AccountingExportSummary | null;

  @Input() processedCount: number;

  @Input() loaderType: LoaderType = LoaderType.DETERMINATE;

  @Input() reimbursableImportState: ReimbursableImportState | null;

  @Input() cccImportState: CCCImportState | null;

  @Output() export = new EventEmitter<boolean>();

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.dashboard;

  uiExposedAppName: string;

  importStates: string;

  AppName = AppName;

  constructor() { }

  triggerExport() {
    this.export.emit(true);
  }

  private logoPathsMap = new Map<AppName, string>([
    [AppName.NETSUITE, 'assets/logos/netsuite-logo.png'],
    [AppName.QBO, 'assets/logos/email/qbo.png'],
    [AppName.INTACCT, 'assets/logos/intacct-logo.png'],
    [AppName.XERO, 'assets/logos/xero-logo.png']
  ]);

  get logoPath(): string {
    return this.logoPathsMap.get(this.appName) || '';
  }

  private constructImportStates() {
    if (this.reimbursableImportState === ReimbursableImportState.PAID && this.cccImportState === CCCImportState.PAID) {
      this.importStates = ReimbursableImportState.PAID;
    } else {
      if (this.reimbursableImportState && this.cccImportState) {
        this.importStates = this.reimbursableImportState + ' or ' + this.cccImportState;
      } else if (this.reimbursableImportState) {
        this.importStates = this.reimbursableImportState;
      } else if (this.cccImportState) {
        this.importStates = this.cccImportState;
      }
    }
  }

  ngOnInit(): void {
    this.uiExposedAppName = this.appName === AppName.QBD_DIRECT ? AppName.QBD : this.appName;
    this.constructImportStates();
  }

}
