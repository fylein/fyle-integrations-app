import { Component, OnInit } from '@angular/core';
import { Sage300OnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { Sage300OnboardingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-onboarding.service';

@Component({
  selector: 'app-sage300-onboarding-export-settings',
  templateUrl: './sage300-onboarding-export-settings.component.html',
  styleUrls: ['./sage300-onboarding-export-settings.component.scss']
})
export class Sage300OnboardingExportSettingsComponent implements OnInit {

  onboardingstep: Sage300OnboardingState = this.workspaceService.getOnboardingState();

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps(Sage300OnboardingState.EXPORT_SETTINGS.replace('_', ' '), this.onboardingstep);

  constructor(
    private onboardingService: Sage300OnboardingService,
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
