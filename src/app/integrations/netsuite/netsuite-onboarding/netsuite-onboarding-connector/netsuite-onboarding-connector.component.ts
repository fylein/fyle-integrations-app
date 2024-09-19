import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { NetsuiteOnboardingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-onboarding.model';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-netsuite-onboarding-connector',
  templateUrl: './netsuite-onboarding-connector.component.html',
  styleUrls: ['./netsuite-onboarding-connector.component.scss']
})
export class NetsuiteOnboardingConnectorComponent implements OnInit {

  isLoading: boolean;

  isNetsuiteConnected: boolean = false;

  onboardingSteps: OnboardingStepper[] = new NetsuiteOnboardingModel().getOnboardingSteps('Connect to NetSuite', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  setupConnectionStatus(eventData: boolean) {
    this.isNetsuiteConnected = eventData;
  }

  ngOnInit(): void {
  }
}
