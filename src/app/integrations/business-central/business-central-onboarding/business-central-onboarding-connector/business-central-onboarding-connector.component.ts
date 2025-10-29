import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { BusinessCentralConnectorModel, BusinessCentralConnectorPost } from 'src/app/core/models/business-central/business-central-configuration/business-central-connector.model';
import { BusinessCentralCredential } from 'src/app/core/models/business-central/db/business-central-credentials.model';
import { AppName, BusinessCentralField, BusinessCentralOnboardingState, ConfigurationCta, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { BusinessCentralConnectorService } from 'src/app/core/services/business-central/business-central-configuration/business-central-connector.service';
import { BusinessCentralExportSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-export-settings.service';
import { BusinessCentralOnboardingService } from 'src/app/core/services/business-central/business-central-configuration/business-central-onboarding.service';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { BrandingConfiguration } from 'src/app/core/models/branding/branding-configuration.model';
import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { BusinessCentralDestinationAttributes } from 'src/app/core/models/business-central/db/business-central-destination-attribute.model';
import { GroupedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { BusinessCentralCompanyPost, BusinessCentralWorkspace } from 'src/app/core/models/business-central/db/business-central-workspace.model';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { UserService } from 'src/app/core/services/misc/user.service';
import { BusinessCentralMappingService } from 'src/app/core/services/business-central/business-central-core/business-central-mapping.service';
import { TranslocoService } from '@jsverse/transloco';

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

  user: MinimalUser = this.userService.getUserProfile();

  fyleOrgName: string = this.user.org_name;

  businessCentralCompanyOptions: BusinessCentralDestinationAttributes[];

  businessCentralCompanyselected: BusinessCentralDestinationAttributes;

  appName = AppName.BUSINESS_CENTRAL;

  readonly brandingStyle = brandingStyle;

  constructor(
    private onboardingService: BusinessCentralOnboardingService,
    private businessCentralConnectorService: BusinessCentralConnectorService,
    private businessCentralExportSettingsService: BusinessCentralExportSettingsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private businessCentralHelperService: BusinessCentralHelperService,
    private helperService: HelperService,
    private mappingService: MappingService,
    private mapping: BusinessCentralMappingService,
    private translocoService: TranslocoService
  ) {
  }

  disconnectBusinessCentral(): void {
    this.isLoading = true;
    this.showDisconnectBusinessCentral = false;
    this.businessCentralCompanyName = null;
    this.getCompanyOptions();
  }

  connectBusinessCentralCompany(companyDetails: BusinessCentralDestinationAttributes): void {
    this.businessCentralCompanyselected = companyDetails;
    this.isContinueDisabled = false;
  }

  connectBusinessCentral(): void {
    this.businessCentralConnectionInProgress = true;
    const url = `https://login.microsoftonline.com/organizations/oauth2/authorize?resource=https://api.businesscentral.dynamics.com&client_id=${environment.business_central_oauth_client_id}&redirect_uri=${environment.business_central_oauth_redirect_uri}&state=business_central_local_redirect&response_type=code`;

    this.oauthCallbackSubscription = this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      const code = callbackURL.split('code=')[1].split('&')[0];
      this.postBusinessCentralCredentials(code);
    });
    this.helperService.oauthHandler(url);
  }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isIncorrectBusinessCentralConnectedDialogVisible = false;
    if (data.hasAccepted) {
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

  private getCompanyOptions() {
    this.mappingService.getGroupedDestinationAttributes([BusinessCentralField.COMPANY], 'v2', 'business_central').subscribe((businessCentralCompanyDetails: GroupedDestinationAttribute) => {
      this.businessCentralConnectionInProgress = false;
      this.businessCentralCompanyOptions = businessCentralCompanyDetails.COMPANY;
      this.isBusinessCentralConnected = false;
      this.businessCentralTokenExpired = false;
      this.isContinueDisabled = true;
      this.isLoading = false;
    });
  }

  getCompanyDetails(){
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspace: BusinessCentralWorkspace) => {
      if (workspace?.business_central_company_id) {
        this.businessCentralCompanyName = workspace?.business_central_company_name;
        this.isBusinessCentralConnected = true;
        this.businessCentralTokenExpired = false;
        this.businessCentralConnectionInProgress = false;
        this.isContinueDisabled = false;
      } else {
        this.getCompanyOptions();
      }
      this.showOrHideDisconnectBusinessCentral();
    });
  }

  private postBusinessCentralCredentials(code: string): void {
    const payload: BusinessCentralConnectorPost = BusinessCentralConnectorModel.constructPayload(code, +this.workspaceService.getWorkspaceId());

    this.businessCentralConnectorService.connectBusinessCentral(payload).subscribe((businessCentralCredential: BusinessCentralCredential) => {
      this.getCompanyDetails();
    }, (error) => {
      const errorMessage = 'message' in error ? error.message : this.translocoService.translate('businessCentralOnboardingConnector.connectionFailedError');
      if (errorMessage === 'Please choose the correct Dynamic 365 Business Central account') {
        this.isIncorrectBusinessCentralConnectedDialogVisible = true;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        this.router.navigate([`/integrations/business_central/onboarding/landing`]);
      }
    });
  }

  private getSettings(): void {
    this.businessCentralConnectorService.getBusinessCentralCredentials().subscribe((businessCentralCredential: BusinessCentralCredential) => {
      this.getCompanyDetails();
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

  save(): void {
    this.saveInProgress = true;
    if (!this.businessCentralCompanyName) {
      const data: BusinessCentralCompanyPost = BusinessCentralConnectorModel.constructCompanyPost(this.businessCentralCompanyselected.destination_id, this.businessCentralCompanyselected.value);
      this.businessCentralConnectorService.postBusinessCentralCompany(data).subscribe((workspace: BusinessCentralWorkspace) => {
        this.mapping.importBusinessCentralAttributes(true).subscribe(() => {
          this.saveInProgress = false;
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('businessCentralOnboardingConnector.companySavedSuccess'));
          this.workspaceService.setOnboardingState(BusinessCentralOnboardingState.EXPORT_SETTINGS);
          this.router.navigate([`/integrations/business_central/onboarding/export_settings`]);
        });
      });
    } else {
      this.saveInProgress = false;
      this.router.navigate([`/integrations/business_central/onboarding/export_settings`]);
    }
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
