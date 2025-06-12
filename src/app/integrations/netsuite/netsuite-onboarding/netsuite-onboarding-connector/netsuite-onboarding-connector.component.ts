import { Component, OnInit } from '@angular/core';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { NetsuiteOnboardingModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-onboarding.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';

@Component({
  selector: 'app-netsuite-onboarding-connector',
  templateUrl: './netsuite-onboarding-connector.component.html',
  styleUrls: ['./netsuite-onboarding-connector.component.scss']
})
export class NetsuiteOnboardingConnectorComponent implements OnInit {

  isLoading: boolean;

  isNetsuiteCredentialsValid: boolean;

  onboardingSteps: OnboardingStepper[] = new NetsuiteOnboardingModel().getOnboardingSteps('Connect to NetSuite', this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService,
    private netsuiteConnector: NetsuiteConnectorService,
    private toastService: IntegrationsToastService
  ) { }

  setupConnectionStatus(eventData: boolean) {
    this.netsuiteConnector.getNetsuiteTokenHealthStatus()
    .subscribe(isNetsuiteCredentialsValid => {
      this.isNetsuiteCredentialsValid = isNetsuiteCredentialsValid && eventData ? eventData : false;
    });
  }

  ngOnInit(): void {
    this.netsuiteConnector.getNetsuiteTokenHealthStatus()
    .subscribe(isNetsuiteCredentialsValid => {
      this.isNetsuiteCredentialsValid = isNetsuiteCredentialsValid;
      if (!this.isNetsuiteCredentialsValid){
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! Your NetSuite connection expired, please connect again', 6000);
      }
    });
  }
}
