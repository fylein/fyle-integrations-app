import { Component, OnInit } from '@angular/core';
import { IntacctOnboardingModel } from 'src/app/core/models/intacct/intacct-configuration/intacct-onboarding.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-intacct-onboarding-export-setting',
  templateUrl: './intacct-onboarding-export-setting.component.html',
  styleUrls: ['./intacct-onboarding-export-setting.component.scss']
})
export class IntacctOnboardingExportSettingComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = new IntacctOnboardingModel().getOnboardingSteps('Export Settings', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
