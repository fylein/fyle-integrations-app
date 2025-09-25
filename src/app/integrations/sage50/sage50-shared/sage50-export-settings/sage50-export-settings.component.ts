import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { Sage50ExportSettings, Sage50ExportSettingsForm } from 'src/app/core/models/sage50/sage50-configuration/sage50-export-settings.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';

@Component({
  selector: 'app-sage50-export-settings',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './sage50-export-settings.component.html',
  styleUrl: './sage50-export-settings.component.scss'
})
export class Sage50ExportSettingsComponent implements OnInit {

  readonly appName = AppName.SAGE50;

  readonly redirectLink = brandingKbArticles.onboardingArticles.SAGE50.EXPORT_SETTINGS;

  readonly brandingStyle = brandingStyle;

  readonly brandingConfig = brandingConfig;

  // Options
  readonly reimbursableExportTypes = this.exportSettingService.sage50ReimbursableExportTypeOptions;

  readonly cccExportTypes = this.exportSettingService.sage50CCCExportTypeOptions;

  readonly reimbursableExpenseState = this.exportSettingService.sage50ReimbursableExpenseStateOptions;

  readonly cccExpenseState = this.exportSettingService.sage50CCCExpenseStateOptions;

  readonly expenseGroupingOptions = this.exportSettingService.sage50ExpenseGroupingOptions;

  readonly cccExpenseDateOptions = this.exportSettingService.sage50CCCExpenseDateOptions;

  isLoading: boolean;

  exportSettingForm: FormGroup<Sage50ExportSettingsForm>;

  exportSettings: Sage50ExportSettings | null;

  constructor(
    private exportSettingService: Sage50ExportSettingsService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.exportSettingService.getExportSettings()
      .pipe(catchError(() => of(null)))
      .subscribe((exportSettings) => {
        this.exportSettings = exportSettings;
        this.exportSettingForm = this.exportSettingService.mapApiResponseToFormGroup(exportSettings);
        this.isLoading = false;
      });

  }
}
