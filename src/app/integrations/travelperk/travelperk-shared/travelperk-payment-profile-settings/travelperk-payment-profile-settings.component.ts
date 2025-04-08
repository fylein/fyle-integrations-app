import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta, Page, Sage300OnboardingState, ToastSeverity, TrackingApp, TravelPerkOnboardingState, TravelperkUpdateEvent } from 'src/app/core/models/enum/enum.model';
import { TravelperkPaymentProfileSettingResponse, TravelperkPaymentProfileSettingModel } from 'src/app/core/models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';
import { travelperkPaymentProfileMappingResponse } from '../travelperk.fixture';
import { SelectFormLabel, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';

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

  userRole: SelectFormOption[] = TravelperkPaymentProfileSettingModel.getUserRoleOptions();

  isSaveInProgress: boolean;

  readonly brandingConfig = brandingConfig;

  paymentProfileSettings: TravelperkPaymentProfileSettingResponse;

  sessionStartTime: Date = new Date();

  supportArticleLink: string = brandingKbArticles.onboardingArticles.TRAVELPERK.PAYMENT_PROFILE_SETTINGS;

  ConfigurationCtaText = ConfigurationCta;

  isPreviewDialogVisible: boolean;

  limit: number = 5;

  destinationAttributeNames: SelectFormLabel = {
    label: 'profile_name',
    value: 'profile_name'
  };

  sourceAttributeNames: SelectFormLabel = {
    label: 'label',
    value: 'value'
  };

  readonly brandingStyle = brandingStyle;

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

  constructPayloadAndSave(): void {
    this.isSaveInProgress = true;
    const paymentProfileMappingPayload = TravelperkPaymentProfileSettingModel.createPaymentProfileSettingPayload(this.paymentProfileMappingForm);
    this.travelperkService.postTravelperkPaymentProfileMapping(paymentProfileMappingPayload).subscribe((travelperkPaymentProfileMappingResponse) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Payment profile settings saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.TRAVELPERK, Page.PAYMENT_PROFILE_SETTINGS_TRAVELPERK, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === TravelPerkOnboardingState.PAYMENT_PROFILE_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.TRAVELPERK, TravelPerkOnboardingState.PAYMENT_PROFILE_SETTINGS, 2, paymentProfileMappingPayload);
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
        this.workspaceService.setOnboardingState(TravelPerkOnboardingState.ADVANCED_SETTINGS);
        this.router.navigate([`/integrations/travelperk/onboarding/advanced_settings`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving payment profile settings, please try again later');
    });
  }

  save() {
    if (this.paymentProfileMappingForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  getProfileMappings(limit: number) {
    this.travelperkService.getTravelperkPaymentProfileMapping(limit).subscribe((travelperkPaymentProfileMappingResponse: TravelperkPaymentProfileSettingResponse) => {
      this.paymentProfileSettings = travelperkPaymentProfileMappingResponse;
      this.paymentProfileMappingForm = TravelperkPaymentProfileSettingModel.mapAPIResponseToFormGroup(this.paymentProfileSettings.results);
      this.isLoading = false;
    }, () => {
      this.paymentProfileMappingForm = TravelperkPaymentProfileSettingModel.mapAPIResponseToFormGroup(null);
      this.isLoading = false;
    });
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.getProfileMappings(this.limit);
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
