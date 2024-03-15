import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { DefaultDestinationAttribute, DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { FyleField, IntegrationField } from 'src/app/core/models/db/mapping.model';
import { AppName, ConfigurationCta, QBOCorporateCreditCardExpensesObject, QBOField, QBOReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { NetsuiteImportSettingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-import-setting.model';
import { QBOWorkspaceGeneralSetting } from 'src/app/core/models/qbo/db/workspace-general-setting.model';
import { QBOExportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-export-setting.model';
import { QBOImportSettingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-import-setting.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteExportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-export-settings.service';
import { NetsuiteImportSettingsService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-import-settings.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';
import { QboImportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-import-settings.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';

@Component({
  selector: 'app-netsuite-import-settings',
  templateUrl: './netsuite-import-settings.component.html',
  styleUrls: ['./netsuite-import-settings.component.scss']
})
export class NetsuiteImportSettingsComponent implements OnInit {

  isLoading: boolean = true;

  supportArticleLink: string = brandingKbArticles.onboardingArticles.QBO.IMPORT_SETTING;

  isOnboarding: boolean;

  brandingConfig = brandingConfig;

  appName: AppName = AppName.NETSUITE;

  importSettingForm: FormGroup;

  chartOfAccountTypesList: string[] = QBOImportSettingModel.getChartOfAccountTypesList();

  workspaceGeneralSettings: QBOWorkspaceGeneralSetting;

  QBOReimbursableExpensesObject = QBOReimbursableExpensesObject;

  QBOCorporateCreditCardExpensesObject = QBOCorporateCreditCardExpensesObject;

  isTaxGroupSyncAllowed: boolean;

  taxCodes: DefaultDestinationAttribute[];

  isImportMerchantsAllowed: boolean;
  
  isImportEmployeeAllowed: boolean;

  qboFields: IntegrationField[];

  fyleFields: FyleField[];

  isSaveInProgress: boolean;

  ConfigurationCtaText = ConfigurationCta;

  importSettings: any;


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
    console.log('save');
  }


  navigateToPreviousStep(): void {
    this.router.navigate([`/integrations/qbo/onboarding/export_settings`]);
  }


  refreshDimensions() {
    this.helperService.refreshNetsuiteDimensions().subscribe();
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.importSettingService.getImportSettings(),
      this.mappingService.getFyleFields(),
      this.workspaceService.getWorkspaceGeneralSettings(),
      this.netsuiteConnectorService.getSubsidiaryMapping(),
      this.importSettingService.getQBOFields(),
      this.netsuiteExportSettingService.getExportSettings()
    ]).subscribe(([importSettingsResponse, fyleFieldsResponse, workspaceGeneralSettings, qboCredentials, qboFields, exportSetting]) => {
      this.importSettings = importSettingsResponse;
      this.workspaceGeneralSettings = workspaceGeneralSettings;

      if (qboCredentials && qboCredentials.country_name !== 'US') {
        this.isTaxGroupSyncAllowed = true;
      }

      console.log('this.wo', exportSetting)
      if (exportSetting.configuration.employee_field_mapping == 'EMPLOYEE'){
        this.isImportEmployeeAllowed = true;
      }
      this.importSettingForm = NetsuiteImportSettingModel.mapAPIResponseToFormGroup(this.importSettings, this.qboFields);
      this.fyleFields = fyleFieldsResponse;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
