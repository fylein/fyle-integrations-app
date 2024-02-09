import { Component, OnInit } from '@angular/core';
import { IntacctOnboardingModel } from 'src/app/core/models/intacct/intacct-configuration/intacct-onboarding.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-intacct-onboarding-advanced-setting',
  templateUrl: './intacct-onboarding-advanced-setting.component.html',
  styleUrls: ['./intacct-onboarding-advanced-setting.component.scss']
})
export class IntacctOnboardingAdvancedSettingComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = new IntacctOnboardingModel().getOnboardingSteps('Advanced Settings', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
