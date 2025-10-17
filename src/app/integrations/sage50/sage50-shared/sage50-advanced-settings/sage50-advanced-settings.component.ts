import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { DialogService } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ConditionField, ExpenseFilterResponse, SkipExportModel } from 'src/app/core/models/common/advanced-settings.model';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { ScheduleDialogData, ScheduleForm } from 'src/app/core/models/misc/schedule-dialog.model';
import { Sage50AdvancedSettings, Sage50AdvancedSettingsForm } from 'src/app/core/models/sage50/sage50-configuration/sage50-advanced-settings.model';
import { Sage50CCCExportType, Sage50ExportSettingsGet } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { ScheduleFormService } from 'src/app/core/services/misc/schedule-form.service';
import { Sage50AdvancedSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-advanced-settings.service';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { ScheduleDialogComponent } from 'src/app/shared/components/dialog/schedule-dialog/schedule-dialog.component';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sage50-advanced-settings',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './sage50-advanced-settings.component.html',
  styleUrl: './sage50-advanced-settings.component.scss',
  providers: [DialogService, SentenceCasePipe]
})
export class Sage50AdvancedSettingsComponent implements OnInit {

  // Constants
  readonly appName = AppName.SAGE50;

  readonly brandingStyle = brandingStyle;

  readonly redirectLink = brandingKbArticles.onboardingArticles.SAGE50.ADVANCED_SETTINGS;

  readonly brandingConfig = brandingConfig;

  // Flags
  isLoading: boolean;

  isOnboarding: boolean;

  isSaveInProgress: boolean;

  isTopLevelMemoVisible: boolean = false;

  get isSkipExportEnabled() {
    return this.advancedSettingsForm.get('isSkipExportEnabled')?.value ?? false;
  }

  // Other state
  schedulePreview: string | null = null;

  topLevelMemoPreviewText: string = '';

  lineLevelMemoPreviewText: string = '';


  // Form
  advancedSettingsForm!: FormGroup<Sage50AdvancedSettingsForm>;

  skipExportForm!: FormGroup;

  // API Response
  advancedSettings!: Sage50AdvancedSettings | null;

  exportSettings!: Sage50ExportSettingsGet | null;

  // Options
  get topLevelMemoOptions() {
    return this.advancedSettingsService.getTopLevelMemoOptions();
  }

  get lineLevelMemoOptions() {
    return this.advancedSettingsService.getLineLevelMemoOptions(this.exportSettings);
  }

  expenseFilters!: ExpenseFilterResponse;

  conditionFieldOptions!: ConditionField[];

  constructor(
    private router: Router,
    private advancedSettingsService: Sage50AdvancedSettingsService,
    private exportSettingService: Sage50ExportSettingsService,
    private dialogService: DialogService,
    private scheduleFormService: ScheduleFormService,
    private skipExportService: SkipExportService,
    private translocoService: TranslocoService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  editSchedule() {
    const data: ScheduleDialogData = {
      form: this.advancedSettingsForm.get('schedule') as FormGroup<ScheduleForm>
    };
    const ref = this.dialogService.open(ScheduleDialogComponent, {
      showHeader: false, data
    });

    ref.onClose.subscribe((result: {saved?: boolean}) => {
      if (result?.saved) {
        // Update the schedule preview
        this.schedulePreview = this.scheduleFormService.getSchedulePreview(
          this.advancedSettingsForm.get('schedule') as FormGroup<ScheduleForm>
        );

        // Update the advanced settings in-memory
        // This will acts as a fallback if the dialog is closed without saving.
        this.advancedSettings = {
          ...this.advancedSettings!,
          ...this.advancedSettingsService.constructSchedulePayload(
            this.advancedSettingsForm.get('schedule') as FormGroup<ScheduleForm>
          )
        };
      } else {
        // Reset the schedule form to the last saved value if the dialog is closed without saving
        this.advancedSettingsForm.setControl('schedule',
          this.advancedSettingsService.mapAPIResponseToScheduleFormGroup(this.advancedSettings)
        );

        // If schedule dialog was closed with no previously saved schedule, disable the toggle
        if (!this.schedulePreview) {
          this.advancedSettingsForm.get('isScheduleEnabled')?.setValue(false);
        }
      }
    });
  }

  deleteExpenseFilter(id: number) {
    this.skipExportService.deleteExpenseFilter(id).subscribe();
  }

  private setupFormWatchers() {
    this.advancedSettingsForm.get('isScheduleEnabled')?.valueChanges.subscribe(value => {
      if (value) {
        this.editSchedule();
      }
    });

    this.advancedSettingsForm.get('topLevelMemoStructure')?.valueChanges.subscribe(value => {
      this.topLevelMemoPreviewText = Sage50AdvancedSettingsService.formatMemoPreview(value, this.topLevelMemoOptions)[0];
    });

    this.advancedSettingsForm.get('lineLevelMemoStructure')?.valueChanges.subscribe(value => {
      this.lineLevelMemoPreviewText = Sage50AdvancedSettingsService.formatMemoPreview(value, this.lineLevelMemoOptions)[0];
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');

    forkJoin([
      this.advancedSettingsService.getSage50AdvancedSettings(),
      this.exportSettingService.getExportSettings(),
      this.skipExportService.getExpenseFilter(),
      this.skipExportService.getExpenseFields()
    ]).subscribe(([advancedSettings, exportSettings, expenseFilters, expenseFields]) => {
      this.advancedSettings = advancedSettings;
      this.exportSettings = exportSettings;
      this.expenseFilters = expenseFilters;
      this.conditionFieldOptions = expenseFields;

      this.isTopLevelMemoVisible = exportSettings?.credit_card_expense_export_type === Sage50CCCExportType.PAYMENTS_JOURNAL;

      // Build both forms
      const isSkipExportEnabled = expenseFilters.count > 0;
      this.advancedSettingsForm = this.advancedSettingsService.mapAPIResponseToFormGroup(advancedSettings, isSkipExportEnabled);
      this.skipExportForm = SkipExportModel.setupSkipExportForm(this.expenseFilters, [], this.conditionFieldOptions);

      // Set schedule preview from the schedule form value
      this.schedulePreview = this.scheduleFormService.getSchedulePreview(
        this.advancedSettingsForm.get('schedule') as FormGroup<ScheduleForm>
      );

      this.setupFormWatchers();
      this.isLoading = false;
    });
  }
}
