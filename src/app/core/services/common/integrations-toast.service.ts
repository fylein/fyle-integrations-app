import { Injectable } from '@angular/core';
import type { MessageService } from 'primeng/api';
import type { ToastSeverity } from 'src/app/core/models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsToastService {

  constructor(
    private messageService: MessageService
  ) { }

  displayToastMessage(severity: ToastSeverity, summary: string, life: number = 3000): void {
    this.messageService.add({
      severity,
      summary,
      life
    });
  }
}
