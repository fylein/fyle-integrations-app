import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { catchError, concat, merge, Observable, of, toArray } from 'rxjs';
import { AppName, ClickEvent, InAppIntegration, Page, ConfigurationCta, ToastSeverity, TrackingApp } from 'src/app/core/models/enum/enum.model';
import { EmailOption, Gusto, GustoConfiguration, GustoConfigurationPost } from 'src/app/core/models/gusto/gusto.model';
import { Org } from 'src/app/core/models/org/org.model';
import { WorkatoConnectionStatus } from 'src/app/core/models/travelperk/travelperk.model';
import { EventsService } from 'src/app/core/services/common/events.service';
import { GustoService } from 'src/app/core/services/gusto/gusto.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-gusto',
  templateUrl: './gusto.component.html',
  styleUrls: ['./gusto.component.scss']
})
export class GustoComponent implements OnInit {

  iframeSource: string;

  iframeSourceUrl: SafeResourceUrl;

  showDialog: boolean;

  isGustoConnected: boolean;

  isGustoConnectionInProgress: boolean;

  isGustoSetupInProgress: boolean = true;

  isLoading: boolean = true;

  hideRefreshIcon: boolean;

  isConfigurationSaveInProgress: boolean;

  brandingKbArticles = brandingKbArticles;

  showErrorScreen: boolean;

  gustoConfiguration: GustoConfiguration;

  gustoData: Gusto;

  additionalEmails: EmailOption[] = [];

  org: Org = this.orgService.getCachedOrg();

  appName: string = InAppIntegration.GUSTO;

  private sessionStartTime = new Date();

  readonly brandingConfig = brandingConfig;

  constructor(
    private gustoService: GustoService,
    private orgService: OrgService,
    private trackingService: TrackingService,
    private toastService: IntegrationsToastService,
    private eventsService: EventsService
  ) { }

  private addConnectionWidget() {
    const connectionId = this.gustoData.connection_id.toString();
    const managedUserId = this.org.managed_user_id;
    this.isLoading = true;
    this.orgService.generateToken(managedUserId).subscribe(res => {
      const token = res.token;
      const workatoBaseUrl = 'https://app.workato.com/direct_link/embedded/connections/';
      const iframeSource = workatoBaseUrl + connectionId + '?workato_dl_token=' + token;
      this.iframeSourceUrl = this.orgService.sanitizeUrl(iframeSource);
      this.isGustoSetupInProgress = false;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      this.isGustoSetupInProgress = false;
      this.showErrorScreen = true;
    });
  }

  syncEmployees(): void {
    this.trackingService.onClickEvent(TrackingApp.GUSTO, ClickEvent.SYNC_GUSTO_EMPLOYEES);
    this.hideRefreshIcon = true;
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing Employees Started');
    this.gustoService.syncEmployees().subscribe(() => {
      this.hideRefreshIcon = false;
    });
  }

  configurationUpdatesHandler(payload: GustoConfigurationPost): void {
    this.trackingService.onClickEvent(TrackingApp.GUSTO, ClickEvent.CONFIGURE_GUSTO);
    this.isConfigurationSaveInProgress = true;
    this.gustoService.postConfigurations(payload).subscribe((updatedConfiguration: GustoConfiguration) => {
      this.gustoConfiguration = updatedConfiguration;
      this.isConfigurationSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Configuration saved successfully');
      this.trackingService.trackTimeSpent(TrackingApp.GUSTO, Page.CONFIGURE_GUSTO, this.sessionStartTime);
    });
  }

  private checkGustoDataAndTriggerConnectionWidget() {
    if (!this.gustoData) {
      this.gustoService.getGustoData().subscribe((gustoData : Gusto) => {
        this.gustoData = gustoData;
        this.addConnectionWidget();
      });
    } else {
      this.addConnectionWidget();
    }
  }

  private updateOrCreateGustoConfiguration(workatoConnectionStatus:WorkatoConnectionStatus) {
      this.isGustoConnected = workatoConnectionStatus.payload.connected ? true : false;
      this.gustoService.getConfigurations().subscribe(() => {
        this.gustoService.patchConfigurations(this.isGustoConnected).subscribe();
      }, () => {});
  }

  private setupWorkatoConnectionWatcher(): void {
    this.eventsService.getWorkatoConnectionStatus.subscribe((workatoConnectionStatus: WorkatoConnectionStatus) => {
      this.updateOrCreateGustoConfiguration(workatoConnectionStatus);
    });
  }

  private getSyncData(): Observable<{}>[] {
    const syncData = [];
    if (!this.org?.managed_user_id) {
      syncData.push(this.orgService.createWorkatoWorkspace());
    }

    if (!this.gustoData || !this.gustoData?.folder_id) {
      syncData.push(this.gustoService.createFolder());
    }

    if (!this.gustoData || !this.gustoData?.package_id) {
      syncData.push(this.gustoService.uploadPackage());
    }

    if (!this.org?.is_fyle_connected) {
      syncData.push(this.orgService.connectFyle(AppName.GUSTO));
    }

    if (!this.gustoData?.connection_id) {
      syncData.push(this.gustoService.connect());
    }

    if (!this.org?.is_sendgrid_connected) {
      syncData.push(this.orgService.connectSendgrid());
    }

    syncData.push(this.orgService.getOrgs(this.org.fyle_org_id));
    return syncData;
  }

  setupGusto(): void {
    this.setupWorkatoConnectionWatcher();
    const syncData = this.getSyncData();
    this.isGustoSetupInProgress = true;
    concat(...syncData).pipe(
      toArray()
    ).subscribe((responses) => {
      responses.forEach((response: any) => {
        if (response?.hasOwnProperty('managed_user_id') ) {
          this.org.managed_user_id = response.managed_user_id;
        }
      });
      this.checkGustoDataAndTriggerConnectionWidget();
    }, () => {
      this.isLoading = false;
      this.isGustoSetupInProgress = false;
      this.showErrorScreen = true;
    });
  }

  getGustoConfiguration(): void {
    const data = merge(
      this.orgService.getAdditionalEmails(),
      this.gustoService.getConfigurations().pipe(catchError(() => of(null)))
    );
    data.pipe(toArray()).subscribe((responses) => {
      responses.forEach((response: any) => {
        if (Array.isArray(response) && response.length) {
          this.additionalEmails = response;
        } else if (response?.hasOwnProperty('additional_email_options')) {
          this.gustoConfiguration = response;
        }
      });
      this.setupGusto();
    });
  }

  private setupPage(): void {
    this.gustoService.getGustoData().subscribe((gustoData: Gusto) => {
      this.gustoData = gustoData;
      this.getGustoConfiguration();
    }, () => {
      this.isGustoConnected = false;
      this.getGustoConfiguration();
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
