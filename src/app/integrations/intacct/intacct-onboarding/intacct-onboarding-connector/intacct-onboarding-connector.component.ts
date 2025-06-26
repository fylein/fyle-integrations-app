import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
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

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService
  ) { }

  setupConnectionStatus(eventData: boolean) {
    this.isIntacctConnected = eventData;
  }

  ngOnInit(): void {
    this.onboardingSteps = new IntacctOnboardingModel().getOnboardingSteps(this.translocoService.translate('intacct.configuration.connector.stepName'), this.workspaceService.getOnboardingState());
  }
}
