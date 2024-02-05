import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

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

  @Output() resetCloneSetting = new EventEmitter();

  @Output() save = new EventEmitter();

  @Output() navigateToPreviousStep = new EventEmitter();

  readonly brandingFeatureConfig = brandingFeatureConfig;

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
