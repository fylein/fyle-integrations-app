import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-qbo-onboarding-employee-settings',
  templateUrl: './qbo-onboarding-employee-settings.component.html',
  styleUrls: ['./qbo-onboarding-employee-settings.component.scss']
})
export class QboOnboardingEmployeeSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = new QBOOnboardingModel().getOnboardingSteps('Map Employees', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
