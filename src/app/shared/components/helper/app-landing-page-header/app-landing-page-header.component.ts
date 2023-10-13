import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppName, ClickEvent } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/common/window.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-landing-page-header',
  templateUrl: './app-landing-page-header.component.html',
  styleUrls: ['./app-landing-page-header.component.scss']
})
export class AppLandingPageHeaderComponent implements OnInit {

  AppName = AppName;

  @Output() openDialog = new EventEmitter<void>();

  @Output() disconnectIntegration = new EventEmitter<void>();

  @Output() syncEmployees = new EventEmitter<void>();

  @Input() iconPath: string;

  @Input() isIntegrationConnected: boolean | undefined;

  @Input() isIntegrationSetupInProgress: boolean;

  @Input() appName: string;

  @Input() buttonText: string;

  @Input() appDescription: string;

  @Input() isLoading: boolean;

  @Input() isRecipeRunning: boolean;

  @Input() showErrorScreen: boolean;

  @Input() hideRefreshIcon: boolean;

  @Input() iframeSourceUrl: SafeResourceUrl | null;

  @Input() redirectLink: string;

  @Input() isConnectionInProgress: boolean;

  @Input() postConnectionRoute: string;

  constructor(
    private router: Router,
    private trackingService: TrackingService,
    public windowService: WindowService
  ) { }

  syncData(): void {
    this.syncEmployees.emit();
  }

  connect(): void {
    this.openDialog.emit();
  }

  disconnect(): void {
    this.disconnectIntegration.emit();
  }

  connectIntegration(): void {
    if (this.postConnectionRoute === 'qbd/onboarding/export_settings') {
      this.trackingService.onClickEvent(ClickEvent.CONNECT_QBD);
    } else if (this.postConnectionRoute==='intacct/onboarding/connector') {
      this.trackingService.onClickEvent(ClickEvent.CONNECT_INTACCT);
    }
    this.router.navigate([`/integrations/${this.postConnectionRoute}`]);
  }

  ngOnInit(): void {
  }

}