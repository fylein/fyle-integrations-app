import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, AppUrl } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import { QboAuthService } from 'src/app/core/services/qbo/qbo-core/qbo-auth.service';
import { XeroAuthService } from 'src/app/core/services/xero/xero-core/xero-auth.service';


@Component({
  selector: 'app-dashboard-token-expired',
  templateUrl: './dashboard-token-expired.component.html',
  styleUrl: './dashboard-token-expired.component.scss'
})
export class DashboardTokenExpiredComponent implements OnInit, OnDestroy {
  AppName = AppName;

  qboConnectButtonSource: string = 'assets/buttons/connect-to-qbo.svg';

  xeroConnectButtonSource: string = 'assets/buttons/connect-to-xero.svg';

  illustrationsAllowed: boolean = brandingFeatureConfig.illustrationsAllowed;

  readonly brandingConfig = brandingConfig;

  @Input() appName: string;

  isIncorrectAccountSelected: boolean;

  isConnectionInProgress: boolean = false;

  isIntegrationDisconnected: boolean;

  isIntegrationReconnectDialogVisible: boolean;

  private destroy$ = new Subject<void>();

  integrationSetupForm: FormGroup;

  constructor(
    private helperService: HelperService,
    private qboAuthService: QboAuthService,
    private router: Router,
    private xeroAuthService: XeroAuthService,
    private windowService: WindowService,
    private netsuiteConnector: NetsuiteConnectorService
  ) {}

  acceptWarning(data: ConfigurationWarningOut): void {
    if (data.hasAccepted) {
      this.isIncorrectAccountSelected = false;
    }
  }

  openCredentialGenerationGuide(): void{
    if (this.appName === AppName.NETSUITE){
      this.windowService.openInNewTab(brandingKbArticles.onboardingArticles.NETSUITE.CONNECTOR);
    }
  }

  toggleIntegrationReconnectDialog(){
    this.isIntegrationReconnectDialogVisible = !this.isIntegrationReconnectDialogVisible;
  }

  initiateOAuth(): void{
    if (this.appName === AppName.QBO){
    this.qboAuthService.connectQbo();
    }
    if (this.appName === AppName.XERO){
    this.xeroAuthService.connectXero();
    }
  }

  reconnectToIntegration(): void{
    this.netsuiteConnector.connectNetsuite(this.integrationSetupForm, true);
    this.isIntegrationReconnectDialogVisible = false;
  }

  setupPage(): void{

    if (this.router.url.includes("/disconnect/")){
      this.isIntegrationDisconnected = true;
    }

    if (this.appName === AppName.NETSUITE){
      this.helperService.setBaseApiURL(AppUrl.NETSUITE);
      this.netsuiteConnector.getNetsuiteFormGroup(true);

      this.netsuiteConnector.connectNetsuiteForm$.subscribe((netsuiteSetupForm) => {
        this.integrationSetupForm = netsuiteSetupForm;
      });

      this.netsuiteConnector.setupConnectionStatus$.subscribe((isNetsuiteConnected) => {
        if (isNetsuiteConnected){
          this.router.navigate(['integrations/netsuite/main/dashboard']);
        }
      });

      this.netsuiteConnector.isLoading$.subscribe((isConnectionInProgress) => {
        this.isConnectionInProgress = isConnectionInProgress;
      });
    }

    if (this.appName === AppName.QBO){
    this.helperService.setBaseApiURL(AppUrl.QBO);

    this.qboAuthService.isIncorrectAccountSelected$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status: boolean) => {
     this.isIncorrectAccountSelected = status;
     });

     this.qboAuthService.qboConnectionInProgress$
     .pipe(takeUntil(this.destroy$))
     .subscribe((status: boolean) => {
      this.isConnectionInProgress = status;
     });
    }

    if (this.appName === AppName.XERO){
    this.helperService.setBaseApiURL(AppUrl.XERO);

    this.xeroAuthService.isIncorrectAccountSelected$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status: boolean) => {
     this.isIncorrectAccountSelected = status;
    });

    this.xeroAuthService.xeroConnectionInProgress$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status: boolean) => {
     this.isConnectionInProgress = status;
     });
    }
  }

  ngOnInit(): void {
    this.setupPage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
