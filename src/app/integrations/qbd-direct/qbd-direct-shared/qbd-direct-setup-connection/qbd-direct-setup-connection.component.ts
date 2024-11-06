import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { ConfigurationCta, QBDConnectionStatus } from 'src/app/core/models/enum/enum.model';
import { brandingConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-qbd-direct-setup-connection',
  standalone: true,
  imports: [CommonModule, SharedModule, CardModule],
  templateUrl: './qbd-direct-setup-connection.component.html',
  styleUrl: './qbd-direct-setup-connection.component.scss'
})
export class QbdDirectSetupConnectionComponent {

  @Input({required: true}) password: string;

  @Input({required: true}) isLoading: boolean;

  @Input({required: true}) connectionStatus: QBDConnectionStatus;

  @Input({required: true}) isStepCompleted: boolean;

  @Input({required: true}) isCTAEnabled: boolean;

  qbdConnectionStatus = QBDConnectionStatus;

  ConfigurationCtaText = ConfigurationCta;

  isPasswordShown: boolean = false;

  readonly brandingConfig = brandingConfig;

  onDoneClick(event: any) {
    // Emit output
  }

  onNextClick() {
    // Emit output
  }

  onClipboardCopy() {
    // Copy password to clipboard
  }

  showPassword(isPasswordVisible: boolean) {
  }

}
