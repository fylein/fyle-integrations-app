import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { brandingConfig } from 'src/app/branding/branding-config';
import { WindowService } from 'src/app/core/services/common/window.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  readonly brandingConfig = brandingConfig;

  constructor(
    private messageService: MessageService,
    private windowService: WindowService,
    private translocoService: TranslocoService
  ) { }

  emailSupport(): void {
    this.windowService.redirect(`mailto:${brandingConfig.supportEmail}`);
  }

  copyToClipboard(): void {
    const selBox = document.createElement('textarea');
    selBox.value = brandingConfig.supportEmail;
    document.body.appendChild(selBox);
    selBox.select();
    selBox.click();
    document.execCommand('copy');

    this.messageService.add({
      severity: 'success',
      summary: this.translocoService.translate('error.clipboardSuccessMessage')
    });

    document.body.removeChild(selBox);
    event?.stopPropagation();
  }

  ngOnInit(): void {
  }

}
