import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, Sage50AttributeType, Sage50OnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sage50FyleField, Sage50ImportableField, Sage50ImportSettingsForm, Sage50ImportableCOAType, Sage50ImportableCOAGet } from 'src/app/core/models/sage50/sage50-configuration/sage50-import-settings.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationCsvImportFieldComponent } from "src/app/shared/components/configuration/configuration-csv-import-field/configuration-csv-import-field.component";
import { Sage50ImportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-settings.service';
import { Sage50ImportAttributesService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-attributes.service';
import { forkJoin, pairwise, startWith } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';
import { Sage50MappingService } from 'src/app/core/services/sage50/sage50-mapping.service';
import { Sage50ExportSettingsService } from 'src/app/core/services/sage50/sage50-configuration/sage50-export-settings.service';
import { TranslocoService } from '@jsverse/transloco';
import { CSVImportSourceFieldOption } from 'src/app/core/models/misc/configuration-csv-import-field.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { Sage50FyleField as Sage50FyleFieldGet } from 'src/app/core/models/sage50/sage50-configuration/sage50-mapping.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { sage50AttributeDisplayNames } from 'src/app/core/models/sage50/sage50-configuration/attribute-display-names';

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

  readonly ConfigurationWarningEvent = ConfigurationWarningEvent;

  readonly AppName = AppName;

  readonly sage50AttributeDisplayNames = sage50AttributeDisplayNames;

  // Flags
  isLoading: boolean;

  isOnboarding: boolean;

  isVendorMandatory: boolean;

  isSaveInProgress: boolean;

  // Warning dialog state
  showTurnOffImportWarning: boolean = false;

  showChangeMappingWarning: boolean = false;

  currentWarningField: Sage50ImportableField | null = null;

  private previousSourceFieldValue: string | null = null;

  private isProcessingWarning: boolean = false;

  private isRevertingSourceField: boolean = false;

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
    // Watch Job toggle
    this.importSettingsForm.get('JOB')?.get('enabled')?.valueChanges
      .subscribe((currentValue) => {
        if (this.isProcessingWarning) {
          return;
        }

        // When Job is disabled (true -> false), show warning
        if (!currentValue) {
          this.handleToggleOff(Sage50ImportableField.JOB);
        }
      });

    // Watch Phase toggle
    this.importSettingsForm.get('PHASE')?.get('enabled')?.valueChanges
      .subscribe((currentValue) => {
        if (this.isProcessingWarning) {
          return;
        }

        // When Phase is disabled (true -> false), show warning
        if (!currentValue) {
          this.handleToggleOff(Sage50ImportableField.PHASE);
        }
      });

    // Watch Cost Code toggle
    this.importSettingsForm.get('COST_CODE')?.get('enabled')?.valueChanges
      .subscribe((currentValue) => {
        if (this.isProcessingWarning) {
          return;
        }

        // When Cost Code is disabled (true -> false), show warning
        if (!currentValue) {
          this.handleToggleOff(Sage50ImportableField.COST_CODE);
        }
      });

    // Watch Phase source field changes (for mapping change warning)
    this.importSettingsForm.get('PHASE')?.get('sourceField')?.valueChanges
      .pipe(
        startWith(this.importSettingsForm.get('PHASE')?.get('sourceField')?.value),
        pairwise()
      )
      .subscribe(([previousValue, currentValue]) => {
        this.handleSourceFieldChange(Sage50ImportableField.PHASE, previousValue ?? null, currentValue ?? null);
      });

    // Watch Cost Code source field changes (for mapping change warning)
    this.importSettingsForm.get('COST_CODE')?.get('sourceField')?.valueChanges
      .pipe(
        startWith(this.importSettingsForm.get('COST_CODE')?.get('sourceField')?.value),
        pairwise()
      )
      .subscribe(([previousValue, currentValue]) => {
        this.handleSourceFieldChange(Sage50ImportableField.COST_CODE, previousValue ?? null, currentValue ?? null);
      });
  }

  private handleToggleOff(field: Sage50ImportableField): void {
    // Immediately revert the toggle back to enabled
    this.isProcessingWarning = true;
    this.importSettingsForm.get(field)?.get('enabled')?.setValue(true, { emitEvent: false });

    // Store which field is being toggled off and show warning
    this.currentWarningField = field;
    this.showTurnOffImportWarning = true;
    this.isProcessingWarning = false;
  }

  private handleSourceFieldChange(field: Sage50ImportableField, previousValue: string | null, currentValue: string | null): void {
    // Only check for Phase and Cost Code fields
    const isPhaseOrCostCode = field === Sage50ImportableField.PHASE || field === Sage50ImportableField.COST_CODE;

    if (this.isRevertingSourceField || !isPhaseOrCostCode) {
      return;
    }

    // Don't show warning if user selected "Create a custom field" option
    // Or if reverting from "Create a custom field" option
    // That option opens its own dialog and reverts the value
    if (currentValue === 'custom_field' || previousValue === 'custom_field') {
      return;
    }

    // Only show warning post-onboarding when there's a previous mapping and it's being changed
    const hasPreviousMapping = previousValue && previousValue !== '';
    const isChangingMapping = previousValue !== currentValue;
    const hasBeenImported = this.importStatuses[field];

    if (!this.isOnboarding && hasPreviousMapping && isChangingMapping && hasBeenImported) {
      // Store the previous value to revert if user cancels
      this.previousSourceFieldValue = previousValue;
      this.currentWarningField = field;
      this.showChangeMappingWarning = true;
    }
  }

  acceptTurnOffImportWarning(data: ConfigurationWarningOut): void {
    this.showTurnOffImportWarning = false;

    if (!this.currentWarningField) {
      return;
    }

    if (data.hasAccepted) {
      // User accepted, disable the field and cascade to children
      this.isProcessingWarning = true;

      if (this.currentWarningField === Sage50ImportableField.JOB) {
        // Disable Job, Phase, and Cost Code
        this.importSettingsForm.get('JOB')?.get('enabled')?.setValue(false, { emitEvent: false });
        this.importSettingsForm.get('PHASE')?.get('enabled')?.setValue(false, { emitEvent: false });
        this.importSettingsForm.get('COST_CODE')?.get('enabled')?.setValue(false, { emitEvent: false });
      } else if (this.currentWarningField === Sage50ImportableField.PHASE) {
        // Disable Phase and Cost Code
        this.importSettingsForm.get('PHASE')?.get('enabled')?.setValue(false, { emitEvent: false });
        this.importSettingsForm.get('COST_CODE')?.get('enabled')?.setValue(false, { emitEvent: false });
      } else if (this.currentWarningField === Sage50ImportableField.COST_CODE) {
        // Disable only Cost Code
        this.importSettingsForm.get('COST_CODE')?.get('enabled')?.setValue(false, { emitEvent: false });
      }

      this.isProcessingWarning = false;
    }
    this.currentWarningField = null;
  }

  get currentWarningDimension(): string {
    return this.currentWarningField ? sage50AttributeDisplayNames[this.currentWarningField] : '';
  }

  get currentSourceFieldDisplayName(): string {
    if (!this.currentWarningField) {
      return '';
    }

    const sourceFieldValue = this.importSettingsForm.get(this.currentWarningField)?.get('sourceField')?.value;
    if (!sourceFieldValue) {
      return '';
    }

    const option = this.sourceFieldOptions.find(opt => opt.value === sourceFieldValue);
    return option?.label || sourceFieldValue;
  }

  acceptChangeMappingWarning(data: ConfigurationWarningOut): void {
    this.showChangeMappingWarning = false;

    if (!this.currentWarningField) {
      return;
    }

    if (!data.hasAccepted && this.previousSourceFieldValue !== null) {
      // User canceled, revert to the previous source field value
      this.isRevertingSourceField = true;
      this.importSettingsForm.get(this.currentWarningField)?.get('sourceField')?.setValue(this.previousSourceFieldValue as Sage50FyleField, { emitEvent: true });

      // Also update the placeholder
      const previousOption = this.sourceFieldOptions.find(option => option.value === this.previousSourceFieldValue);
      this.importSettingsForm.get(this.currentWarningField)?.get('sourcePlaceholder')?.setValue(previousOption?.placeholder ?? null);


      this.isRevertingSourceField = false;
    }

    this.previousSourceFieldValue = null;
    this.currentWarningField = null;
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
      this.mappingService.getFyleFields('v1'),
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
