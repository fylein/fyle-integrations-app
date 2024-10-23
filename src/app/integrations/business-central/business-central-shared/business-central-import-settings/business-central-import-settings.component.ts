import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { BusinessCentralImportSettingsGet, BusinessCentralImportSettingsModel } from 'src/app/core/models/business-central/business-central-configuration/business-central-import-settings.model';
import { AppName, AppNameInService, BusinessCentralOnboardingState, BusinessCentralUpdateEvent, ConfigurationCta, DefaultImportFields, Page, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { BusinessCentralImportSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-import-settings.service';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { businessCentralFieldsResponse, fyleFieldsResponse, importSettingsResponse } from '../business-central.fixture';
import { ExpenseField } from 'src/app/core/models/common/import-settings.model';

@Component({
  selector: 'app-business-central-import-settings',
  templateUrl: './business-central-import-settings.component.html',
  styleUrls: ['./business-central-import-settings.component.scss']
})
export class BusinessCentralImportSettingsComponent implements OnInit {

  isOnboarding: boolean;

  importSettings: BusinessCentralImportSettingsGet | null;

  importSettingForm: FormGroup;

  fyleFields: FyleField[];

  businessCentralFields: IntegrationField[];

  isLoading: boolean = true;

  isPreviewDialogVisible: boolean;

  customFieldForm: FormGroup;

  showCustomFieldDialog: boolean;

  customFieldType: string;

  customFieldControl: AbstractControl;

  customField: ExpenseField;

  customFieldOption: ExpenseField[] = [{ attribute_type: 'custom_field', display_name: 'Create a Custom Field', source_placeholder: null, is_dependent: false }];

  readonly brandingConfig = brandingConfig;

  readonly supportArticleLink: string = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.IMPORT_SETTING;

  readonly appName: string = AppName.BUSINESS_CENTRAL;

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  sessionStartTime: Date = new Date();

  constructor(
    private router: Router,
    private importSettingService: BusinessCentralImportSettingsService,
    private mappingService: MappingService,
    private helperService: BusinessCentralHelperService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private helper: HelperService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService
  ) { }

  get expenseFieldsGetter() {
    return this.importSettingForm.get('expenseFields') as FormArray;
  }

  closeModel() {
    this.customFieldForm.reset();
    this.showCustomFieldDialog = false;
  }

  showPreviewDialog(visible: boolean) {
    this.isPreviewDialogVisible = visible;
  }

  closeDialog() {
    this.isPreviewDialogVisible = false;
  }

  refreshDimensions(isRefresh: boolean) {
    this.helperService.importAttributes(isRefresh);
  }

  saveFyleExpenseField(): void {
    this.customField = {
      attribute_type: this.customFieldForm.get('attribute_type')?.value.split(' ').join('_').toUpperCase(),
      display_name: this.customFieldForm.get('attribute_type')?.value,
      source_placeholder: this.customFieldForm.get('source_placeholder')?.value,
      is_dependent: false
    };

    if (this.customFieldControl) {
      this.fyleFields.pop();
      this.fyleFields.push(this.customField);
      this.fyleFields.push(this.customFieldOption[0]);
      const expenseField = {
        source_field: this.customField.attribute_type,
        destination_field: this.customFieldControl.get('destination_field')?.value,
        import_to_fyle: true,
        is_custom: true,
        source_placeholder: this.customField.source_placeholder
      };
      (this.importSettingForm.get('expenseFields') as FormArray).controls.filter(field => field.get('destination_field')?.value === this.customFieldControl.get('destination_field')?.value)[0].patchValue(expenseField);
      this.customFieldForm.reset();
      this.showCustomFieldDialog = false;
    }
  }

  private initializeCustomFieldForm(shouldShowDialog: boolean) {
    this.customFieldForm = this.formBuilder.group({
      attribute_type: ['', Validators.required],
      display_name: [''],
      source_placeholder: ['', Validators.required]
    });
    this.showCustomFieldDialog = shouldShowDialog;
  }

  private importSettingWatcher(): void {
    const expenseFieldArray = this.importSettingForm.get('expenseFields') as FormArray;
    expenseFieldArray.controls.forEach((control:any) => {
      control.valueChanges.subscribe((value: { source_field: string; destination_field: string; }) => {
        if (value.source_field === 'custom_field') {
          this.initializeCustomFieldForm(true);
          this.customFieldType = '';
          this.customFieldControl = control;
          this.customFieldControl.patchValue({
            source_field: '',
            destination_field: control.get('destination_field')?.value,
            import_to_fyle: control.get('import_to_fyle')?.value,
            is_custom: control.get('is_custom')?.value,
            source_placeholder: null
          });
        }
      });
    });
  }

  private setupFormWatchers() {
    this.importSettingWatcher();
  }

  private constructPayloadAndSave() {
    this.isSaveInProgress = true;
    const importSettingPayload = BusinessCentralImportSettingsModel.createImportSettingPayload(this.importSettingForm);
    this.importSettingService.postBusinessCentralImportSettings(importSettingPayload).subscribe((importSettingsResponse: BusinessCentralImportSettingsGet) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Import settings saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.BUSINESS_CENTRAL, Page.IMPORT_SETTINGS_BUSINESS_CENTRAL, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === BusinessCentralOnboardingState.IMPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.BUSINESS_CENTRAL, BusinessCentralOnboardingState.IMPORT_SETTINGS, 3, importSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.BUSINESS_CENTRAL,
          BusinessCentralUpdateEvent.ADVANCED_SETTINGS_BUSINESS_CENTRAL,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.importSettings,
            newState: importSettingsResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(BusinessCentralOnboardingState.ADVANCED_SETTINGS);
        this.router.navigate([`/integrations/business_central/onboarding/advanced_settings`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving import settings, please try again later');
      });
  }

  save(): void {
    if (this.importSettingForm.valid) {
      this.constructPayloadAndSave();
    }
  }


  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getBusinessCentralImportSettings().pipe(catchError(() => of(null))),
      this.mappingService.getFyleFields(),
      this.mappingService.getIntegrationsFields(AppNameInService.BUSINESS_CENTRAL)
    ]).subscribe(([importSettingsResponse, fyleFieldsResponse, businessCentralFieldsResponse]) => {
      this.importSettings = importSettingsResponse;
      this.importSettingForm = BusinessCentralImportSettingsModel.mapAPIResponseToFormGroup(this.importSettings, businessCentralFieldsResponse);
      this.fyleFields = fyleFieldsResponse;
      this.businessCentralFields = businessCentralFieldsResponse;
      this.fyleFields.push({ attribute_type: 'custom_field', display_name: 'Create a Custom Field', is_dependent: false });
      this.setupFormWatchers();
      this.initializeCustomFieldForm(false);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

  navigateBack(): void {
    this.router.navigate([`/integrations/business_central/onboarding/export_settings`]);
  }

}
