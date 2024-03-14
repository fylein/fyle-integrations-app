import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { AdvancedSettingsModel, ConditionField, ExpenseFilterPayload, ExpenseFilterResponse, SkipExportModel, SkipExportValidatorRule, skipExportValidator } from 'src/app/core/models/common/advanced-settings.model';
import { EmailOption, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ToastSeverity, XeroFyleField, XeroOnboardingState } from 'src/app/core/models/enum/enum.model';
import { XeroWorkspaceGeneralSetting } from 'src/app/core/models/xero/db/xero-workspace-general-setting.model';
import { XeroAdvancedSettingGet, XeroAdvancedSettingModel } from 'src/app/core/models/xero/xero-configuration/xero-advanced-settings.model';
import { ConfigurationService } from 'src/app/core/services/common/configuration.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { SkipExportService } from 'src/app/core/services/common/skip-export.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { XeroAdvancedSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-advanced-settings.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';

@Component({
  selector: 'app-xero-advanced-settings',
  templateUrl: './xero-advanced-settings.component.html',
  styleUrls: ['./xero-advanced-settings.component.scss']
})
export class XeroAdvancedSettingsComponent implements OnInit {

  appName: AppName = AppName.XERO;

  isLoading: boolean = true;

  saveInProgress: boolean;

  isOnboarding: boolean = false;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.XERO.ADVANCED_SETTING;

  skipExportRedirectLink: string = brandingKbArticles.onboardingArticles.XERO.SKIP_EXPORT;

  advancedSettings: XeroAdvancedSettingGet;

  workspaceGeneralSettings: XeroWorkspaceGeneralSetting;

  billPaymentAccounts: DestinationAttribute[];

  expenseFilters: ExpenseFilterResponse;

  conditionFieldOptions: ConditionField[];

  advancedSettingForm: FormGroup;

  skipExportForm: FormGroup;

  memoStructure: string[] = [];

  brandingConfig = brandingConfig;

  adminEmails: EmailOption[] = [];

  paymentSyncOptions: SelectFormOption[] = XeroAdvancedSettingModel.getPaymentSyncOptions();

  hours: SelectFormOption[] = [...Array(24).keys()].map(day => {
    return {
      label: (day + 1).toString(),
      value: day + 1
    };
  });

  ConfigurationCtaText = ConfigurationCta;

  isSaveInProgress: boolean;

  constructor(
    private advancedSettingService: XeroAdvancedSettingsService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private skipExportService: SkipExportService,
    private helper: HelperService,
    private xeroHelperService: XeroHelperService,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService
  ) { }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/xero/onboarding/import_settings`]);
  }

  private saveSkipExportFields(): void {
    if (!this.skipExportForm.valid) {
      return;
    }
    let valueField = this.skipExportForm.getRawValue();
    if (!valueField.condition1.field_name) {
      return;
    }
    valueField = SkipExportModel.constructSkipExportValue(valueField);
    valueField.rank = 1;
    const skipExportRank1: ExpenseFilterPayload = SkipExportModel.constructExportFilterPayload(valueField);
    const payload1 = SkipExportModel.constructSkipExportPayload(skipExportRank1, this.skipExportForm.value.value1);
    this.skipExportService.postExpenseFilter(payload1).subscribe(() => {
      if (valueField.condition2 && valueField.operator2) {
        valueField.rank = 2;
        const skipExportRank2: ExpenseFilterPayload = SkipExportModel.constructExportFilterPayload(valueField);
        const payload2 = SkipExportModel.constructSkipExportPayload(skipExportRank2, this.skipExportForm.value.value2);
        this.skipExportService.postExpenseFilter(payload2).subscribe(() => {});
      }
    });
  }

  private saveSkipExport(): void {
    if (!this.advancedSettingForm.value.skipExport && this.expenseFilters.results.length > 0){
      this.expenseFilters.results.forEach((value) => {
        this.deleteExpenseFilter(value.id);
      });
    }
    if (this.advancedSettingForm.value.skipExport) {
      this.saveSkipExportFields();
    }
  }

  save(): void {
    this.saveSkipExport();
    const advancedSettingPayload = XeroAdvancedSettingModel.constructPayload(this.advancedSettingForm);
    this.isSaveInProgress = true;

    this.advancedSettingService.postAdvancedSettings(advancedSettingPayload).subscribe(() => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Advanced settings saved successfully');

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(XeroOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/xero/onboarding/done`]);
      }
    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving advanced settings, please try again later');
    });
  }

  refreshDimensions() {
    this.xeroHelperService.refreshXeroDimensions().subscribe();
  }

  deleteExpenseFilter(id: number) {
    this.skipExportService.deleteExpenseFilter(id).subscribe();
  }


  skipExportWatcher(): void {
    const skipExportFormWatcherFields: SkipExportValidatorRule = {
      condition1: ['operator1', 'value1'],
      condition2: ['operator2', 'value2'],
      operator1: ['value1'],
      operator2: ['value2']
    };
    this.helper.setConfigurationSettingValidatorsAndWatchers(skipExportFormWatcherFields, this.skipExportForm);

    const formWatcher: skipExportValidator = {
      'isChanged': ['condition1', 'operator1', 'value1'],
      'isNotChanged': ['condition1', 'operator1', 'value1', 'condition2', 'operator2', 'value2', 'join_by']
    };
    this.helper.handleSkipExportFormInAdvancedSettingsUpdates(this.skipExportForm, formWatcher, this.advancedSettingForm);
  }

  private setupFormWatchers() {
    XeroAdvancedSettingModel.setConfigurationSettingValidatorsAndWatchers(this.advancedSettingForm);
    this.skipExportWatcher();
  }


  private setupPage() {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.advancedSettingService.getAdvancedSettings(),
      this.mappingService.getDestinationAttributes(XeroFyleField.BANK_ACCOUNT, 'v1', 'xero'),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.advancedSettingService.getWorkspaceAdmins(),
      this.skipExportService.getExpenseFilter(),
      this.skipExportService.getExpenseFields('v1')
    ]).subscribe(response => {
      this.advancedSettings = response[0];
      this.billPaymentAccounts = response[1];
      this.workspaceGeneralSettings = response[2];
      this.adminEmails = this.advancedSettings.workspace_schedules?.additional_email_options ? this.advancedSettings.workspace_schedules?.additional_email_options.concat(response[3]) : response[3];
      this.expenseFilters = response[4];
      this.conditionFieldOptions = response[5];

      const isSkipExportEnabled = this.expenseFilters.count > 0;
      this.advancedSettingForm = XeroAdvancedSettingModel.mapAPIResponseToFormGroup(this.advancedSettings, isSkipExportEnabled, this.adminEmails);

      this.skipExportForm = SkipExportModel.setupSkipExportForm(this.expenseFilters, [], this.conditionFieldOptions);

      this.setupFormWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
