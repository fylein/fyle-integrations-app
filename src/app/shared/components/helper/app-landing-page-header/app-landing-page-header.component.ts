import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, ClickEvent, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/common/window.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-landing-page-header',
  templateUrl: './app-landing-page-header.component.html',
  styleUrls: ['./app-landing-page-header.component.scss']
})
export class AppLandingPageHeaderComponent implements OnInit {

  AppName = AppName;

  @Output() connectIntegration = new EventEmitter<void>();

  @Output() disconnectIntegration = new EventEmitter<void>();

  @Output() syncEmployees = new EventEmitter<void>();

  @Input() iconPath: string;

  @Input() isIntegrationConnected: boolean;

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

  @Input() showQBOButton: boolean;

  @Input() showXeroButton: boolean;

  @Input() logoWidth: string = '140px';

  @Input() logoStyleClasses: string = 'tw-py-10-px tw-px-4-px';

  @Input() logoSectionStyleClasses: string = 'tw-rounded-4-px tw-border-1-px tw-border-bg-secondary tw-bg-white tw-w-176-px';

  qboConnectButtonSource: string = 'assets/buttons/connect-to-qbo.svg';

  xeroConnectButtonSource: string = 'assets/buttons/connect-to-xero.svg';

  readonly brandingConfig = brandingConfig;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingContent = brandingContent.common;

  constructor(
    private router: Router,
    private trackingService: TrackingService,
    public windowService: WindowService
  ) { }

  syncData(): void {
    this.syncEmployees.emit();
  }

  initiateOAuth(): void {
    this.connectIntegration.emit();
  }

  disconnect(): void {
    this.disconnectIntegration.emit();
  }

  connect(): void {

    if (this.appName === AppName.TRAVELPERK || this.appName === AppName.BUSINESS_CENTRAL || this.appName === AppName.BAMBOO_HR || this.appName === AppName.XERO) {
      this.initiateOAuth();
      return;
    } else if (this.postConnectionRoute === 'qbd/onboarding/export_settings') {
      this.trackingService.onClickEvent(TrackingApp.QBD, ClickEvent.CONNECT_QBD);
    } else if (this.postConnectionRoute === 'intacct/onboarding/connector') {
      this.trackingService.onClickEvent(TrackingApp.INTACCT, ClickEvent.CONNECT_INTACCT);
    } else if (this.postConnectionRoute === 'sage300/onboarding/connector') {
      this.trackingService.onClickEvent(TrackingApp.SAGE300, ClickEvent.CONNECT_SAGE300);
    }
    this.router.navigate([`/integrations/${this.postConnectionRoute}`]);
  }

  ngOnInit(): void {
  }

}
