import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType } from 'primeng/api';
import { Subscription } from 'rxjs';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { CloneSettingExist } from 'src/app/core/models/common/clone-setting.model';
import { AppName, ConfigurationCta, ConfigurationWarningEvent, QBOOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOCredential } from 'src/app/core/models/qbo/db/qbo-credential.model';
import { QBOConnectorModel, QBOConnectorPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-connector.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { CloneSettingService } from 'src/app/core/services/common/clone-setting.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qbo-onboarding-connector',
  templateUrl: './qbo-onboarding-connector.component.html',
  styleUrls: ['./qbo-onboarding-connector.component.scss']
})
export class QboOnboardingConnectorComponent implements OnInit, OnDestroy {

  brandingContent = brandingContent.configuration.connector;

  onboardingSteps: OnboardingStepper[] = new QBOOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.QBO.CONNECTOR;

  brandingConfig: BrandingConfiguration = brandingConfig;

  ConfigurationCtaText = ConfigurationCta;

  saveInProgress: boolean = false;

  qboConnectionInProgress: boolean = false;

  qboCompanyName: string | null;

  isContinueDisabled: boolean = true;

  showDisconnectQBO: boolean = false;

  isWarningDialogVisible: boolean = false;

  qboTokenExpired: boolean = false;

  isQboConnected: boolean = false;

  private oauthCallbackSubscription: Subscription;

  readonly fyleOrgName: string = this.userService.getUserProfile().org_name;

  private isCloneSettingsDisabled: boolean;

  warningHeaderText: string;

  warningContextText: string;

  primaryButtonText: string;

  warningEvent: ConfigurationWarningEvent;

  appName = AppName.QBO;

  constructor(
    private cloneSettingService: CloneSettingService,
    private helperService: HelperService,
    private qboConnectorService: QboConnectorService,
    private qboHelperService: QboHelperService,
    private qboExportSettingsService: QboExportSettingsService,
    @Inject(Router) private route: ActivatedRoute,
    @Inject(Router) private router: Router,
    private toastService: IntegrationsToastService,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }

  connectQbo(): void {
    this.qboConnectionInProgress = true;
    const url = `${environment.qbo_authorize_uri}?client_id=${environment.qbo_oauth_client_id}&scope=com.intuit.quickbooks.accounting&response_type=code&redirect_uri=${environment.qbo_oauth_redirect_uri}&state=qbo_local_redirect`;

    this.oauthCallbackSubscription = this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      const code = callbackURL.split('code=')[1].split('&')[0];
      const realmId = callbackURL.split('realmId=')[1].split('&')[0];
      this.postQboCredentials(code, realmId);
    });

    this.helperService.oauthHandler(url);
  }

  continueToNextStep(): void {
    if (this.isContinueDisabled) {
      return;
    } else if (this.isCloneSettingsDisabled) {
      this.router.navigate(['/integrations/qbo/onboarding/employee_settings']);
      return;
    }

    if (!brandingFeatureConfig.featureFlags.cloneSettings) {
      this.router.navigate(['/integrations/qbo/onboarding/export_settings']);
    } else {
      this.checkCloneSettingsAvailablity();
    }
  }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isWarningDialogVisible = false;
    if (data.hasAccepted) {
      if (data.event === ConfigurationWarningEvent.INCORRECT_QBO_ACCOUNT_CONNECTED) {
        this.router.navigate([`/integrations/qbo/onboarding/landing`]);
      } else if (data.event === ConfigurationWarningEvent.CLONE_SETTINGS) {
        this.router.navigate(['/integrations/qbo/onboarding/clone_settings']);
      }
    }
  }

  disconnectQbo(): void {
    this.isLoading = true;
    this.qboConnectorService.disconnectQBOConnection().subscribe(() => {
      this.router.navigate(['/integrations/qbo/onboarding/landing']);
    });
  }

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
        this.router.navigate(['/integrations/qbo/onboarding/employee_settings']);
      }
    });
  }

  private showOrHideDisconnectQBO(): void {
    this.qboExportSettingsService.getExportSettings().subscribe(exportSettings => {
      // Do nothing
      this.isContinueDisabled = false;
      this.isLoading = false;

      if (!(exportSettings.workspace_general_settings?.reimbursable_expenses_object || exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object)) {
        this.showDisconnectQBO = true;
      }
    }, () => {
      // Showing Disconnect QBO button since the customer didn't set up the next step
      this.showDisconnectQBO = true;
      this.isLoading = false;
    });
  }

  private handlePostQBOConnection(qboCredential: QBOCredential): void {
    if (brandingFeatureConfig.featureFlags.mapEmployees) {
      this.workspaceService.setOnboardingState(QBOOnboardingState.MAP_EMPLOYEES);
    } else {
      this.workspaceService.setOnboardingState(QBOOnboardingState.EXPORT_SETTINGS);
    }

    this.qboConnectionInProgress = false;
    this.qboCompanyName = qboCredential.company_name;
    this.isQboConnected = true;
    this.qboTokenExpired = false;
    this.showOrHideDisconnectQBO();
  }

  private postQboCredentials(code: string, realmId: string): void {
    const payload: QBOConnectorPost = QBOConnectorModel.constructPayload(code, realmId);

    this.qboConnectorService.connectQBO(payload).subscribe((qboCredential: QBOCredential) => {
      this.qboHelperService.refreshQBODimensions().subscribe(() => {
        this.handlePostQBOConnection(qboCredential);
      }, () => {
        this.handlePostQBOConnection(qboCredential);
      });
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to QuickBooks Online. Please try again';
      if (errorMessage === 'Please choose the correct QuickBooks Online account') {
        this.warningHeaderText = 'Incorrect account selected';
        this.warningContextText = 'You had previously set up the integration with a different QuickBooks Online account. Please choose the same to restore the settings';
        this.primaryButtonText = 'Re connect';
        this.warningEvent = ConfigurationWarningEvent.INCORRECT_QBO_ACCOUNT_CONNECTED;
        this.isWarningDialogVisible = true;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        this.router.navigate([`/integrations/qbo/onboarding/landing`]);
      }
    });
  }

  private getSettings(): void {
    this.qboConnectorService.getQBOCredentials().subscribe((qboCredential: QBOCredential) => {
      this.qboCompanyName = qboCredential.company_name;
      this.showOrHideDisconnectQBO();
      this.isQboConnected = true;
    }, (error) => {
      // Token expired
      if ('id' in error.error) {
        // We have a QBO row present in DB
        this.qboTokenExpired = error.error.is_expired;
        if (this.qboTokenExpired) {
          this.qboCompanyName = error.error.company_name;
        }
      }

      this.isQboConnected = false;
      this.isContinueDisabled = true;
      this.isLoading = false;
    });
  }

  private setupPage(): void {
    const code = this.route.snapshot.queryParams.code;
    const realmId = this.route.snapshot.queryParams.realmId;
    if (code && realmId) {
      this.isLoading = false;
      this.qboConnectionInProgress = true;
      this.postQboCredentials(code, realmId);
    } else {
      this.getSettings();
    }
  }

  ngOnInit(): void {
    this.setupPage();
  }

  ngOnDestroy(): void {
    if (this.oauthCallbackSubscription) {
      this.oauthCallbackSubscription.unsubscribe();
    }
  }

}
