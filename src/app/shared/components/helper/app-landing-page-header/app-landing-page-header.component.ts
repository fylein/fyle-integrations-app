import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ButtonSize, ButtonType, ClickEvent, QBDDirectInteractionType, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/common/window.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-landing-page-header',
  templateUrl: './app-landing-page-header.component.html',
  styleUrls: ['./app-landing-page-header.component.scss']
})
export class AppLandingPageHeaderComponent implements OnInit {

  AppName = AppName;

  QBDDirectInteractionType = QBDDirectInteractionType;

  @Output() connectIntegration = new EventEmitter<void>();

  @Output() disconnectIntegration = new EventEmitter<void>();

  @Output() syncEmployees = new EventEmitter<void>();

  @Output() connectButtonClick = new EventEmitter<void>();

  @Input() iconPath: string;

  @Input() isIntegrationConnected: boolean;

  @Input() isIntegrationSetupInProgress: boolean;

  @Input() appName: string;

  @Input() buttonText: string = this.translocoService.translate('appLandingPageHeader.connectButton');

  @Input() appDescription: string;

  @Input() isLoading: boolean;

  @Input() isRecipeRunning: boolean;

  @Input() showErrorScreen: boolean;

  @Input() hideRefreshIcon: boolean;

  @Input() iframeSourceUrl: SafeResourceUrl | null;

  @Input() redirectLink: string;

  @Input() isConnectionInProgress: boolean;

  @Input() postConnectionRoute?: string;

  @Input() showQBOButton: boolean;

  @Input() showXeroButton: boolean;

  @Input() logoWidth: string = '140px';

  @Input() logoStyleClasses: string = 'tw-py-10-px tw-px-20-px';

  @Input() logoSectionStyleClasses: string = brandingStyle.qbd_direct.onboarding.logoSectionStyle;

  @Input() uiExposedAppName: string;

  @Input() isAssistedSetupSlotBooked?: boolean;

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  qboConnectButtonSource: string = 'assets/buttons/connect-to-qbo.svg';

  xeroConnectButtonSource: string = 'assets/buttons/connect-to-xero.svg';

  readonly brandingConfig = brandingConfig;

  readonly isGradientAllowed: boolean = brandingFeatureConfig.isGradientAllowed;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private trackingService: TrackingService,
    public windowService: WindowService,
    private translocoService: TranslocoService
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
    const isIntacctOAuthAllowed = this.appName === AppName.INTACCT && !this.postConnectionRoute;
    if (this.appName === AppName.TRAVELPERK || this.appName === AppName.BUSINESS_CENTRAL || this.appName === AppName.BAMBOO_HR || this.appName === AppName.XERO || this.appName.includes('QuickBooks Desktop ') || isIntacctOAuthAllowed) {
      this.initiateOAuth();
      return;
    } else if (this.postConnectionRoute === 'qbd/onboarding/export_settings') {
      this.trackingService.onClickEvent(TrackingApp.QBD, ClickEvent.CONNECT_QBD);
    } else if (this.postConnectionRoute === 'intacct/onboarding/connector') {
      this.trackingService.onClickEvent(TrackingApp.INTACCT, ClickEvent.CONNECT_INTACCT);
    } else if (this.postConnectionRoute === 'sage300/onboarding/connector') {
      this.trackingService.onClickEvent(TrackingApp.SAGE300, ClickEvent.CONNECT_SAGE300);
    }
    if (this.connectButtonClick?.observed) {
      this.connectButtonClick.emit();
    }
    this.router.navigate([`/integrations/${this.postConnectionRoute}`]);
  }

  ngOnInit(): void {
    this.uiExposedAppName ||= this.appName === AppName.QBD_DIRECT ? AppName.QBD : this.appName;
  }

}
