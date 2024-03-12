import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { CloneSettingExist } from 'src/app/core/models/common/clone-setting.model';
import { ConfigurationCta, ConfigurationWarningEvent, ToastSeverity, XeroOnboardingState } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { XeroCredentials } from 'src/app/core/models/xero/db/xero-credential.model';
import { XeroDestinationAttributes } from 'src/app/core/models/xero/db/xero-destination-attribute.model';
import { TenantMapping, TenantMappingPost } from 'src/app/core/models/xero/db/xero-tenant-mapping.model';
import { XeroExportSettingGet } from 'src/app/core/models/xero/xero-configuration/xero-export-settings.model';
import { XeroOnboardingModel } from 'src/app/core/models/xero/xero-configuration/xero-onboarding.model';
import { CloneSettingService } from 'src/app/core/services/common/clone-setting.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { XeroConnectorService } from 'src/app/core/services/xero/xero-configuration/xero-connector.service';
import { XeroExportSettingsService } from 'src/app/core/services/xero/xero-configuration/xero-export-settings.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-xero-onboarding-connector',
  templateUrl: './xero-onboarding-connector.component.html',
  styleUrls: ['./xero-onboarding-connector.component.scss']
})
export class XeroOnboardingConnectorComponent implements OnInit {

  brandingContent = brandingContent.xero.configuration.connector;

  onboardingSteps: OnboardingStepper[] = new XeroOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.XERO.CONNECTOR;

  brandingConfig: BrandingConfiguration = brandingConfig;

  ConfigurationCtaText = ConfigurationCta;

  saveInProgress: boolean = false;

  xeroConnectionInProgress: boolean = false;

  xeroCompanyName: string | null;

  isContinueDisabled: boolean = true;

  showDisconnectQBO: boolean = false;

  isWarningDialogVisible: boolean = false;

  xeroTokenExpired: boolean = false;

  isXeroConnected: boolean = false;

  private oauthCallbackSubscription: Subscription;

  readonly fyleOrgName: string = this.userService.getUserProfile().org_name;

  private isCloneSettingsDisabled: boolean;

  warningHeaderText: string;

  warningContextText: string;

  primaryButtonText: string;

  warningEvent: ConfigurationWarningEvent;

  showDisconnectXero: boolean;

  tenantList: XeroDestinationAttributes[];

  xeroTenantselected: XeroDestinationAttributes;

  constructor(
    private workspaceService: WorkspaceService,
    private userService: UserService,
    private xeroConnectorService: XeroConnectorService,
    private exportSettingService: XeroExportSettingsService,
    private helperService: HelperService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private cloneSettingService: CloneSettingService,
    private xeroHelperService: XeroHelperService
  ) { }

  private checkCloneSettingsAvailablity(): void {
    this.cloneSettingService.checkCloneSettingsExists().subscribe((response: CloneSettingExist) => {
      if (response.is_available) {
        this.warningHeaderText = 'Your settings are pre-filled';
        this.warningContextText = `Your previous organization's settings <b>(${response.workspace_name})</b> have been copied over to the current organization
        <br><br>You can change the settings or reset the configuration to restart the process from the beginning<br>`;
        this.primaryButtonText = 'Continue';
        this.warningEvent = ConfigurationWarningEvent.CLONE_SETTINGS;
        this.isWarningDialogVisible = true;
        this.isContinueDisabled = false;
        this.isCloneSettingsDisabled = true;
      } else {
        this.router.navigate(['/integrations/xero/onboarding/export_settings']);
      }
    });
  }

  disconnectXero(): void {
    this.isLoading = true;
    this.xeroConnectorService.revokeXeroConnection(this.workspaceService.getWorkspaceId()).subscribe(() => {
      this.showDisconnectXero = false;
      this.xeroCompanyName = null;
      this.xeroConnectionInProgress = false;
      this.isXeroConnected = false;
      this.isContinueDisabled = true;
      this.xeroConnectorService.getXeroCredentials(this.workspaceService.getWorkspaceId()).subscribe((xeroCredentials: XeroCredentials) => {
        this.showOrHideDisconnectXero();
      }, (error) => {
        // Token expired
        if ('id' in error.error) {
          // We have a Xero row present in DB
          this.xeroTokenExpired = error.error.is_expired;
          if (this.xeroTokenExpired) {
            this.xeroCompanyName = error.error.company_name;
          }
        }
        this.isContinueDisabled = true;
        this.isXeroConnected = false;
        this.isLoading = false;
      });
    });
  }

