import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, AppUrl } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { ApiService } from 'src/app/core/services/common/api.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
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

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private helperService: HelperService,
    private qboAuthService: QboAuthService,
    private router: Router,
    private xeroAuthService: XeroAuthService,
  ) {
    helperService.setBaseApiURL(AppUrl.QBO);
  }

  acceptWarning(data: ConfigurationWarningOut): void {
    if (data.hasAccepted) {
      this.isIncorrectAccountSelected = false;
    }
  }


  initiateOAuth(): void{
    if (this.appName === AppName.QBO){
    this.qboAuthService.connectQbo();
    }
    if (this.appName === AppName.XERO){
    this.xeroAuthService.connectXero();
    }
  }

  setupPage(): void{

    if (this.router.url.includes("/disconnect/")){
      this.isIntegrationDisconnected = true;
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
