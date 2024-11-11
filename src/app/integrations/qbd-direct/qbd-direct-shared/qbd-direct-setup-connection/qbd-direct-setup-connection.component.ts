import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { ConfigurationCta, QBDConnectionStatus } from 'src/app/core/models/enum/enum.model';
import { brandingConfig } from 'src/app/branding/branding-config';
import { checkBoxEmit } from 'src/app/core/models/common/helper.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-qbd-direct-setup-connection',
  standalone: true,
  imports: [CommonModule, SharedModule, CardModule],
  templateUrl: './qbd-direct-setup-connection.component.html',
  styleUrl: './qbd-direct-setup-connection.component.scss'
})
export class QbdDirectSetupConnectionComponent {

  @Input({required: true}) password: string = '098765';

  @Input({required: true}) isLoading: boolean;

  @Input({required: true}) connectionStatus: QBDConnectionStatus;

  @Input({required: true}) isStepCompleted: boolean;

  @Input({required: true}) isCTAEnabled: boolean;

  @Input({required: true}) showSection: boolean;

  @Output() doneClick: EventEmitter<checkBoxEmit> = new EventEmitter();

  @Output() nextClick = new EventEmitter();

  qbdConnectionStatus = QBDConnectionStatus;

  ConfigurationCtaText = ConfigurationCta;

  isPasswordShown: boolean = false;

  readonly brandingConfig = brandingConfig;

  constructor(private messageService: MessageService) {}

  onDoneClick(event: checkBoxEmit) {
    this.doneClick.emit(event);
  }

  onNextClick() {
    this.nextClick.emit();
  }

  onClipboardCopy() {
    const selBox = document.createElement('textarea');
    selBox.value = this.password;
    document.body.appendChild(selBox);
    selBox.select();
    selBox.click();
    document.execCommand('copy');

    this.messageService.add({
      severity: 'success',
      summary: 'Password copied to clipboard'
    });

    document.body.removeChild(selBox);
    event?.stopPropagation();
  }

  showPassword(isPasswordVisible: boolean) {
    this.isPasswordShown = isPasswordVisible;
  }

}
