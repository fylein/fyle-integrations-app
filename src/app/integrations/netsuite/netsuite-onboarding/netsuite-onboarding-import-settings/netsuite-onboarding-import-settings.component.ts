import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteOnboardingService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-onboarding.service';

@Component({
    selector: 'app-netsuite-onboarding-import-settings',
    templateUrl: './netsuite-onboarding-import-settings.component.html',
    styleUrls: ['./netsuite-onboarding-import-settings.component.scss'],
    standalone: false
})
export class NetsuiteOnboardingImportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private onboardingService: NetsuiteOnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.onboardingService.getOnboardingSteps('Import settings', this.workspaceService.getOnboardingState());
  }

}
