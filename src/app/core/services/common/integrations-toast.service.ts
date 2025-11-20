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

  displayToastMessage(severity: ToastSeverity, summary: string, life: number = 3000, isOnboarding: boolean = false): void {
    // Hide toast for onboarding pages in c1
    if (this.allowToastMessageInApps || (!this.allowToastMessageInApps && !isOnboarding)) {
    this.messageService.add({
      severity,
        summary,
        life
      });
    }
  }
}
