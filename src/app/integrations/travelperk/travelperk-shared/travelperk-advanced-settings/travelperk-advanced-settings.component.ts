import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastSeverity, TrackingApp, Page, TravelPerkOnboardingState, TravelperkUpdateEvent } from 'src/app/core/models/enum/enum.model';
import { TravelperkAdvancedSettingGet, TravelperkAdvancedSettingModel } from 'src/app/core/models/travelperk/travelperk-configuration/travelperk-advanced-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';

@Component({
  selector: 'app-travelperk-advanced-settings',
  templateUrl: './travelperk-advanced-settings.component.html',
  styleUrls: ['./travelperk-advanced-settings.component.scss']
})
export class TravelperkAdvancedSettingsComponent implements OnInit {
  isOnboarding: boolean;

  isLoading: boolean;

  advancedSettings: TravelperkAdvancedSettingGet;

  advancedSettingsForm: any;

  isSaveInProgress: boolean;

  sessionStartTime: Date;

  constructor(
    private router: Router,
    private travelperkService: TravelperkService,
    private helper: HelperService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService
  ) { }

  constructPayloadAndSave() {
    this.isSaveInProgress = true;
    const advancedSettingsPayload = TravelperkAdvancedSettingModel.createAdvancedSettingPayload(this.advancedSettingsForm);
    this.travelperkService.postTravelperkAdvancedSettings(advancedSettingsPayload).subscribe((travelperkAdvancedSettingsResponse: TravelperkAdvancedSettingGet) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Advanced settings saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.TRAVELPERK, Page.ADVANCED_SETTINGS_TRAVELPERK, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === TravelPerkOnboardingState.ADVANCED_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.TRAVELPERK, TravelPerkOnboardingState.ADVANCED_SETTINGS, 3, advancedSettingsPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.TRAVELPERK,
          TravelperkUpdateEvent.ADVANCED_SETTINGS_TRAVELPERK,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.advancedSettings,
            newState: travelperkAdvancedSettingsResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(TravelPerkOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/travelperk/onboarding/done`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error saving payment profile settings, please try again later');
    });
  }

  save(): void {
    if (this.advancedSettingsForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.travelperkService.getTravelperkAdvancedSettings().subscribe((travelperkAdvancedSettingsResponse: TravelperkAdvancedSettingGet) => {
      this.advancedSettings = travelperkAdvancedSettingsResponse;
      this.advancedSettingsForm = TravelperkAdvancedSettingModel.mapAPIResponseToFormGroup(this.advancedSettings);
      this.isLoading = false;
    }, () => {
      this.advancedSettingsForm = TravelperkAdvancedSettingModel.mapAPIResponseToFormGroup(null);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
