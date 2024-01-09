import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BusinessCentralConnectorModel, BusinessCentralConnectorPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-connector.model';
import { BusinessCentralCompanyDetails, BusinessCentralCredential } from 'src/app/core/models/business-central/db/business-central-credentials.model';
import { BusinessCentralOnboardingState, ConfigurationCta, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { BusinessCentralConnectorService } from 'src/app/core/services/business-central/business-central-configuration/business-central-connector.service';
import { BusinessCentralExportSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-export-settings.service';
import { BusinessCentralOnboardingService } from 'src/app/core/services/business-central/business-central-configuration/business-central-onboarding.service';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';

@Component({
  selector: 'app-business-central-onboarding-connector',
  templateUrl: './business-central-onboarding-connector.component.html',
  styleUrls: ['./business-central-onboarding-connector.component.scss']
})
export class BusinessCentralOnboardingConnectorComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  redirectLink = brandingKbArticles.topLevelArticles.BUSINESS_CENTRAL;

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps('Connect to Dynamics \n 365 Business Central');

  connectBusinessCentralForm: FormGroup;

  brandingConfig: BrandingConfiguration = brandingConfig;

  ConfigurationCtaText = ConfigurationCta;

  businessCentralCompanyName: string | null;

  saveInProgress: boolean = false;

  businessCentralConnectionInProgress: boolean = false;

  isIncorrectBusinessCentralConnectedDialogVisible: boolean = false;

  isContinueDisabled: boolean = true;

  showDisconnectBusinessCentral: boolean = false;

  businessCentralTokenExpired: boolean = false;

  isBusinessCentralConnected: boolean = false;

  private oauthCallbackSubscription: Subscription;

  constructor(
    private onboardingService: BusinessCentralOnboardingService,
    private businessCentralConnectorService: BusinessCentralConnectorService,
    private businessCentralExportSettingsService: BusinessCentralExportSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private businessCentralHelperService: BusinessCentralHelperService,
    private helperService: HelperService
  ) { }

  continueToNextStep(): void {
    if (this.isContinueDisabled) {
      return;
    }

    this.router.navigate(['/integrations/business_central/onboarding/export_settings']);
  }

  disconnectBusinessCentral(): void {
    this.isLoading = true;
    this.businessCentralConnectorService.disconnectBusinessCentralConnection().subscribe(() => {
      this.showDisconnectBusinessCentral = false;
      this.businessCentralCompanyName = null;
      this.getSettings();
    });
  }

  connectBusinessCentral(): void {
    this.businessCentralConnectionInProgress = true;
    const url = `${environment.business_central_authorize_uri}client_id=${environment.business_central_oauth_client_id}&redirect_uri=${environment.business_central_oauth_redirect_uri}&state=business_central_local_redirect&response_type=code`;

    this.oauthCallbackSubscription = this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      const code = callbackURL.split('code=')[1].split('&')[0];
      this.postBusinessCentralCredentials(code);
    });
    this.helperService.oauthHandler(url);
  }

  acceptWarning(isWarningAccepted: boolean): void {
    this.isIncorrectBusinessCentralConnectedDialogVisible = false;
    if (isWarningAccepted) {
      this.router.navigate([`/integrations/business_central/onboarding/connector`]);
    }
  }

  private showOrHideDisconnectBusinessCentral(): void {
    this.businessCentralExportSettingsService.getExportSettings().subscribe(exportSettings => {
      // Do nothing
      this.isContinueDisabled = false;
      this.isLoading = false;

      if (!(exportSettings?.reimbursable_expenses_export_type || exportSettings?.credit_card_expense_export_type)) {
        this.showDisconnectBusinessCentral = true;
      }
    }, () => {
      // Showing Disconnect Business Central button since the customer didn't set up the next step
      this.showDisconnectBusinessCentral = true;
      this.isLoading = false;
    });
  }

  private postBusinessCentralCredentials(code: string): void {
    const payload: BusinessCentralConnectorPost = BusinessCentralConnectorModel.constructPayload(code, +this.workspaceService.getWorkspaceId());

    this.businessCentralConnectorService.connectBusinessCentral(payload).subscribe((businessCentralCredential: BusinessCentralCredential) => {
      this.businessCentralConnectorService.getBusinessCentralCompany().subscribe((businessCentralCompanyDetails: BusinessCentralCompanyDetails) => {
        this.businessCentralHelperService.refreshBusinessCentralDimensions().subscribe(() => {
          this.workspaceService.setOnboardingState(BusinessCentralOnboardingState.EXPORT_SETTINGS);
          this.businessCentralConnectionInProgress = false;
          this.businessCentralCompanyName = businessCentralCompanyDetails.business_central_company;
          this.isBusinessCentralConnected = true;
          this.businessCentralTokenExpired = false;
          this.showOrHideDisconnectBusinessCentral();
        });
      });
    }, (error) => {
      const errorMessage = 'message' in error ? error.message : 'Failed to connect to Dynamic 360 Business Central. Please try again';
      if (errorMessage === 'Please choose the correct Dynamic 360 Business Central account') {
        this.isIncorrectBusinessCentralConnectedDialogVisible = true;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        this.router.navigate([`/integrations/business_central/onboarding/landing`]);
      }
    });
  }

  private getSettings(): void {
    this.businessCentralConnectorService.getBusinessCentralCredentials().subscribe((businessCentralCredential: BusinessCentralCredential) => {
      this.businessCentralConnectorService.getBusinessCentralCompany().subscribe((businessCentralCompanyDetails: BusinessCentralCompanyDetails) => {
        this.businessCentralCompanyName = businessCentralCompanyDetails.business_central_company;
        this.showOrHideDisconnectBusinessCentral();
        this.isBusinessCentralConnected= true;
      });
    }, (error) => {
      // Token expired
      if ('id' in error.error) {
        // We have a BusinessCentral row present in DB
        this.businessCentralTokenExpired = error.error.is_expired;
        if (this.businessCentralTokenExpired) {
          this.businessCentralCompanyName = error.error.company_name;
        }
      }

      this.isBusinessCentralConnected = false;
      this.isContinueDisabled = true;
      this.isLoading = false;
    });
  }

  private setupPage(): void {
    const code = this.route.snapshot.queryParams.code;
    if (code) {
      this.isLoading = false;
      this.businessCentralConnectionInProgress = true;
      this.postBusinessCentralCredentials(code);
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
