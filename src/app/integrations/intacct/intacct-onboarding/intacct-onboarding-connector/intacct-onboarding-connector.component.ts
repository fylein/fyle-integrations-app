import { Component, OnInit } from '@angular/core';
import { IntacctOnboardingModel } from 'src/app/core/models/intacct/intacct-configuration/intacct-onboarding.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-onboarding-intacct-connector',
  templateUrl: './intacct-onboarding-connector.component.html',
  styleUrls: ['./intacct-onboarding-connector.component.scss']
})
export class IntacctOnboardingConnectorComponent implements OnInit {

  isLoading: boolean;

  isIntacctConnected: boolean = false;

  onboardingSteps: OnboardingStepper[] = new IntacctOnboardingModel().getOnboardingSteps('Connect to Sage Intacct', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  setupConnectionStatus(eventData: boolean) {
    this.isIntacctConnected = eventData;
  }

  ngOnInit(): void {
  }
}
