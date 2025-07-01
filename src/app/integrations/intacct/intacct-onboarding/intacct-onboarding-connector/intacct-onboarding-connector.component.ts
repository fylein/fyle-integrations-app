import { Component, OnInit } from '@angular/core';
import { brandingContent } from 'src/app/branding/branding-config';
import { IntacctOnboardingModel } from 'src/app/core/models/intacct/intacct-configuration/intacct-onboarding.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';

@Component({
  selector: 'app-onboarding-intacct-connector',
  templateUrl: './intacct-onboarding-connector.component.html',
  styleUrls: ['./intacct-onboarding-connector.component.scss']
})
export class IntacctOnboardingConnectorComponent implements OnInit {

  isLoading: boolean;

  isIntacctCredentialsValid: boolean = false;

  readonly brandingContent = brandingContent.intacct.configuration.connector;

  onboardingSteps: OnboardingStepper[] = new IntacctOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService,
    private intacctConnector: IntacctConnectorService
  ) { }

  setupConnectionStatus(eventData: boolean) {
    this.intacctConnector.getIntacctTokenHealthStatus()
    .subscribe(isIntacctCredentialsValid => {
      this.isIntacctCredentialsValid = isIntacctCredentialsValid && eventData ? eventData : false;
    });
  }

  ngOnInit(): void {
    this.intacctConnector.getIntacctTokenHealthStatus(true)
    .subscribe(isIntacctCredentialsValid => {
      this.isIntacctCredentialsValid = isIntacctCredentialsValid;
    });
  }
}
