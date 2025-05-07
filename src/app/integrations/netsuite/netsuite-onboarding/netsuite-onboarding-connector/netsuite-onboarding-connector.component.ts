import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { NetsuiteOnboardingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';

@Component({
  selector: 'app-netsuite-onboarding-connector',
  templateUrl: './netsuite-onboarding-connector.component.html',
  styleUrls: ['./netsuite-onboarding-connector.component.scss']
})
export class NetsuiteOnboardingConnectorComponent implements OnInit {

  isLoading: boolean;

  isNetsuiteConnected: boolean = false;

  isNetsuiteCredentialsInvalid: boolean;

  onboardingSteps: OnboardingStepper[] = new NetsuiteOnboardingModel().getOnboardingSteps('Connect to NetSuite', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService,
    private netsuiteConnector: NetsuiteConnectorService
  ) { }

  setupConnectionStatus(eventData: boolean) {
    this.netsuiteConnector.getNetsuiteTokenHealthStatus()
    .then(isNetsuiteCredentialsValid => {
      this.isNetsuiteConnected = isNetsuiteCredentialsValid && eventData ? eventData : false;
    });
  }

  ngOnInit(): void {
    this.netsuiteConnector.getNetsuiteTokenHealthStatus()
    .then(isNetsuiteCredentialsValid => {
      this.isNetsuiteCredentialsInvalid = isNetsuiteCredentialsValid;
    });
  }
}
