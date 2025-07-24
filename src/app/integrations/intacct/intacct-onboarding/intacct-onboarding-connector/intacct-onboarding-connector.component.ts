import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { IntacctOnboardingService } from 'src/app/core/services/intacct/intacct-configuration/intacct-onboarding.service';

@Component({
    selector: 'app-onboarding-intacct-connector',
    templateUrl: './intacct-onboarding-connector.component.html',
    styleUrls: ['./intacct-onboarding-connector.component.scss'],
    standalone: false
})
export class IntacctOnboardingConnectorComponent implements OnInit {

  isLoading: boolean;

  isIntacctCredentialsValid: boolean = false;

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private intacctConnector: IntacctConnectorService,
    private translocoService: TranslocoService,
    private intacctOnboardingService: IntacctOnboardingService
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
    this.onboardingSteps = this.intacctOnboardingService.getOnboardingSteps(this.translocoService.translate('intacct.configuration.connector.stepName'), this.workspaceService.getOnboardingState());
  }
}
