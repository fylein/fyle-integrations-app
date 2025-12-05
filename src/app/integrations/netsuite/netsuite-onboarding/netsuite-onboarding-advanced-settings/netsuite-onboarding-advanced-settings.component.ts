import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteOnboardingService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-onboarding.service';

@Component({
    selector: 'app-netsuite-onboarding-advanced-settings',
    templateUrl: './netsuite-onboarding-advanced-settings.component.html',
    styleUrls: ['./netsuite-onboarding-advanced-settings.component.scss'],
    standalone: false
})
export class NetsuiteOnboardingAdvancedSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private onboardingService: NetsuiteOnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.onboardingService.getOnboardingSteps('Advanced settings', this.workspaceService.getOnboardingState());
  }

}