  private postXeroCredentials(code: string): void {
    this.xeroConnectorService.connectXero(this.workspaceService.getWorkspaceId(), code).subscribe((xeroCredentials: XeroCredentials) => {
      this.isXeroConnected = true;
      this.xeroConnectionInProgress = false;
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to Xero Tenant. Please try again';
      if (errorMessage === 'Please choose the correct Xero Tenten') {
        this.isXeroConnected = false;
        this.xeroConnectionInProgress = false;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        this.router.navigate([`/integrations/xero/onboarding/landing`]);
      }
    });
  }

  connectXero(companyDetails: XeroDestinationAttributes): void {
    this.xeroTenantselected = companyDetails;
    this.isContinueDisabled = false;
  }

  connectToXero() {
    this.xeroConnectionInProgress = true;
    const url = `${environment.xero_authorize_uri}?client_id=${environment.xero_oauth_client_id}&scope=${environment.xero_scope}&response_type=code&redirect_uri=${environment.xero_oauth_redirect_uri}&state=xero_local_redirect`;
    this.oauthCallbackSubscription = this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      const code = callbackURL.split('code=')[1]?.split('&')[0];
      this.postXeroCredentials(code);
    });
    this.helperService.oauthHandler(url);
  }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isWarningDialogVisible = false;
    if (data.hasAccepted) {
      if (data.event === ConfigurationWarningEvent.CLONE_SETTINGS) {
        this.router.navigate(['/integrations/xero/onboarding/clone_settings']);
      }
    }
  }

  private constructPayloadAndSave(): void {
    if (this.isContinueDisabled) {
      return;
    } else if (this.isCloneSettingsDisabled) {
      this.router.navigate(['/integrations/xero/onboarding/export_settings']);
      return;
    }
    if (this.xeroTenantselected && !this.isContinueDisabled) {
      this.xeroConnectionInProgress = true;
      this.isContinueDisabled = true;
      const tenantMappingPayload: TenantMappingPost = {
        tenant_id: this.xeroTenantselected.id.toString(),
        tenant_name: this.xeroTenantselected.value
      };
      this.xeroConnectorService.postTenantMapping(tenantMappingPayload).subscribe((response:TenantMapping) => {
        this.xeroHelperService.refreshXeroDimensions().subscribe(() => {
          this.workspaceService.setOnboardingState(XeroOnboardingState.EXPORT_SETTINGS);
          this.xeroConnectionInProgress = false;
          this.xeroTokenExpired = false;
          this.showOrHideDisconnectXero();
          this.isXeroConnected = true;
          this.xeroCompanyName = response.tenant_name;
          this.checkCloneSettingsAvailablity();
        });
      });
    } else if (!this.isContinueDisabled && this.xeroCompanyName){
      this.checkCloneSettingsAvailablity();
    }
  }

  save(): void {
    if (this.isContinueDisabled) {
      return;
    } else if (this.isCloneSettingsDisabled) {
      this.constructPayloadAndSave();
      return;
    }

    if (!brandingFeatureConfig.featureFlags.cloneSettings) {
      this.constructPayloadAndSave();
    } else {
      this.checkCloneSettingsAvailablity();
    }
  }

  getTenant() {
    this.xeroConnectorService.getXeroTenants().subscribe((tenantList: XeroDestinationAttributes[]) => {
      this.tenantList = tenantList;
    });
  }

  private showOrHideDisconnectXero(): void {
    this.exportSettingService.getExportSettings().subscribe((exportSettings: XeroExportSettingGet) => {
      // Do nothing
      this.isLoading = false;

      if (!(exportSettings.workspace_general_settings?.reimbursable_expenses_object || exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object)) {
        this.showDisconnectXero = true;
      }
    }, () => {
      // Showing Disconnect Xero button since the customer didn't set up the next step
      this.showDisconnectXero = true;
      this.isLoading = false;
    });
  }

  private setupPage() {
    this.xeroConnectorService.getTenantMappings().subscribe((tenant: TenantMapping) => {
      this.xeroCompanyName = tenant.tenant_name;
      this.isXeroConnected = true;
      this.isContinueDisabled = false;
      this.showOrHideDisconnectXero();
      this.xeroConnectionInProgress = false;
    },
    () => {
      this.getTenant();
      this.isXeroConnected = false;
      this.isContinueDisabled = true;
      this.showOrHideDisconnectXero();
      this.xeroConnectionInProgress = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
