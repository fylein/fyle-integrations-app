import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { ConfigurationCta, QBOOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOCredential } from 'src/app/core/models/qbo/db/qbo-credential.model';
import { QBOConnectorModel, QBOConnectorPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-connector.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';
import { QboExportSettingsService } from 'src/app/core/services/qbo/qbo-configuration/qbo-export-settings.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qbo-onboarding-connector',
  templateUrl: './qbo-onboarding-connector.component.html',
  styleUrls: ['./qbo-onboarding-connector.component.scss']
})
export class QboOnboardingConnectorComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = new QBOOnboardingModel().getOnboardingSteps('Connect to QuickBooks Online', this.workspaceService.getOnboardingState());

  isLoading: boolean = true;

  redirectLink: string = brandingKbArticles.onboardingArticles.QBO.CONNECTOR;

  brandingConfig: BrandingConfiguration = brandingConfig;

  ConfigurationCtaText = ConfigurationCta;

  saveInProgress: boolean = false;

  qboConnectionInProgress: boolean = false;

  qboCompanyName: string;

  isContinueDisabled: boolean = true;

  showDisconnectQBO: boolean = false;

  isIncorrectQBOConnectedDialogVisible: boolean = false;

  qboTokenExpired: boolean = false;

  isQboConnected: boolean = false;

  constructor(
    private qboConnectorService: QboConnectorService,
    private qboHelperService: QboHelperService,
    private qboExportSettingsService: QboExportSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  connectQbo(): void {
    this.qboConnectionInProgress = true;
    const url = `${environment.qbo_authorize_uri}?client_id=${environment.qbo_oauth_client_id}&scope=com.intuit.quickbooks.accounting&response_type=code&redirect_uri=${environment.qbo_oauth_redirect_uri}&state=qbo_local_redirect`;

    const popup = window.open(url, 'popup', 'popup=true, width=500, height=800, left=500');

    const activePopup = setInterval(() => {
      if (popup?.location?.href?.includes('code')) {
        const callbackURL = popup?.location.href;
        const code = callbackURL.split('code=')[1].split('&')[0];
        const realmId = callbackURL.split('realmId=')[1].split('&')[0];

        this.postQboCredentials(code, realmId);

        popup.close();
      } else if (!popup || !popup.closed) {
        return;
      }

      clearInterval(activePopup);
    }, 500);
  }

  save(): void {
    // TODO
  }

  acceptWarning(isWarningAccepted: boolean): void {
    this.isIncorrectQBOConnectedDialogVisible = false;
    if (isWarningAccepted) {
      this.router.navigate([`/workspaces/onboarding/landing`]);
    }
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

  private postQboCredentials(code: string, realmId: string): void {
    const payload: QBOConnectorPost = QBOConnectorModel.constructPayload(code, realmId);

    this.qboConnectorService.connectQBO(payload).subscribe((qboCredential: QBOCredential) => {
      this.qboHelperService.refreshQBODimensions().subscribe(() => {
        this.workspaceService.setOnboardingState(QBOOnboardingState.MAP_EMPLOYEES);
        this.qboConnectionInProgress = false;
        this.qboCompanyName = qboCredential.company_name;
        this.showOrHideDisconnectQBO();
      });
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to QuickBooks Online. Please try again';
      if (errorMessage === 'Please choose the correct QuickBooks Online account') {
        this.isIncorrectQBOConnectedDialogVisible = true;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        this.router.navigate([`/integration/qbo/onboarding/landing`]);
      }
    });
  }

  private getSettings(): void {
    this.qboConnectorService.getQBOCredentials().subscribe((qboCredential: QBOCredential) => {
      this.qboCompanyName = qboCredential.company_name;
      this.showOrHideDisconnectQBO();
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

}
