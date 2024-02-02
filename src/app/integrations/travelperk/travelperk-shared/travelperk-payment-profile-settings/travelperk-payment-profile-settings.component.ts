import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta, Page, Sage300OnboardingState, ToastSeverity, TrackingApp, TravelPerkOnboardingState, TravelperkUpdateEvent } from 'src/app/core/models/enum/enum.model';
import { TravelPerkPaymetProfileSettingFormOption, TravelperkPaymentProfileSettingGetPaginator, TravelperkPaymentProfileSettingModel } from 'src/app/core/models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';
import { travelperkPaymentProfileMappingResponse } from '../travelperk.fixture';

@Component({
  selector: 'app-travelperk-payment-profile-settings',
  templateUrl: './travelperk-payment-profile-settings.component.html',
  styleUrls: ['./travelperk-payment-profile-settings.component.scss']
})
export class TravelperkPaymentProfileSettingsComponent implements OnInit {

  appName: string = AppName.TRAVELPERK;

  isLoading: boolean = true;

  isOnboarding: boolean;

  paymentProfileMappingForm: FormGroup;

  userRole: TravelPerkPaymetProfileSettingFormOption[] = TravelperkPaymentProfileSettingModel.getUserRoles();

  isSaveInProgress: boolean;

  readonly brandingConfig = brandingConfig;

  paymentProfileSettings: TravelperkPaymentProfileSettingGetPaginator;

  sessionStartTime: Date = new Date();

  supportArticleLink: string = brandingKbArticles.onboardingArticles.SAGE300.IMPORT_SETTING;

  ConfigurationCtaText = ConfigurationCta;

  isPreviewDialogVisible: boolean;

  constructor(
    private router: Router,
    private travelperkService: TravelperkService,
    private helper: HelperService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService
  ) { }

  navigateBack(): void {
    this.router.navigate([`/integrations/travelperk/onboarding/landing`]);
  }

  closeDialog() {
    this.isPreviewDialogVisible = false;
  }

  showPreviewDialog(visible: boolean) {
    this.isPreviewDialogVisible = visible;
  }

  constructPayloadAndSave() {
    this.isSaveInProgress = true;
    const paymentProfileMappingPayload = TravelperkPaymentProfileSettingModel.createPaymentProfileSettingPayload(this.paymentProfileMappingForm);
    this.travelperkService.postTravelperkPaymentProfileMapping(paymentProfileMappingPayload).subscribe((travelperkPaymentProfileMappingResponse) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Import settings saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.TRAVELPERK, Page.PAYMENT_PROFILE_SETTINGS_TRAVELPERK, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === TravelPerkOnboardingState.PAYMENT_PROFILE_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.TRAVELPERK, TravelPerkOnboardingState.PAYMENT_PROFILE_SETTINGS, 3, paymentProfileMappingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.TRAVELPERK,
          TravelperkUpdateEvent.ADVANCED_SETTINGS_TRAVELPERK,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.paymentProfileSettings,
            newState: travelperkPaymentProfileMappingResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(Sage300OnboardingState.ADVANCED_SETTINGS);
        this.router.navigate([`/integrations/travelperk/onboarding/advanced_settings`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving payment profile settings, please try again later');
    });
  }

  save(): void {
    if (this.paymentProfileMappingForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    // This.travelperkService.getTravelperkPaymentProfileMapping().subscribe((travelperkPaymentProfileMappingResponse: TravelperkPaymentProfileSettingGetPaginator) => {
      this.paymentProfileSettings = travelperkPaymentProfileMappingResponse;
      this.paymentProfileMappingForm = TravelperkPaymentProfileSettingModel.mapAPIResponseToFormGroup(this.paymentProfileSettings.results);
      this.isLoading = false;
    // }, () => {
    //   This.paymentProfileMappingForm = TravelperkPaymentProfileSettingModel.mapAPIResponseToFormGroup(null);
    //   This.isLoading = false;
    // });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
