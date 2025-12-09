import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import { NetsuiteOnboardingService } from 'src/app/core/services/netsuite/netsuite-configuration/netsuite-onboarding.service';

@Component({
  selector: 'app-netsuite-onboarding-connector',
  templateUrl: './netsuite-onboarding-connector.component.html',
  styleUrls: ['./netsuite-onboarding-connector.component.scss'],
  standalone: false,
})
export class NetsuiteOnboardingConnectorComponent implements OnInit {
  isLoading: boolean;

  isNetsuiteCredentialsValid: boolean;

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private netsuiteConnector: NetsuiteConnectorService,
    private toastService: IntegrationsToastService,
    private onboardingService: NetsuiteOnboardingService,
  ) {}

  setupConnectionStatus(eventData: boolean) {
    this.netsuiteConnector.getNetsuiteTokenHealthStatus().subscribe((isNetsuiteCredentialsValid) => {
      this.isNetsuiteCredentialsValid = isNetsuiteCredentialsValid && eventData ? eventData : false;
    });
  }

  ngOnInit(): void {
    this.netsuiteConnector.getNetsuiteTokenHealthStatus(true).subscribe((isNetsuiteCredentialsValid) => {
      this.isNetsuiteCredentialsValid = isNetsuiteCredentialsValid;
    });
    this.onboardingSteps = this.onboardingService.getOnboardingSteps(
      'Connect to NetSuite',
      this.workspaceService.getOnboardingState(),
    );
  }
}
