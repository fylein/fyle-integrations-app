import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-qbo-onboarding-export-settings',
  templateUrl: './qbo-onboarding-export-settings.component.html',
  styleUrls: ['./qbo-onboarding-export-settings.component.scss']
})
export class QboOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = new QBOOnboardingModel().getOnboardingSteps('Export Settings', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
