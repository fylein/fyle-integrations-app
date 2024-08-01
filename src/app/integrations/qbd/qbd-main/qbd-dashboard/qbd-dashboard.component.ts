import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, from, interval, switchMap, takeWhile } from 'rxjs';
import { ClickEvent, Page, PaginatorPage, QBDAccountingExportsState, QBDAccountingExportsType, QBDScheduleFrequency, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { AccountingExportsResult, QbdExportTriggerResponse, QbdAccountingExportDownload, QbdExportTriggerGet } from 'src/app/core/models/qbd/db/qbd-iif-logs.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';
import { QbdAdvancedSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-advanced-setting.service';
import { QbdIifLogsService } from 'src/app/core/services/qbd/qbd-iif-log/qbd-iif-logs.service';
import { QBDAdvancedSettingsGet } from 'src/app/core/models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AccountingExportModel } from 'src/app/core/models/db/accounting-export.model';

@Component({
  selector: 'app-qbd-dashboard',
  templateUrl: './qbd-dashboard.component.html',
  styleUrls: ['./qbd-dashboard.component.scss']
})
export class QbdDashboardComponent implements OnInit {

  isLoading: boolean = false;

  accountingExports: QbdExportTriggerResponse;

  totalCount: number;

  limit: number = 10;

  pageNo: number = 0;

  dateOptions: DateFilter[] = AccountingExportModel.getDateOptionsV2();

  selectedDateFilter: SelectedDateFilter | null = null;

  presentDate = new Date().toLocaleDateString();

  exportLogForm: FormGroup;

  isCalendarVisible: boolean = false;

  downloadingExportId: boolean[];

  exportInProgress: boolean = false;

  exportProgressPercentage: number;

  exportPresent: boolean = true;

  nextExportDate: Date | undefined;

  processedCount: number;

  isRecordPresent: boolean;

  sessionStartTime: Date = new Date();

  PaginatorPage = PaginatorPage;

  currentPage: number = 1;

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly illustrationsAllowed: boolean = brandingFeatureConfig.illustrationsAllowed;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  hideCalendar: boolean;

  constructor(
    private iifLogsService: QbdIifLogsService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private advancedSettingService: QbdAdvancedSettingService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService
  ) { }

  showCalendar(event: Event) {
    event.stopPropagation();
    this.isCalendarVisible = true;
  }

  getExpenseType(type: string) {
    const expenseType = type === 'CCC' ? QBDAccountingExportsType.CREDIT_CARD : QBDAccountingExportsType.REIMBURSABLE;
    return expenseType.split("_").join(' ');
  }

  getTypeString(type: string): string {
    return type.split("_").slice(1).join(' ').split(",").join('');
  }

  dateFilter(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.hideCalendar = false;
    }, 10);
    this.iifLogsService.getQbdAccountingExports(QBDAccountingExportsState.COMPLETE, this.limit, this.pageNo, this.selectedDateFilter, [QBDAccountingExportsType.EXPORT_BILLS, QBDAccountingExportsType.EXPORT_CREDIT_CARD_PURCHASES, QBDAccountingExportsType.EXPORT_JOURNALS]).subscribe((accountingExportsResult: QbdExportTriggerResponse) => {
      this.accountingExports = accountingExportsResult;
      this.totalCount = this.accountingExports.count;
      this.isLoading = false;
    });
  }

  pageSizeChanges(limit: number): void {
    this.isLoading = true;
    this.limit = limit;
    this.pageNo = 0;
    this.currentPage = 1;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.iifLogsService.getQbdAccountingExports(QBDAccountingExportsState.COMPLETE, this.limit, this.pageNo, this.selectedDateFilter, [QBDAccountingExportsType.EXPORT_BILLS, QBDAccountingExportsType.EXPORT_CREDIT_CARD_PURCHASES, QBDAccountingExportsType.EXPORT_JOURNALS]).subscribe((accountingExportsResult: QbdExportTriggerResponse) => {
      this.accountingExports = accountingExportsResult;
      this.totalCount = this.accountingExports.count;
      this.isLoading = false;
    });
  }

  pageOffsetChanges(pageNo: number): void {
    this.isLoading = true;
    this.pageNo = pageNo;
    this.currentPage = Math.ceil(this.pageNo / this.limit)+1;
    this.selectedDateFilter = this.selectedDateFilter ? this.selectedDateFilter : null;
    this.iifLogsService.getQbdAccountingExports(QBDAccountingExportsState.COMPLETE, this.limit, this.pageNo, this.selectedDateFilter, [QBDAccountingExportsType.EXPORT_BILLS, QBDAccountingExportsType.EXPORT_CREDIT_CARD_PURCHASES, QBDAccountingExportsType.EXPORT_JOURNALS]).subscribe((accountingExportsResult: QbdExportTriggerResponse) => {
      this.accountingExports = accountingExportsResult;
      this.totalCount = this.accountingExports.count;
      this.isLoading = false;
    });
  }

  exportPolling(length: number, isImportPresent: boolean): void {
    this.exportProgressPercentage = 25;
    interval(3000).pipe(
      switchMap(() => from(this.iifLogsService.getQbdAccountingExports([QBDAccountingExportsState.ENQUEUED, QBDAccountingExportsState.IN_PROGRESS, QBDAccountingExportsState.COMPLETE], this.limit, this.pageNo, null, [QBDAccountingExportsType.EXPORT_BILLS, QBDAccountingExportsType.EXPORT_CREDIT_CARD_PURCHASES, QBDAccountingExportsType.EXPORT_JOURNALS]))),
      takeWhile((response) => response.results.filter(task => (task.status === QBDAccountingExportsState.IN_PROGRESS || task.status === QBDAccountingExportsState.ENQUEUED)).length > 0, true)
    ).subscribe((res) => {
      this.processedCount = res.results.filter(task => (task.status !== QBDAccountingExportsState.IN_PROGRESS && task.status !== QBDAccountingExportsState.ENQUEUED)).length;
      this.exportProgressPercentage = Math.round((this.processedCount / length) * 100);
      if (res.results.filter(task => (task.status === QBDAccountingExportsState.IN_PROGRESS || task.status === QBDAccountingExportsState.ENQUEUED)).length === 0) {
        this.iifLogsService.getQbdAccountingExports(QBDAccountingExportsState.COMPLETE, this.limit, this.pageNo, null, [QBDAccountingExportsType.EXPORT_BILLS, QBDAccountingExportsType.EXPORT_CREDIT_CARD_PURCHASES, QBDAccountingExportsType.EXPORT_JOURNALS]).subscribe((accountingExportsResult: QbdExportTriggerResponse) => {
          this.accountingExports = accountingExportsResult;
          this.exportPresent = isImportPresent;
          this.exportInProgress = false;
        });
      }
    });
  }

  triggerExports(): void {
    this.exportInProgress = true;
    this.trackingService.onClickEvent(TrackingApp.QBD, ClickEvent.QBD_EXPORT);
    setTimeout(() => {
      this.exportProgressPercentage = 15;
    }, 500);
    this.iifLogsService.triggerQBDExport().subscribe((triggerResponse: QbdExportTriggerGet) => {
      if (triggerResponse.new_expenses_imported) {
        this.iifLogsService.getQbdAccountingExports([QBDAccountingExportsState.ENQUEUED, QBDAccountingExportsState.IN_PROGRESS], this.limit, this.pageNo, null, null).subscribe((accountingExportsResponse: QbdExportTriggerResponse) => {
          const accountingResponseLength = accountingExportsResponse.count;
          this.exportPolling(accountingResponseLength, triggerResponse.new_expenses_imported);
        });
      } else {
        this.exportInProgress = false;
        this.exportPresent = triggerResponse.new_expenses_imported;
      }

    }, () => {
      this.exportInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Export Failed, try again later');
    });
  }

  getDownloadLink(exportData: AccountingExportsResult, index: number): void {
    this.downloadingExportId[index] = true;
    this.iifLogsService.postQbdAccountingExports(exportData.id).subscribe((postQbdAccountingExports: QbdAccountingExportDownload) => {
      const link = document.createElement('a');
      link.setAttribute('href', postQbdAccountingExports.download_url);
      link.setAttribute('download', `${postQbdAccountingExports.file_id}.iif`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.downloadingExportId[index] = false;
    }, () => {
      this.downloadingExportId[index] = false;
    });
  }

  getNextExportDate(advancedSettings: QBDAdvancedSettingsGet): void {
    if (advancedSettings.schedule_is_enabled) {
      const date = new Date();
      if (advancedSettings.frequency === QBDScheduleFrequency.MONTHLY) {
        let current;
        if (date.getMonth() === 11 && advancedSettings?.day_of_month) {
            current = new Date(date.getFullYear() + 1, 0, +advancedSettings?.day_of_month);
        } else if (advancedSettings?.day_of_month) {
            current = new Date(date.getFullYear(), date.getMonth() + 1, +advancedSettings?.day_of_month);
        }
        this.nextExportDate = current;
      } else if (advancedSettings.frequency === QBDScheduleFrequency.WEEKLY && advancedSettings.day_of_week) {
        const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const week = weekday.indexOf(advancedSettings.day_of_week.toLowerCase());
        const resultDate = new Date(new Date().getTime());
        resultDate.setDate(date.getDate() + ((7 + week - date.getDay()) % 7));
        this.nextExportDate = resultDate;
      } else {
        this.nextExportDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1);
      }
    }
  }

  private setupDateFilterWatcher(): void {
    this.exportLogForm.controls.start.valueChanges.subscribe((dateRange) => {
      if (!dateRange) {
        this.selectedDateFilter = null;
        this.dateFilter();
      } else if (dateRange.length && dateRange[1]) {
        this.hideCalendar = true;
        this.selectedDateFilter = {
          startDate: dateRange[0],
          endDate: dateRange[1]
        };

        this.dateFilter();
      }
    });
  }

  setUpDashboard(): void {
    this.isLoading = true;
    this.exportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });
    this.setupDateFilterWatcher();

    forkJoin([
      this.iifLogsService.getQbdAccountingExports(QBDAccountingExportsState.COMPLETE, this.limit, this.pageNo, null, [QBDAccountingExportsType.EXPORT_BILLS, QBDAccountingExportsType.EXPORT_CREDIT_CARD_PURCHASES, QBDAccountingExportsType.EXPORT_JOURNALS]),
      this.advancedSettingService.getQbdAdvancedSettings()
    ]).subscribe((response) => {
      this.accountingExports = response[0];
      const advancedSettings = response[1];
      this.downloadingExportId =  [...Array(this.accountingExports.count).keys()].map(() => {
        return false;
      });
      this.getNextExportDate(advancedSettings);
      this.isRecordPresent = this.accountingExports.count > 0 ? true : false;
      this.totalCount = this.accountingExports.count;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setUpDashboard();
  }

}
