import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta, Sage50AttributeType, Sage50OnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50FyleField, Sage50ImportableField, Sage50ImportSettingsForm, Sage50ImportableCOAType, Sage50ImportableCOAGet } from 'src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationCsvImportFieldComponent } from "src/app/shared/components/configuration/configuration-csv-import-field/configuration-csv-import-field.component";
import { Sage50ImportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-settings.service';
import { Sage50ImportAttributesService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-attributes.service';
import { forkJoin, startWith } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';
import { Sage50MappingService } from 'src/app/core/services/sage50/sage50-mapping.service';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { TranslocoService } from '@jsverse/transloco';
import { CSVImportSourceFieldOption } from 'src/app/core/models/misc/configuration-csv-import-field.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { Sage50FyleField as Sage50FyleFieldGet } from 'src/app/core/models/sage50/sage50-configuration/sage50-mapping.model';

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

  readonly ConfigurationCtaText = ConfigurationCta;

  // Flags
  isLoading: boolean;

  isOnboarding: boolean;

  isVendorMandatory: boolean;

  isSaveInProgress: boolean;

  // State
  importStatuses: Record<Sage50ImportableField, boolean>;

  // Form
  importSettingsForm: FormGroup<Sage50ImportSettingsForm>;

  importableCOAOptions: { label: string, value: Sage50ImportableCOAType, disabled: boolean }[] = [];

  sourceFieldOptions: CSVImportSourceFieldOption[] = [];

  constructor(
    private importSettingService: Sage50ImportSettingsService,
    private importAttributesService: Sage50ImportAttributesService,
    private mappingService: Sage50MappingService,
    private exportSettingService: Sage50ExportSettingsService,
    private router: Router,
    private translocoService: TranslocoService,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  public uploadData(attributeType: Sage50AttributeType, fileName: string, jsonData: any) {
    return this.importAttributesService.importAttributes(attributeType, fileName, jsonData);
  }

  public getSourceFieldOptions(destinationField: Sage50ImportableField) {
    // Get all selected source fields
    const selectedSourceFields: (Sage50FyleField | null)[] = [];
    Object.keys(this.importSettingsForm.controls).forEach(key => {
      const formGroup = this.importSettingsForm.get(key);

      if (formGroup?.get('sourceField')?.value) {
        const sourceFieldValue = formGroup.get('sourceField')?.value;
        selectedSourceFields.push(sourceFieldValue);
      }
    });

    return this.sourceFieldOptions.filter(option => {

      // Include option if it is the current value of this source field
      if (option.value === this.importSettingsForm.get(destinationField)?.get('sourceField')?.value) {
        return true;
      }

      // Exclude options already selected in other source fields
      if (selectedSourceFields.includes(option.value as Sage50FyleField)) {
        return false;
      }

      return true;
    });
  }

  public addSourceFieldOption(option: CSVImportSourceFieldOption) {
    this.sourceFieldOptions.splice(this.sourceFieldOptions.length - 1, 0, option);
  }

  public onBackButtonClick() {
    this.router.navigate(['/integrations/sage50/onboarding/export_settings']);
  }

  public onSave() {
    this.isSaveInProgress = true;
    this.importSettingService.constructPayloadAndPost(this.importSettingsForm).subscribe({
      next: () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(
          ToastSeverity.SUCCESS, this.translocoService.translate('sage50ImportSettings.importSettingsSavedSuccess')
        );
        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(Sage50OnboardingState.ADVANCED_SETTINGS);
          this.router.navigate(['/integrations/sage50/onboarding/advanced_settings']);
        }
      },
      error: () => {
        this.isSaveInProgress = false;
        this.toastService.displayToastMessage(
          ToastSeverity.ERROR, this.translocoService.translate('sage50ImportSettings.importSettingsSaveError')
        );
      }
    });
  }

  private constructOptions(importableChartOfAccounts: Sage50ImportableCOAGet, fyleFields: Sage50FyleFieldGet[]): void {
    this.importableCOAOptions = Object.values(Sage50ImportableCOAType).map((value) => {
      const count = importableChartOfAccounts?.find((v) => v.chart_of_account === value)?.count ?? 0;
      return {
        label: `${value} (${count})`,
        value: value,
        disabled: value === Sage50ImportableCOAType.EXPENSES
      };
    });

    const customFieldOptions = fyleFields.filter((field) => field.is_custom).map((field) => {
      return {
        label: field.field_name,
        value: field.field_name.split(' ')?.join('_')?.toUpperCase(),
        placeholder: null
      };
    });

    this.sourceFieldOptions = [
      {
        label: this.translocoService.translate('sage50ImportSettings.costCenterLabel'),
        value: Sage50FyleField.COST_CENTER,
        placeholder: null
      },
      ...customFieldOptions,
      {
        label: this.translocoService.translate('sage50ImportSettings.customFieldLabel'),
        value: 'custom_field',
        placeholder: null
      }
    ];
  }

  private setupWatchers(): void {
    // Auto-disable dependent fields
    this.importSettingsForm.get('JOB')?.get('enabled')?.valueChanges
      .pipe(
        startWith(this.importSettingsForm.get('JOB')?.get('enabled')?.value)
      )
      .subscribe((enabled) => {
        if (!enabled) {
          this.importSettingsForm.get('PHASE')?.get('enabled')?.setValue(false);
        }
      });

    this.importSettingsForm.get('PHASE')?.get('enabled')?.valueChanges
      .pipe(
        startWith(this.importSettingsForm.get('PHASE')?.get('enabled')?.value)
      )
      .subscribe((enabled) => {
        if (!enabled) {
          this.importSettingsForm.get('COST_CODE')?.get('enabled')?.setValue(false);
        }
      });
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
      this.mappingService.getFyleFields('v1', { prefixWorkspaces: false }),
      this.importSettingService.getImportCodeFieldsConfig(),
      ...attributeStatsRequests
    ]).subscribe(([importSettings, importableChartOfAccounts, accountingImportDetails, exportSettings, fyleFields, importCodeFieldsConfig, accountStats, vendorStats]) => {

      // If payments or purchases are being exported, vendor is mandatory
      this.isVendorMandatory = this.importSettingService.isVendorMandatory(exportSettings);

      this.importStatuses = this.importSettingService.getImportStatusesByField(importCodeFieldsConfig);

      this.importSettingsForm = this.importSettingService.mapApiResponseToFormGroup(
        importSettings, accountingImportDetails, exportSettings, this.importStatuses, accountStats, vendorStats
      );
      this.constructOptions(importableChartOfAccounts, fyleFields as unknown as Sage50FyleFieldGet[]);

      this.setupWatchers();

      this.isLoading = false;
    });
  }
}
