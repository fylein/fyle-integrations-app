import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteOnboardingService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-onboarding.service';

@Component({
  selector: 'app-netsuite-onboarding-connector',
  templateUrl: './netsuite-onboarding-connector.component.html',
  styleUrls: ['./netsuite-onboarding-connector.component.scss']
})
export class NetsuiteOnboardingConnectorComponent implements OnInit {

  isLoading: boolean;

  isNetsuiteConnected: boolean = false;

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private onboardingService: NetsuiteOnboardingService
  ) { }

  setupConnectionStatus(eventData: boolean) {
    this.isNetsuiteConnected = eventData;
  }

  ngOnInit(): void {
    this.onboardingSteps = this.onboardingService.getOnboardingSteps('Connect to NetSuite', this.workspaceService.getOnboardingState());
  }
}
