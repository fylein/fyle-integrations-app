import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { NetsuiteOnboardingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-netsuite-onboarding-import-settings',
  templateUrl: './netsuite-onboarding-import-settings.component.html',
  styleUrls: ['./netsuite-onboarding-import-settings.component.scss']
})
export class NetsuiteOnboardingImportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = new NetsuiteOnboardingModel().getOnboardingSteps('Import settings', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
