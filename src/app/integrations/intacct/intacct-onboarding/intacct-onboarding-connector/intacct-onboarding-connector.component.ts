import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { brandingContent } from 'src/app/branding/branding-config';
import { IntacctOnboardingModel } from 'src/app/core/models/intacct/intacct-configuration/intacct-onboarding.model';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-onboarding-intacct-connector',
  templateUrl: './intacct-onboarding-connector.component.html',
  styleUrls: ['./intacct-onboarding-connector.component.scss']
})
export class IntacctOnboardingConnectorComponent implements OnInit {

  isLoading: boolean;

  isIntacctConnected: boolean = false;

  readonly brandingContent = brandingContent.intacct.configuration.connector;

  onboardingSteps: OnboardingStepper[] = new IntacctOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  setupConnectionStatus(eventData: boolean) {
    this.isIntacctConnected = eventData;
  }

  ngOnInit(): void {
  }
}
