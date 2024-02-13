import { Component, OnInit } from '@angular/core';
import { IntacctOnboardingModel } from 'src/app/core/models/intacct/intacct-configuration/intacct-onboarding.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-intacct-onboarding-import-setting',
  templateUrl: './intacct-onboarding-import-setting.component.html',
  styleUrls: ['./intacct-onboarding-import-setting.component.scss']
})
export class IntacctOnboardingImportSettingComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = new IntacctOnboardingModel().getOnboardingSteps('Import Settings', this.workspaceService.getOnboardingState());


  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
