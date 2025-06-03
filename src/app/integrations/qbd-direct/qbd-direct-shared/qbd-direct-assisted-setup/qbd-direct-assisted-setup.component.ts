import { Component, Input, ViewEncapsulation } from '@angular/core';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ToastSeverity, QBDDirectInteractionType } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { QbdDirectAssistedSetupService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-assisted-setup.service';

@Component({
  selector: 'app-qbd-direct-assisted-setup',
  templateUrl: './qbd-direct-assisted-setup.component.html',
  styleUrls: ['./qbd-direct-assisted-setup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class QbdDirectAssistedSetupComponent {
  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingConfig = brandingConfig;

  readonly brandingKbArticles = brandingKbArticles;

  @Input() interactionType: QBDDirectInteractionType | undefined;

  @Input() isAssistedSetupSlotBooked?: boolean = false;

  isAssistedSetupDialogVisible: boolean;

  issueDescription: string = '';

  isQuerySubmitted: boolean;

constructor(
    private assistedSetupService: QbdDirectAssistedSetupService,
    private toastService: IntegrationsToastService
  ) {}

  get nativeWindow(): Window {
    return window;
  }

  get isButtonDisabled(): boolean {
    return this.interactionType === QBDDirectInteractionType.QUERY && !this.issueDescription.trim() && !this.isQuerySubmitted;
  }

  toggleAssistedSetupDialog(): void{
    this.isQuerySubmitted = false;
    this.isAssistedSetupDialogVisible = !this.isAssistedSetupDialogVisible;
    if(!this.isAssistedSetupDialogVisible){
      this.issueDescription = '';
    }
  }

  onRequestAssistedSetup(): void {
    if (this.isQuerySubmitted){
      this.toggleAssistedSetupDialog();
      return;
    }

    if (this.interactionType === QBDDirectInteractionType.BOOK_SLOT){
      this.bookSlot();
    }

    if (this.interactionType === QBDDirectInteractionType.QUERY){
      this.onSubmitQuery();
    }
  }

  onSubmitQuery(): void {
      this.assistedSetupService.submitRequest(this.issueDescription).subscribe({
        next: () => {
          this.isQuerySubmitted = true;
        },
        error: () => {
          this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Failed to submit request. Please try again.');
        }
      });
  }

  openQBDArticle(): void {
    this.nativeWindow.open(brandingKbArticles.onboardingArticles.QBD_DIRECT.CONNECTOR, '_blank');
  }

  bookSlot(): void {
    this.assistedSetupService.bookSlot().subscribe({
      next: () => {
        this.toggleAssistedSetupDialog();
        this.isAssistedSetupSlotBooked = true;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Your request has been received.');
      },
      error: () => {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong, please try again.');
      }
    });
  }

}