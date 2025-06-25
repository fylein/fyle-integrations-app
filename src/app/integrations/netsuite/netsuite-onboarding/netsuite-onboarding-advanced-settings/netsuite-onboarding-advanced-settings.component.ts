import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { NetsuiteOnboardingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-netsuite-onboarding-advanced-settings',
  templateUrl: './netsuite-onboarding-advanced-settings.component.html',
  styleUrls: ['./netsuite-onboarding-advanced-settings.component.scss']
})
export class NetsuiteOnboardingAdvancedSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = new NetsuiteOnboardingModel().getOnboardingSteps('Advanced settings', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {

  }

}
