import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppName, ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { SyncDataType } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-connector.model';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-data-sync',
  standalone: true,
  imports: [CommonModule, SharedModule],
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

  onContinueClick() {
    this.continueClick.emit();
  }

  ngOnInit() {
  }

}
