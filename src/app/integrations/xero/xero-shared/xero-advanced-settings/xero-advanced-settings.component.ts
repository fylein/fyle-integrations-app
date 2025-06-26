import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { environment } from 'src/environments/environment';
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
import { AdvancedSettingsModel } from 'src/app/core/models/common/advanced-settings.model';
import { TranslocoService } from '@jsverse/transloco';

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

  memoPreviewText: string;

  defaultMemoFields: string[] = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  workspaceGeneralSettings: XeroWorkspaceGeneralSetting;

  billPaymentAccounts: DestinationAttribute[];

  advancedSettingForm: FormGroup;

  memoStructure: string[] = [];

  brandingConfig = brandingConfig;

  adminEmails: EmailOption[] = [];

  paymentSyncOptions: SelectFormOption[] = XeroAdvancedSettingModel.getPaymentSyncOptions();

  org: Org = this.orgService.getCachedOrg();

  hours: SelectFormOption[] = AdvancedSettingsModel.getHoursOptions();

  ConfigurationCtaText = ConfigurationCta;

  isSaveInProgress: boolean;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;


  constructor(
    private advancedSettingService: XeroAdvancedSettingsService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private xeroHelperService: XeroHelperService,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private orgService: OrgService,
    private helperService: HelperService,
    private translocoService: TranslocoService
  ) { }

  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/xero/onboarding/import_settings`]);
  }

  onMultiSelectChange() {
    const memo = this.advancedSettingForm.controls.memoStructure.value;
    const changedMemo = AdvancedSettingsModel.formatMemoPreview(memo, this.defaultMemoFields)[1];
    this.advancedSettingForm.controls.memoStructure.patchValue(changedMemo);
  }

  save(): void {
    const advancedSettingPayload = XeroAdvancedSettingModel.constructPayload(this.advancedSettingForm);
    this.isSaveInProgress = true;

    this.advancedSettingService.postAdvancedSettings(advancedSettingPayload).subscribe(() => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('xeroAdvancedSettings.advancedSettingsSuccess'));

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(XeroOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/xero/onboarding/done`]);
      }
    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('xeroAdvancedSettings.advancedSettingsError'));
    });
  }

  refreshDimensions() {
    this.xeroHelperService.refreshXeroDimensions().subscribe();
  }

  private setupFormWatchers() {
    XeroAdvancedSettingModel.setConfigurationSettingValidatorsAndWatchers(this.advancedSettingForm);
  }

  private formatMemoPreview(): void {
    const time = Date.now();
    const today = new Date(time);

    const previewValues: { [key: string]: string } = {
      employee_email: this.translocoService.translate('xeroAdvancedSettings.previewEmployeeEmail'),
      category: this.translocoService.translate('xeroAdvancedSettings.previewCategory'),
      purpose: this.translocoService.translate('xeroAdvancedSettings.previewPurpose'),
      merchant: this.translocoService.translate('xeroAdvancedSettings.previewMerchant'),
      report_number: this.translocoService.translate('xeroAdvancedSettings.previewReportNumber'),
      spent_on: today.toLocaleDateString(),
      expense_link: `${environment.fyle_app_url}/app/main/#/enterprise/view_expense/`
    };

    this.memoPreviewText = '';
    const memo: string[] = [];
    this.memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        const defaultIndex = this.defaultMemoFields.indexOf(this.memoStructure[index]);
        memo[defaultIndex] = previewValues[field];
      }
    });
    memo.forEach((field, index) => {
      this.memoPreviewText += field;
      if (index + 1 !== memo.length) {
        this.memoPreviewText = this.memoPreviewText + ' - ';
      }
    });
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingForm.get('memoStructure')?.value;
    this.formatMemoPreview();
    this.advancedSettingForm.controls.memoStructure.valueChanges.subscribe((memoChanges) => {
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
    });
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
      this.advancedSettingForm = XeroAdvancedSettingModel.mapAPIResponseToFormGroup(this.advancedSettings, this.adminEmails, this.billPaymentAccounts, this.helperService.shouldAutoEnableAccountingPeriod(this.org.created_at), this.isOnboarding);
      this.setupFormWatchers();
      this.createMemoStructureWatcher();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
