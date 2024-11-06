import { Component, Input } from '@angular/core';
import { SharedModule } from "../../../../shared/shared.module";
import { QbdDirectSharedComponent } from '../qbd-direct-shared.component';
import { CardModule } from 'primeng/card';
import { ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { CommonModule } from '@angular/common';
import { required } from '@rxweb/reactive-form-validators';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-qbd-direct-download-file',
  standalone: true,
  imports: [SharedModule, QbdDirectSharedComponent, CardModule, CommonModule, ProgressSpinnerModule],
  templateUrl: './qbd-direct-download-file.component.html',
  styleUrl: './qbd-direct-download-file.component.scss'
})
export class QbdDirectDownloadFileComponent {

  @Input({required: true}) isLoading: boolean;

  @Input({required: true}) showDownloadLink: boolean;

  @Input({required: true}) isStepCompleted: boolean;

  @Input({required: true}) isCompanyPathInvalid: boolean;

  downloadFilePath: string;

  ConfigurationCtaText = ConfigurationCta;

  continueToNextStep() {
  }

  onDownloadClick() {
    // Emit output
  }

  onManualDownload() {
    // Emit output
  }

  onRetryClick() {
    // Emit output
  }

}
