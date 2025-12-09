import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { XeroOnboardingService } from 'src/app/core/services/xero/xero-configuration/xero-onboarding.service';

@Component({
  selector: 'app-xero-onboarding-advanced-settings',
  templateUrl: './xero-onboarding-advanced-settings.component.html',
  styleUrls: ['./xero-onboarding-advanced-settings.component.scss'],
  standalone: false,
})
export class XeroOnboardingAdvancedSettingsComponent implements OnInit {
  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private xeroOnboardingService: XeroOnboardingService,
  ) {}

  ngOnInit(): void {
    this.onboardingSteps = this.xeroOnboardingService.getOnboardingSteps(
      this.translocoService.translate('xero.configuration.advancedSettings.stepName'),
      this.workspaceService.getOnboardingState(),
    );
  }
}
