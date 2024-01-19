import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { BusinessCentralConnectorPost, BusinessCentralConnectorModel } from 'src/app/core/models/business-central/business-central-configuration/business-central-connector.model';
import { BusinessCentralOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { BusinessCentralConnectorService } from 'src/app/core/services/business-central/business-central-configuration/business-central-connector.service';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-business-central-onboarding-landing',
  templateUrl: './business-central-onboarding-landing.component.html',
  styleUrls: ['./business-central-onboarding-landing.component.scss']
})
export class BusinessCentralOnboardingLandingComponent implements OnInit, OnDestroy {

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
    const url = `${environment.business_central_authorize_uri}&client_id=${environment.business_central_oauth_client_id}&redirect_uri=${environment.business_central_oauth_redirect_uri}&state=business_central_local_redirect&response_type=code`;
    console.log(url,'url')
    this.oauthCallbackSubscription = this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      console.log('callback', callbackURL.split('code=')[1]?.split('&')[0])
      const code = callbackURL.split('code=')[1]?.split('&')[0];
      console.log(code,'code')
      this.postBusinessCentralCredentials(code);
    });
    console.log(url,'url2')
    this.helperService.oauthHandler(url);
  }

  private postBusinessCentralCredentials(code: string): void {
    console.log("payloada")
    const payload: BusinessCentralConnectorPost = BusinessCentralConnectorModel.constructPayload(code, +this.workspaceService.getWorkspaceId());
    console.log(payload,'payload')
    this.businessCentralConnectorService.connectBusinessCentral(payload).subscribe(() => {
      console.log("connect")
      this.businessCentralHelperService.refreshBusinessCentralDimensions(true).subscribe(() => {
        console.log("refresh")
        this.businessCentralConnectionInProgress = false;
        this.isIntegrationConnected = true;
        this.checkProgressAndRedirect(code);
      });
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to Dynamic 360 Business Central. Please try again';
      if (errorMessage === 'Please choose the correct Dynamic 360 Business Central account') {
        this.isIncorrectQBOConnectedDialogVisible = false;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        this.router.navigate([`/integrations/business_central/onboarding/landing`]);
      }
    });
  }

  private checkProgressAndRedirect(code: string): void {
    const onboardingState: BusinessCentralOnboardingState = this.workspaceService.getOnboardingState();
    if (onboardingState !== BusinessCentralOnboardingState.COMPLETE) {
      this.router.navigate(['integrations/business_central/onboarding/connector']);
    } else {
      this.postBusinessCentralCredentials(code);
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
