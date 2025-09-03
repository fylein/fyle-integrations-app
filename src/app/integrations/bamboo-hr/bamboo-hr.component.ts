import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { catchError, concat, merge, of, toArray } from 'rxjs';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { BambooHr, BambooHRConfiguration, BambooHRConfigurationPost, BambooHrModel, EmailOption } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { AppName, AppUrl, ButtonSize, ButtonType, ClickEvent, Page, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { BambooHrService } from 'src/app/core/services/bamboo-hr/bamboo-hr.service';
import { AuthService } from 'src/app/core/services/common/auth.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { TranslocoService } from '@jsverse/transloco';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';

@Component({
  selector: 'app-bamboo-hr',
  templateUrl: './bamboo-hr.component.html',
  styleUrls: ['./bamboo-hr.component.scss']
})
export class BambooHrComponent implements OnInit {

  showDialog: boolean;

  isBambooConnected: boolean;

  isBambooConnectionInProgress: boolean;

  isBambooSetupInProgress: boolean;

  isLoading: boolean = true;

  appName: AppName = AppName.BAMBOO_HR;

  hideRefreshIcon: boolean = true;

  isConfigurationSaveInProgress: boolean;

  bambooHrData: BambooHr;

  ButtonType = ButtonType;

  ButtonSize = ButtonSize;

  readonly brandingStyle = brandingStyle;

  org: Org = this.orgService.getCachedOrg();

  brandingKbArticles = brandingKbArticles;

  readonly brandingConfig = brandingConfig;

  bambooConnectionForm: FormGroup = this.formBuilder.group({
    apiToken: [null, Validators.required],
    subDomain: [null, Validators.required]
  });

  bambooHrConfiguration: BambooHRConfiguration;

  additionalEmails: EmailOption[];

  showErrorScreen: boolean;

  private sessionStartTime = new Date();

  constructor(
    private bambooHrService: BambooHrService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private helperService: HelperService,
    private messageService: MessageService,
    private orgService: OrgService,
    private trackingService: TrackingService,
    private authService: AuthService,
    private translocoService: TranslocoService,
    private toastService: IntegrationsToastService
  ) { }

  openDialog(): void {
    this.trackingService.onClickEvent(TrackingApp.BAMBOO_HR, ClickEvent.CONNECT_BAMBOO_HR);
    this.showDialog = true;
  }

  connectBambooHR(): void {
    this.isBambooConnectionInProgress = true;
    const bambooConnectionPayload = BambooHrModel.constructBambooConnectionPayload(this.bambooConnectionForm);
    this.bambooHrService.connectBambooHR(bambooConnectionPayload).subscribe(() => {
      this.isBambooConnected = true;
      this.isBambooConnectionInProgress = false;
      this.showDialog = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('bambooHr.connectionSuccessMessage'));
      this.trackingService.trackTimeSpent(TrackingApp.BAMBOO_HR, Page.BAMBOO_HR_LANDING, this.sessionStartTime);
      this.sessionStartTime = new Date();
    }, () => {
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('bambooHr.connectionFailedMessage'), 5000);
      this.isBambooConnectionInProgress = false;
    });
  }

  closeToast(): void {
    this.messageService.clear('');
  }

  configurationUpdatesHandler(payload: BambooHRConfigurationPost): void {
    this.trackingService.onClickEvent(TrackingApp.BAMBOO_HR, ClickEvent.CONFIGURE_BAMBOO_HR);
    this.isConfigurationSaveInProgress = true;
    this.bambooHrService.postConfigurations(payload).subscribe((updatedConfiguration: BambooHRConfiguration) => {
      this.bambooHrConfiguration = updatedConfiguration;
      this.hideRefreshIcon = false;
      this.isConfigurationSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('bambooHr.configurationSuccessMessage'));
      this.trackingService.trackTimeSpent(TrackingApp.BAMBOO_HR, Page.CONFIGURE_BAMBOO_HR, this.sessionStartTime);
    });
  }

  syncEmployees(): void {
    this.trackingService.onClickEvent(TrackingApp.BAMBOO_HR, ClickEvent.SYNC_BAMBOO_HR_EMPLOYEES);
    this.hideRefreshIcon = true;
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('bambooHr.syncStartMessage'));
    this.bambooHrService.syncEmployees().subscribe(() => {
      this.hideRefreshIcon = false;
    });
  }

  disconnectBambooHr(): void {
    this.trackingService.onClickEvent(TrackingApp.BAMBOO_HR, ClickEvent.DISCONNECT_BAMBOO_HR);
    this.isLoading = true;
    this.bambooHrService.disconnectBambooHr().subscribe(() => {
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('bambooHr.disconnectSuccessMessage'));
      this.isBambooConnected = false;
      this.isLoading = false;
    });
  }


  private getBambooHrConfiguration(): void {
    const data = merge(
      this.orgService.getAdditionalEmails(),
      this.bambooHrService.getConfigurations().pipe(catchError(() => of(null)))
    );

    data.pipe(toArray()).subscribe((responses) => {
      responses.forEach((response: any) => {
        if (Array.isArray(response) && response.length) {
          this.additionalEmails = response;
        } else if (response?.hasOwnProperty('additional_email_options')) {
          this.bambooHrConfiguration = response;
          this.hideRefreshIcon = false;
        }
      });
      this.isLoading = false;

    });
  }

  private setupPage(): void {
    this.helperService.setBaseApiURL(AppUrl.BAMBOO_HR);
    this.checkTokenHealth();
  }

  private loadBambooHR(isBambooTokenExpired: boolean): void {
    this.bambooHrService.getBambooHRData().subscribe((bambooHrData: BambooHr) => {
      this.isBambooConnected = bambooHrData.sub_domain && bambooHrData.api_token ? true : false;
      this.getBambooHrConfiguration();

      if (this.isBambooConnected && isBambooTokenExpired === false){
        this.bambooHrData = bambooHrData;
      } else if (this.isBambooConnected) {
        this.isBambooConnected = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('bambooHr.tokenExpiredMessage'), 6000);
      }

    }, () => {
      this.isBambooConnected = false;
      this.getBambooHrConfiguration();
    });
  }

  private checkTokenHealth(): void{
    this.bambooHrService.checkHealth().subscribe(() => {
      this.loadBambooHR(false);
    }, () => {
      this.loadBambooHR(true);
    });
  }

  ngOnInit(): void {
    this.authService.updateUserTokens('BAMBOO_HR');
    this.setupPage();
  }

}
