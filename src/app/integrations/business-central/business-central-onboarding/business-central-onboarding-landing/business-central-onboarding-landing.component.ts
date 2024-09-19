import type { OnDestroy, OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import type { Subscription } from 'rxjs';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import type { BusinessCentralConnectorPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-connector.model';
import { BusinessCentralConnectorModel } from 'src/app/core/models/business-central/business-central-configuration/business-central-connector.model';
import { AppName, BusinessCentralOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import type { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import type { BusinessCentralConnectorService } from 'src/app/core/services/business-central/business-central-configuration/business-central-connector.service';
import type { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import type { HelperService } from 'src/app/core/services/common/helper.service';
import type { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-business-central-onboarding-landing',
  templateUrl: './business-central-onboarding-landing.component.html',
  styleUrls: ['./business-central-onboarding-landing.component.scss']
})
export class BusinessCentralOnboardingLandingComponent implements OnInit, OnDestroy {

  appName: AppName = AppName.BUSINESS_CENTRAL;

  redirectLink = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.BUSINESS_CENTRAL;

  readonly brandingConfig = brandingConfig;

  businessCentralConnectionInProgress: boolean = false;

  isIntegrationConnected: boolean = false;

  private oauthCallbackSubscription: Subscription;

  isIncorrectQBOConnectedDialogVisible: boolean;

  constructor(
    private helperService: HelperService,
    private businessCentralConnectorService: BusinessCentralConnectorService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private businessCentralHelperService: BusinessCentralHelperService,
    private workspaceService: WorkspaceService
  ) { }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isIncorrectQBOConnectedDialogVisible = false;
    if (data.hasAccepted) {
      this.router.navigate([`/integrations/qbo/onboarding/landing`]);
    }
  }

  connectBusinessCentral(): void {
    this.businessCentralConnectionInProgress = true;
    const url = `https://login.microsoftonline.com/organizations/oauth2/authorize?resource=https://api.businesscentral.dynamics.com&client_id=${environment.business_central_oauth_client_id}&redirect_uri=${environment.business_central_oauth_redirect_uri}&state=business_central_local_redirect&response_type=code`;
    this.oauthCallbackSubscription = this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      const code = callbackURL.split('code=')[1]?.split('&')[0];
      this.postBusinessCentralCredentials(code);
    });
    this.helperService.oauthHandler(url);
  }

  private postBusinessCentralCredentials(code: string): void {
    const payload: BusinessCentralConnectorPost = BusinessCentralConnectorModel.constructPayload(code, +this.workspaceService.getWorkspaceId());
    this.businessCentralConnectorService.connectBusinessCentral(payload).subscribe(() => {
      this.businessCentralHelperService.refreshBusinessCentralDimensions(true).subscribe(() => {
        this.businessCentralConnectionInProgress = false;
        this.isIntegrationConnected = true;
        this.checkProgressAndRedirect();
      });
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to Dynamic 365 Business Central. Please try again';
      if (errorMessage === 'Please choose the correct Dynamic 365 Business Central account') {
        this.isIncorrectQBOConnectedDialogVisible = false;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        this.router.navigate([`/integrations/business_central/onboarding/landing`]);
      }
    });
  }

  private checkProgressAndRedirect(): void {
    const onboardingState: BusinessCentralOnboardingState = this.workspaceService.getOnboardingState();
    if (onboardingState !== BusinessCentralOnboardingState.COMPLETE) {
      this.router.navigate(['integrations/business_central/onboarding/connector']);
    } else {
      this.router.navigate(['integrations/business_central/main/dashboard']);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.oauthCallbackSubscription) {
      this.oauthCallbackSubscription.unsubscribe();
    }
  }
}
