import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, AppUrl, ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/si-connector.service';
import { Sage300ConnectorService } from 'src/app/core/services/sage300/sage300-configuration/sage300-connector.service';
import { QboAuthService } from 'src/app/core/services/qbo/qbo-core/qbo-auth.service';
import { XeroAuthService } from 'src/app/core/services/xero/xero-core/xero-auth.service';


@Component({
    selector: 'app-dashboard-token-expired',
    templateUrl: './dashboard-token-expired.component.html',
    styleUrl: './dashboard-token-expired.component.scss',
    standalone: false
})
export class DashboardTokenExpiredComponent implements OnInit, OnDestroy {
  AppName = AppName;

  qboConnectButtonSource: string = 'assets/buttons/connect-to-qbo.svg';

  xeroConnectButtonSource: string = 'assets/buttons/connect-to-xero.svg';

  illustrationsAllowed: boolean = brandingFeatureConfig.illustrationsAllowed;

  readonly brandingConfig = brandingConfig;

  @Input() appName: string;

  @Input() qboCompanyName: string;

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  isIncorrectAccountSelected: boolean;

  isConnectionInProgress: boolean = false;

  isIntegrationDisconnected: boolean;

  isIntegrationReconnectDialogVisible: boolean;

  isTokenBasedAuthApp: boolean;

  private destroy$ = new Subject<void>();

  integrationSetupForm: FormGroup;

  constructor(
    private helperService: HelperService,
    private qboAuthService: QboAuthService,
    private router: Router,
    private xeroAuthService: XeroAuthService,
    private windowService: WindowService,
    private netsuiteConnector: NetsuiteConnectorService,
    private intacctConnector: IntacctConnectorService,
    private sage300Connector: Sage300ConnectorService
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

    if (this.appName === AppName.INTACCT){
      this.windowService.openInNewTab(brandingKbArticles.onboardingArticles.INTACCT.CONNECTOR);
    }

    if (this.appName === AppName.SAGE300){
      this.windowService.openInNewTab(brandingKbArticles.onboardingArticles.SAGE300.LANDING);
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
    this.isIntegrationReconnectDialogVisible = false;
    this.isConnectionInProgress = true;

    if (this.appName === AppName.NETSUITE) {
      this.netsuiteConnector.connectNetsuite(this.integrationSetupForm, true)
      .subscribe(({ netsuiteSetupForm, isNetsuiteConnected }) => {
        this.integrationSetupForm = netsuiteSetupForm;
        this.isConnectionInProgress = false;
        if (isNetsuiteConnected){
          this.router.navigate(['integrations/netsuite/main/dashboard']);
        }
      });
    }

    if (this.appName === AppName.INTACCT) {
      this.intacctConnector.connectSageIntacct(this.integrationSetupForm, true)
      .subscribe(({ intacctSetupForm, isIntacctConnected }) => {
        this.integrationSetupForm = intacctSetupForm;
        this.isConnectionInProgress = false;
        if (isIntacctConnected){
          this.router.navigate(['integrations/intacct/main/dashboard']);
        }
      });
    }

    if (this.appName === AppName.SAGE300) {
      this.sage300Connector.connectSage300(this.integrationSetupForm, true)
      .subscribe(({ sage300SetupForm, isSage300Connected }) => {
        this.integrationSetupForm = sage300SetupForm;
        this.isConnectionInProgress = false;
        if (isSage300Connected){
          this.router.navigate(['integrations/sage300/main/dashboard']);
        }
      });
    }
  }

  setupPage(): void{

    if (this.router.url.includes("/disconnect/")){
      this.isIntegrationDisconnected = true;
    }

    if (this.appName === AppName.NETSUITE){
      this.isTokenBasedAuthApp = true;
      this.helperService.setBaseApiURL(AppUrl.NETSUITE);

      this.netsuiteConnector.getNetsuiteFormGroup().subscribe(({ netsuiteSetupForm }) => {
        this.integrationSetupForm = netsuiteSetupForm;
      });
    }

    if (this.appName === AppName.INTACCT){
      this.isTokenBasedAuthApp = true;
      this.helperService.setBaseApiURL(AppUrl.INTACCT);

      this.intacctConnector.getIntacctFormGroup().subscribe(({ intacctSetupForm }) => {
        this.integrationSetupForm = intacctSetupForm;
      });
    }

    if (this.appName === AppName.SAGE300){
      this.isTokenBasedAuthApp = true;
      this.helperService.setBaseApiURL(AppUrl.SAGE300);

      this.sage300Connector.getSage300FormGroup().subscribe((sage300SetupForm) => {
        this.integrationSetupForm = sage300SetupForm;
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
