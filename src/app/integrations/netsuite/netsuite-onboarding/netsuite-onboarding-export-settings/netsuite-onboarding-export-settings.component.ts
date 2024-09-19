import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { NetsuiteOnboardingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-onboarding.model';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-netsuite-onboarding-export-settings',
  templateUrl: './netsuite-onboarding-export-settings.component.html',
  styleUrls: ['./netsuite-onboarding-export-settings.component.scss']
})
export class NetsuiteOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = new NetsuiteOnboardingModel().getOnboardingSteps('Export Settings', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {

  }

}
