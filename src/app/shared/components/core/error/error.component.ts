import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { MessageService } from 'primeng/api';
import { brandingConfig } from 'src/app/branding/branding-config';
import type { WindowService } from 'src/app/core/services/common/window.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  readonly brandingConfig = brandingConfig;

  constructor(
    private messageService: MessageService,
    private windowService: WindowService
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
      summary: 'Support Email copied to clipboard'
    });

    document.body.removeChild(selBox);
    event?.stopPropagation();
  }

  ngOnInit(): void {
  }

}
