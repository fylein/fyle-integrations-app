import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from "../../../../shared/shared.module";
import { QbdDirectSharedComponent } from '../qbd-direct-shared.component';
import { CardModule } from 'primeng/card';
import { AppName, ConfigurationCta, QBDDirectInteractionType } from 'src/app/core/models/enum/enum.model';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-qbd-direct-download-file',
  standalone: true,
  imports: [SharedModule, CardModule, CommonModule, ProgressSpinnerModule],
  templateUrl: './qbd-direct-download-file.component.html',
  styleUrl: './qbd-direct-download-file.component.scss'
})
export class QbdDirectDownloadFileComponent {

  @Input({required: true}) isLoading: boolean;

  @Input({required: true}) showDownloadLink: boolean;

  @Input({required: true}) isStepCompleted: boolean;

  @Input({required: true}) isCompanyPathInvalid: boolean;

  @Output() nextStep = new EventEmitter();

  @Output() downloadClick: EventEmitter<string> = new EventEmitter();

  @Output() retryClick = new EventEmitter();

  @Output() manualDownload = new EventEmitter();

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

}
