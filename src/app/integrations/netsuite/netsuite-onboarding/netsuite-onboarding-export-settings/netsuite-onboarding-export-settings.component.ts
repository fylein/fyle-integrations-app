import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteOnboardingService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-onboarding.service';

@Component({
  selector: 'app-netsuite-onboarding-export-settings',
  templateUrl: './netsuite-onboarding-export-settings.component.html',
  styleUrls: ['./netsuite-onboarding-export-settings.component.scss']
})
export class NetsuiteOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private onboardingService: NetsuiteOnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.onboardingService.getOnboardingSteps('Export settings', this.workspaceService.getOnboardingState());
  }

}
