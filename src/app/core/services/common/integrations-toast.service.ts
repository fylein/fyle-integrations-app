import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsToastService {

  constructor(
    private messageService: MessageService
  ) { }

  allowToastMessageInApps = brandingFeatureConfig.allowToastMessageInApps;

  displayToastMessage(severity: ToastSeverity, summary: string, life: number = 3000): void {
    if (this.allowToastMessageInApps) {
    this.messageService.add({
      severity,
        summary,
        life
      });
    }
  }
}
