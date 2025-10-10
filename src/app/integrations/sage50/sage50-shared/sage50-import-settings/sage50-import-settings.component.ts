import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, Sage50AttributeType } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50FyleField, Sage50ImportableField, Sage50ImportSettingsForm, Sage50ImportableCOAType, Sage50ImportableCOAGet } from 'src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationCsvImportFieldComponent } from "src/app/shared/components/configuration/configuration-csv-import-field/configuration-csv-import-field.component";
import { Sage50ImportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-settings.service';
import { Sage50ImportAttributesService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-attributes.service';
import { forkJoin } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';
import { Sage50MappingService } from 'src/app/core/services/sage50/sage50-mapping.service';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';

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

  isOnboarding: boolean;

  isVendorMandatory: boolean;

  // Form
  importSettingsForm: FormGroup<Sage50ImportSettingsForm>;

  importableCOAOptions: { label: string, value: Sage50ImportableCOAType, disabled: boolean }[] = [];

  constructor(
    private importSettingService: Sage50ImportSettingsService,
    private importAttributesService: Sage50ImportAttributesService,
    private mappingService: Sage50MappingService,
    private exportSettingService: Sage50ExportSettingsService,
    private router: Router
  ) { }

  private constructOptions(importableChartOfAccounts: Sage50ImportableCOAGet): void {
    this.importableCOAOptions = Object.values(Sage50ImportableCOAType).map((value) => {
      const count = importableChartOfAccounts?.find((v) => v.chart_of_account === value)?.count ?? 0;
      return {
        label: `${value} (${count})`,
        value: value,
        disabled: value === Sage50ImportableCOAType.EXPENSES
      };
    });
  }

  public uploadData(attributeType: Sage50AttributeType, fileName: string, jsonData: any) {
    return this.importAttributesService.importAttributes(attributeType, fileName, jsonData);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');

    const attributeStatsRequests = this.isOnboarding
      ? [
        this.mappingService.getAttributeStats(Sage50AttributeType.ACCOUNT),
        this.mappingService.getAttributeStats(Sage50AttributeType.VENDOR)
      ]
      : [];

    forkJoin([
      this.importSettingService.getSage50ImportSettings(),
      this.importSettingService.getImportableChartOfAccounts(),
      this.importAttributesService.getAccountingImportDetailsByType(),
      this.exportSettingService.getExportSettings(),
      ...attributeStatsRequests
    ]).subscribe(([importSettings, importableChartOfAccounts, accountingImportDetails, exportSettings, accountStats, vendorStats]) => {

      // If payments or purchases are being exported, vendor is mandatory
      this.isVendorMandatory = this.importSettingService.isVendorMandatory(exportSettings);

      this.importSettingsForm = this.importSettingService.mapApiResponseToFormGroup(
        importSettings, accountingImportDetails, exportSettings, accountStats, vendorStats
      );
      this.constructOptions(importableChartOfAccounts);

      this.isLoading = false;
    });
  }
}
