import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { QboOnboardingService } from 'src/app/core/services/qbo/qbo-configuration/qbo-onboarding.service';

@Component({
  selector: 'app-qbo-onboarding-advanced-settings',
  templateUrl: './qbo-onboarding-advanced-settings.component.html',
  styleUrls: ['./qbo-onboarding-advanced-settings.component.scss'],
  standalone: false,
})
export class QboOnboardingAdvancedSettingsComponent implements OnInit {
  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private qboOnboardingService: QboOnboardingService,
  ) {}

  ngOnInit(): void {
    this.onboardingSteps = this.qboOnboardingService.getOnboardingSteps(
      this.translocoService.translate('configuration.advancedSettings.stepName'),
      this.workspaceService.getOnboardingState(),
    );
  }
}
