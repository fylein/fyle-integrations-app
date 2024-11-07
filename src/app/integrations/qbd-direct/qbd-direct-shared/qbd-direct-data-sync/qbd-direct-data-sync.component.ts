import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-data-sync',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './qbd-direct-data-sync.component.html',
  styleUrl: './qbd-direct-data-sync.component.scss'
})
export class QbdDirectDataSyncComponent {

  @Input() qbdFields: any = {
    'Chart of accounts': null,
    'Vendors': null,
    'Field 4': 12,
    'Field 5': 30
  };

  @Input() isCTAEnabled: boolean;

  ConfigurationCtaText = ConfigurationCta;

  fieldLength = Object.keys(this.qbdFields).length;

  onContinueClick() {
    // Emit output
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
