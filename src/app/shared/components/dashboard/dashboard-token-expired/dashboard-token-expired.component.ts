import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { ApiService } from 'src/app/core/services/common/api.service';
import { QboAuthService } from 'src/app/core/services/qbo/qbo-core/qbo-auth.service';
import { XeroAuthService } from 'src/app/core/services/xero/xero-core/xero-auth.service';
import { environment } from 'src/environments/environment';

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

  isIntegrationConnected: boolean;

  isIntegrationDisconnected: boolean;

  private destroy$ = new Subject<void>();

  constructor(private qboAuthService: QboAuthService, private xeroAuthService: XeroAuthService, private apiService: ApiService, private router: Router){
  }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isIncorrectAccountSelected = false;
    if (data.hasAccepted) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.router.url]);
    });
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

    if(this.router.url.includes("/disconnect/")){
      this.isIntegrationDisconnected = true;
    }
    
    if (this.appName === AppName.QBO){
    this.apiService.setBaseApiURL(environment.qbo_api_url);

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
    this.apiService.setBaseApiURL(environment.xero_api_url);

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

     this.xeroAuthService.isIntegrationConnected$
     .pipe(takeUntil(this.destroy$))
     .subscribe((status: boolean) => {
      this.isIntegrationConnected = status;
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
