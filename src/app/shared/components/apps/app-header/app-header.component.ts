import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BambooHRConfiguration } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { ClickEvent } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  AppName = AppName;

  @Output() openDialog = new EventEmitter<void>();

  @Output() disconnectBambooHr = new EventEmitter<void>();

  @Output() syncEmployees = new EventEmitter<void>();

  @Input() iconPath: string;

  @Input() isIntegrationConnected: boolean = false;

  @Input() isIntegrationSetupInProgress: boolean;

  @Input() appName: string;

  @Input() appDescription: string;

  @Input() isLoading: boolean;

  @Input() bambooHrConfiguration: BambooHRConfiguration;

  @Input() showErrorScreen: boolean;

  @Input() hideRefreshIcon: boolean;

  @Input() iframeSourceUrl: any;

  constructor(
    private router: Router,
    private trackingService: TrackingService
  ) { }

  syncData(): void {
    this.syncEmployees.emit();
  }

  connectBambooHR(): void {
    this.openDialog.emit();
  }

  disconnect(): void {
    this.disconnectBambooHr.emit();
  }

  connectQBD(): void {
    this.trackingService.onClickEvent(ClickEvent.CONNECT_QBD);
    this.router.navigate(['/integrations/qbd/onboarding/export_settings']);
  }

  ngOnInit(): void {
  }

}
