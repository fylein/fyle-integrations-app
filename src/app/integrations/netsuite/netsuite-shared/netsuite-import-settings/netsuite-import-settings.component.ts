import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { DefaultDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, ConfigurationCta, NetsuiteOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { NetsuiteConfiguration } from 'src/app/core/models/netsuite/db/netsuite-workspace-general-settings.model';
import { NetsuiteImportSettingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-import-setting.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteExportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-export-settings.service';
import { NetsuiteImportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-import-settings.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';

@Component({
  selector: 'app-netsuite-import-settings',
  templateUrl: './netsuite-import-settings.component.html',
  styleUrls: ['./netsuite-import-settings.component.scss']
})
export class NetsuiteImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.NETSUITE.IMPORT_SETTING;

  isOnboarding: boolean;

  brandingConfig = brandingConfig;

  appName: AppName = AppName.NETSUITE;

  importSettingForm: FormGroup;

  netsuiteConfiguration: NetsuiteConfiguration;

  isTaxGroupSyncAllowed: boolean;

  taxCodes: DefaultDestinationAttribute[];

  isImportMerchantsAllowed: boolean;

  isImportEmployeeAllowed: boolean;

  netsuiteFields: IntegrationField[];

  fyleFields: FyleField[];

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  importSettings: any;

  customFieldForm: FormGroup = this.formBuilder.group({
    attribute_type: ['', Validators.required],
    display_name: [''],
    source_placeholder: ['', Validators.required]
  });

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.configuration.importSetting;

  constructor(
    private formBuilder: FormBuilder,
    private helperService: NetsuiteHelperService,
    private importSettingService: NetsuiteImportSettingsService,
    private mappingService: MappingService,
    private toastService: IntegrationsToastService,
    private netsuiteExportSettingService: NetsuiteExportSettingsService,
    private netsuiteConnectorService: NetsuiteConnectorService,
    private workspaceService: WorkspaceService,
    private router: Router
  ) { }

  save() {
    this.isSaveInProgress = true;
    const importSettingPayload = NetsuiteImportSettingModel.constructPayload(this.importSettingForm);
    this.importSettingService.postImportSettings(importSettingPayload).subscribe(() => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Import settings saved successfully');

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(NetsuiteOnboardingState.ADVANCED_CONFIGURATION);
        this.router.navigate([`/integrations/netsuite/onboarding/advanced_settings`]);
      }
    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving import settings, please try again later');
    });
  }


  navigateToPreviousStep(): void {
  this.router.navigate([`/integrations/netsuite/onboarding/export_settings`]);
  }


  refreshDimensions() {
    this.helperService.refreshNetsuiteDimensions().subscribe();
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getImportSettings(),
      this.mappingService.getFyleFields(),
      this.workspaceService.getConfiguration(),
      this.netsuiteConnectorService.getSubsidiaryMapping(),
      this.importSettingService.getNetsuiteFields(),
      this.netsuiteExportSettingService.getExportSettings()
    ]).subscribe(([importSettingsResponse, fyleFieldsResponse, netsuiteConfiguration, netsuiteCredentials, netsuiteFields, exportSetting]) => {
      this.importSettings = importSettingsResponse;
      this.netsuiteConfiguration = netsuiteConfiguration;

      if (netsuiteCredentials && netsuiteCredentials.country_name !== 'US') {
        this.isTaxGroupSyncAllowed = true;
      }

      if (exportSetting.configuration.employee_field_mapping === 'EMPLOYEE'){
        this.isImportEmployeeAllowed = true;
      }

      this.netsuiteFields = netsuiteFields;
      this.importSettingForm = NetsuiteImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, this.netsuiteFields);
      this.fyleFields = fyleFieldsResponse;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
