import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50FyleField, Sage50ImportableField, Sage50ImportSettingsForm, Sage50ImportableCOAType } from 'src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationCsvImportFieldComponent } from "src/app/shared/components/configuration/configuration-csv-import-field/configuration-csv-import-field.component";
import { Sage50ImportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-settings.service';
import { Sage50ImportAttributesService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-attributes.service';
import { forkJoin } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-sage50-import-settings',
  standalone: true,
  imports: [SharedModule, CommonModule, ReactiveFormsModule, ConfigurationCsvImportFieldComponent, MultiSelectModule],
  templateUrl: './sage50-import-settings.component.html',
  styleUrl: './sage50-import-settings.component.scss'
})
export class Sage50ImportSettingsComponent implements OnInit {

  // Constants
  readonly appName = AppName.SAGE50;

  readonly brandingStyle = brandingStyle;

  readonly redirectLink = brandingKbArticles.onboardingArticles.SAGE50.IMPORT_SETTINGS;

  readonly brandingConfig = brandingConfig;

  readonly Sage50FyleField = Sage50FyleField;

  readonly Sage50ImportableField = Sage50ImportableField;

  // Flags
  isLoading: boolean;

  // Form
  importSettingsForm: FormGroup<Sage50ImportSettingsForm>;

  importableCOAOptions: { label: string, value: Sage50ImportableCOAType, disabled: boolean }[] = [];

  constructor(
    private importSettingService: Sage50ImportSettingsService,
    private importAttributesService: Sage50ImportAttributesService
  ) { }

  private constructOptions(importableChartOfAccounts: any[]): void {
    this.importableCOAOptions = Object.values(Sage50ImportableCOAType).map((value) => {
      const count = importableChartOfAccounts?.find((v) => v.chart_of_account === value)?.count;
      return {
        label: `${value} (${count ?? 0})`,
        value: value,
        disabled: value === Sage50ImportableCOAType.EXPENSES
      };
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin([
      this.importSettingService.getSage50ImportSettings(),
      this.importSettingService.getImportableChartOfAccounts(),
      this.importAttributesService.getAccountingImportDetailsByType()
    ]).subscribe(([importSettings, importableChartOfAccounts, accountingImportDetails]) => {

      this.importSettingsForm = this.importSettingService.mapApiResponseToFormGroup(importSettings, accountingImportDetails);
      this.constructOptions(importableChartOfAccounts);

      this.isLoading = false;
    });
  }


}
