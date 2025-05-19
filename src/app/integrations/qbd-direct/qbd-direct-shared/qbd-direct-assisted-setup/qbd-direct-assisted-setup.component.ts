import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { QbdDirectAssistedSetupService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-assisted-setup.service';

@Component({
  selector: 'app-qbd-direct-assisted-setup',
  templateUrl: './qbd-direct-assisted-setup.component.html',
  styleUrls: ['./qbd-direct-assisted-setup.component.scss']
})

export class QbdDirectAssistedSetupComponent implements OnInit {
  readonly brandingFeatureConfig = brandingFeatureConfig;

  @Input() interactionType: string;

  isSlotBooked: boolean = false;

  isAssistedSetupDialogVisible: boolean;

  constructor(
    private assistedSetupService: QbdDirectAssistedSetupService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

  }

  toggleAssistedSetupDialog(): void{
    this.isAssistedSetupDialogVisible = !this.isAssistedSetupDialogVisible;
  }

  onRequestAssistedSetup(): void {
    if (this.interactionType === "BOOK_SLOT"){
      this.bookSlot();
    }
  }

  bookSlot(): void {
    if (this.isSlotBooked) {
return;
}

    this.assistedSetupService.bookSlot().subscribe({
      next: () => {
        this.toggleAssistedSetupDialog();
        this.isSlotBooked = true;
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