import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ConditionField, ExpenseFilterResponse } from 'src/app/core/models/common/advanced-settings.model';
import { EmailOption, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AppName, ConfigurationCta, ToastSeverity, XeroFyleField, XeroOnboardingState } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { XeroWorkspaceGeneralSetting } from 'src/app/core/models/xero/db/xero-workspace-general-setting.model';
import { XeroAdvancedSettingGet, XeroAdvancedSettingModel } from 'src/app/core/models/xero/xero-configuration/xero-advanced-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { OrgService } from 'src/app/core/services/org/org.service';
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

  isOnboarding: boolean = false;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.XERO.ADVANCED_SETTING;

  advancedSettings: XeroAdvancedSettingGet;

  workspaceGeneralSettings: XeroWorkspaceGeneralSetting;

  billPaymentAccounts: DestinationAttribute[];

  advancedSettingForm: FormGroup;

  memoStructure: string[] = [];

  brandingConfig = brandingConfig;

  adminEmails: EmailOption[] = [];

  paymentSyncOptions: SelectFormOption[] = XeroAdvancedSettingModel.getPaymentSyncOptions();

  org: Org = this.orgService.getCachedOrg();

  hours: SelectFormOption[] = [...Array(24).keys()].map(day => {
    return {
      label: (day + 1).toString(),
      value: day + 1
    };
  });

  ConfigurationCtaText = ConfigurationCta;

  isSaveInProgress: boolean;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.xero.configuration.advancedSettings;


  constructor(
    private advancedSettingService: XeroAdvancedSettingsService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private xeroHelperService: XeroHelperService,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private orgService: OrgService,
    private helperService: HelperService
  ) { }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/xero/onboarding/import_settings`]);
  }

  save(): void {
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

  private setupFormWatchers() {
    XeroAdvancedSettingModel.setConfigurationSettingValidatorsAndWatchers(this.advancedSettingForm);
  }


  private setupPage() {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.advancedSettingService.getAdvancedSettings(),
      this.mappingService.getDestinationAttributes(XeroFyleField.BANK_ACCOUNT, 'v1', 'xero'),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.advancedSettingService.getWorkspaceAdmins()
    ]).subscribe(response => {
      this.advancedSettings = response[0];
      this.billPaymentAccounts = response[1];
      this.workspaceGeneralSettings = response[2];
      this.adminEmails = this.advancedSettings.workspace_schedules?.additional_email_options ? this.advancedSettings.workspace_schedules?.additional_email_options.concat(response[3]).flat() : response[3];
      this.advancedSettingForm = XeroAdvancedSettingModel.mapAPIResponseToFormGroup(this.advancedSettings, this.adminEmails, this.billPaymentAccounts, this.helperService.shouldAutoEnableAccountingPeriod(this.org.created_at));

      this.setupFormWatchers();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
