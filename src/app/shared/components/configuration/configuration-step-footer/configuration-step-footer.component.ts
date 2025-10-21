import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, ButtonSize, ButtonType, ConfigurationCta, QBDDirectInteractionType } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-configuration-step-footer',
  templateUrl: './configuration-step-footer.component.html',
  styleUrls: ['./configuration-step-footer.component.scss']
})
export class ConfigurationStepFooterComponent implements OnInit {

  @Input() ctaText: string;

  @Input() isButtonDisabled: boolean;

  @Input() showBackButton: boolean;

  @Input() showResetButton: boolean;

  @Input() AppName: string;

  @Input() shouldShowQBDAssistedSetup?: boolean;

  @Input() qbdDirectInteractionType?: QBDDirectInteractionType;

  @Output() resetCloneSetting = new EventEmitter();

  @Output() save = new EventEmitter();

  @Output() navigateToPreviousStep = new EventEmitter();

  appName = AppName;

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingConfig = brandingConfig;

  readonly ConfigurationCta = ConfigurationCta;

  constructor() { }

  ngOnInit(): void {}

  navigate(): void {
    this.navigateToPreviousStep.emit();
  }

  resetConfiguration(): void {
    this.resetCloneSetting.emit();
  }

  saveChanges(): void {
    this.save.emit();
  }

}
