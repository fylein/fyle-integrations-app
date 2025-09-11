import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ToastSeverity, QBDDirectInteractionType, ButtonType, ButtonSize, ClickEvent, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
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

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  @Input() interactionType: QBDDirectInteractionType | undefined;

  @Input() isAssistedSetupSlotBooked?: boolean = false;

  isAssistedSetupDialogVisible: boolean;

  issueDescription: string = '';

  isQuerySubmitted: boolean;

constructor(
    private assistedSetupService: QbdDirectAssistedSetupService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService,
    private trackingService: TrackingService
  ) {}

  get nativeWindow(): Window {
    return window;
  }

  get isButtonDisabled(): boolean {
    return this.interactionType === QBDDirectInteractionType.QUERY && !this.issueDescription.trim() && !this.isQuerySubmitted;
  }

  toggleAssistedSetupDialog(): void{
    if (!this.isAssistedSetupDialogVisible) {
      this.trackingService.onClickEvent(TrackingApp.QBD_DIRECT, ClickEvent.QBD_DIRECT_ASSISTED_SETUP_DIALOG);
    }

    this.isQuerySubmitted = false;
    this.isAssistedSetupDialogVisible = !this.isAssistedSetupDialogVisible;
    if (!this.isAssistedSetupDialogVisible){
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
          this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectAssistedSetup.failedToSubmitRequest'));
        }
      });
  }

  openQBDArticle(): void {
    this.nativeWindow.open(brandingKbArticles.onboardingArticles.QBD_DIRECT.ASSISTED_SETUP_ARTICLE_LINK, '_blank');
  }

  bookSlot(): void {
    this.trackingService.onClickEvent(TrackingApp.QBD_DIRECT, ClickEvent.QBD_DIRECT_ASSISTED_SETUP_BOOKED);

    this.assistedSetupService.bookSlot().subscribe({
      next: () => {
        this.toggleAssistedSetupDialog();
        this.isAssistedSetupSlotBooked = true;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('qbdDirectAssistedSetup.requestReceived'));
        this.nativeWindow.open(brandingKbArticles.onboardingArticles.QBD_DIRECT.GCAL_LINK, '_blank');
      },
      error: () => {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('qbdDirectAssistedSetup.somethingWentWrong'));
      }
    });
  }

}
