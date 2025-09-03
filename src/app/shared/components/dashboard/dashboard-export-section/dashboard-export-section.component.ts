import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AccountingExportSummary } from 'src/app/core/models/db/accounting-export-summary.model';
import { AppName, ButtonSize, ButtonType, CCCImportState, LoaderType, ReimbursableImportState } from 'src/app/core/models/enum/enum.model';
import { TranslocoService } from '@jsverse/transloco';

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

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  uiExposedAppName: string;

  importStates: string;

  readonly brandingStyle = brandingStyle;

  AppName = AppName;

  constructor(private translocoService: TranslocoService) { }

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
        this.importStates = this.reimbursableImportState + this.translocoService.translate('dashboardExportSection.orSeparator') + this.cccImportState;
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
