import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { QbdDirectAssistedSetupService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-assisted-setup.service';

@Component({
  selector: 'app-qbd-direct-assisted-setup',
  templateUrl: './qbd-direct-assisted-setup.component.html',
  styleUrls: ['./qbd-direct-assisted-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class QbdDirectAssistedSetupComponent {
  readonly brandingFeatureConfig = brandingFeatureConfig;

  @Input() interactionType: string;

  @Input() isAssistedSetupSlotBooked?: boolean = false;

  isAssistedSetupDialogVisible: boolean;

  issueDescription: string = '';

  isQuerySubmitted: boolean;

constructor(
    private assistedSetupService: QbdDirectAssistedSetupService,
    private messageService: MessageService
  ) {}

  toggleAssistedSetupDialog(): void{
    this.isQuerySubmitted = false;
    this.isAssistedSetupDialogVisible = !this.isAssistedSetupDialogVisible;
  }

  onRequestAssistedSetup(): void {
    if (this.isQuerySubmitted){
      this.toggleAssistedSetupDialog();
      return;
    }

    if (this.interactionType === "BOOK_SLOT"){
      this.bookSlot();
    }

    if (this.interactionType === "QUERY"){
      this.onSubmitQuery();
    }
  }

  onSubmitQuery(): void {
      if (!this.issueDescription.trim()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Please describe the issue you are facing'
        });
        return;
      }

      this.assistedSetupService.submitRequest(this.issueDescription).subscribe({
        next: () => {
          this.isQuerySubmitted = true;
          this.issueDescription = '';
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to submit request. Please try again.'
          });
        }
      });
  }

  bookSlot(): void {
    this.assistedSetupService.bookSlot().subscribe({
      next: () => {
        this.toggleAssistedSetupDialog();
        this.isAssistedSetupSlotBooked = true;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Something went wrong, please try again.'
        });
      }
    });
  }

}