import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { CheckBoxUpdate } from 'src/app/core/models/common/helper.model';

interface PrerequisiteStep {
  id: number;
  isComplete: boolean;
}

@Component({
  selector: 'app-qbd-direct-prerequisites-v2',
  imports: [CommonModule, SharedModule, TranslocoModule],
  templateUrl: './qbd-direct-prerequisites-v2.component.html',
  styleUrl: './qbd-direct-prerequisites-v2.component.scss'
})
export class QbdDirectPrerequisitesV2Component {
  @Output() continue = new EventEmitter<void>();

  // Component state
  isLoading: boolean = false;

  isContinueDisabled: boolean = true;

  prerequisiteSteps: PrerequisiteStep[] = [
    { id: 1, isComplete: false },
    { id: 2, isComplete: false }
  ];

  // Constants for template
  readonly appName: AppName = AppName.QBD_DIRECT;

  readonly ConfigurationCtaText = ConfigurationCta;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingConfig = brandingConfig;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  updatePrerequisiteStatus(status: CheckBoxUpdate): void {
    const step = this.prerequisiteSteps.find(s => s.id === status.id);
    if (step) {
      step.isComplete = status.value;
    }

    // Enable continue button only when all steps are complete
    this.isContinueDisabled = !this.prerequisiteSteps.every(s => s.isComplete);
  }

  onContinueClick(): void {
    if (!this.isContinueDisabled) {
      this.continue.emit();
    }
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
