import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { SyncDataType } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-connector.model';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-data-sync',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslocoModule],
  templateUrl: './qbd-direct-data-sync.component.html',
  styleUrl: './qbd-direct-data-sync.component.scss'
})
export class QbdDirectDataSyncComponent implements OnInit {

  @Input({required: true}) qbdFields: SyncDataType[];

  @Input({required: true}) isLoading: boolean;

  @Input({required: true}) isCTAEnabled: boolean;

  @Input({required: true}) showSection: boolean;

  @Output() continueClick = new EventEmitter();

  appName = AppName;

  fieldLength: number;

  ConfigurationCtaText = ConfigurationCta;

  brandingConfig = brandingConfig;

  brandingFeatureConfig = brandingFeatureConfig;

  brandingStyle = brandingStyle;

  onContinueClick() {
    this.continueClick.emit();
  }

  ngOnInit() {
    this.qbdFields = [
      { attribute_type: 'Category', count: 5 },
      { attribute_type: 'Tag', count: 12 },
      { attribute_type: 'Label', count: null },
      { attribute_type: 'Priority', count: 0 }
    ];
  }

}
