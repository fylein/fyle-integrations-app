import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from "../../../../shared/shared.module";
import { QbdDirectSharedComponent } from '../qbd-direct-shared.component';
import { CardModule } from 'primeng/card';
import { AppName, ButtonSize, ButtonType, ConfigurationCta, QBDDirectInteractionType } from 'src/app/core/models/enum/enum.model';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslocoModule } from '@jsverse/transloco';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-qbd-direct-download-file',
    imports: [SharedModule, CardModule, CommonModule, ProgressSpinnerModule, TranslocoModule, ButtonModule],
    templateUrl: './qbd-direct-download-file.component.html',
    styleUrl: './qbd-direct-download-file.component.scss'
})
export class QbdDirectDownloadFileComponent {

  @Input({required: true}) isLoading: boolean;

  @Input({required: true}) showDownloadLink: boolean;

  @Input({required: true}) isStepCompleted: boolean;

  @Input({required: true}) isCompanyPathInvalid: boolean;

  @Input() showAssistedSetup: boolean = true;

  @Output() nextStep = new EventEmitter();

  @Output() downloadClick: EventEmitter<string> = new EventEmitter();

  @Output() retryClick = new EventEmitter();

  @Output() manualDownload = new EventEmitter();

  @Output() back = new EventEmitter();

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  brandingStyle = brandingStyle;

  downloadFilePath: string;

  ConfigurationCtaText = ConfigurationCta;

  appName = AppName;

  QBDDirectInteractionType = QBDDirectInteractionType;

  continueToNextStep() {
    this.nextStep.emit();
  }

  onDownloadClick() {
    this.downloadClick.emit(this.downloadFilePath);
  }

  onManualDownload() {
    this.manualDownload.emit();
  }

  onRetryClick() {
    this.retryClick.emit();
  }

  onBackClick() {
    this.back.emit();
  }
}
