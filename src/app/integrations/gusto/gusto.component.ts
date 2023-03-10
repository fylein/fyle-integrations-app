import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { catchError, concat, merge, of, toArray } from 'rxjs';
import { ClickEvent, Page, RedirectLink, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Gusto, GustoConfiguration, GustoConfigurationPost } from 'src/app/core/models/gusto/gusto.model';
import { Org } from 'src/app/core/models/org/org.model';
import { GustoService } from 'src/app/core/services/gusto/gusto.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { QbdToastService } from 'src/app/core/services/qbd/qbd-core/qbd-toast.service';

@Component({
  selector: 'app-gusto',
  templateUrl: './gusto.component.html',
  styleUrls: ['./gusto.component.scss']
})
export class GustoComponent implements OnInit {

  showDialog: boolean;

  isGustoConnected: boolean;

  isGustoConnectionInProgress: boolean;

  isGustoSetupInProgress: boolean;

  isLoading: boolean = true;

  hideRefreshIcon: boolean;

  isConfigurationSaveInProgress: boolean;

  RedirectLink = RedirectLink;

  showErrorScreen: boolean;

  gustoConfiguration: any;

  gustoData: Gusto;

  additionalEmails: any[];

  org: Org = this.orgService.getCachedOrg();

  private sessionStartTime = new Date();

  constructor(
    private gustoService: GustoService,
    private formBuilder: FormBuilder,
    private orgService: OrgService,
    private trackingService: TrackingService,
    private toastService: QbdToastService
  ) { }

  syncEmployees(): void {
    this.trackingService.onClickEvent(ClickEvent.SYNC_GUSTO_EMPLOYEES);
    this.hideRefreshIcon = true;
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing Employees Started');
    this.gustoService.syncEmployees().subscribe(() => {
      this.hideRefreshIcon = false;
    });
  }

  disconnectGusto(): void {
    this.trackingService.onClickEvent(ClickEvent.DISCONNECT_GUSTO);
    this.isLoading = true;
    // This.gustoService.disconnectBambooHr().subscribe(() => {
    //   This.displayToastMessage(ToastSeverity.SUCCESS, 'Disconnected Bamboo HR Successfully');
    //   This.isBambooConnected = false;
    //   This.isLoading = false;
    // });
  }

  configurationUpdatesHandler(payload: GustoConfigurationPost): void {
    this.trackingService.onClickEvent(ClickEvent.CONFIGURE_GUSTO);
    this.isConfigurationSaveInProgress = true;
    this.gustoService.postConfigurations(payload).subscribe((updatedConfiguration: GustoConfiguration) => {
      this.gustoConfiguration = updatedConfiguration;
      this.isConfigurationSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Configuration saved successfully');
      this.trackingService.trackTimeSpent(Page.CONFIGURE_GUSTO, this.sessionStartTime);
    });
  }

  setupGusto(): void {
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
      syncData.push(this.orgService.connectFyle());
    }

    if (!this.org?.is_sendgrid_connected) {
      syncData.push(this.orgService.connectSendgrid());
    }

    if (syncData.length) {
      this.isGustoSetupInProgress = true;
      concat(...syncData).pipe(
        toArray()
      ).subscribe(() => {
        this.isLoading = false;
        this.isGustoSetupInProgress = false;
      }, () => {
        this.isLoading = false;
        this.isGustoSetupInProgress = false;
        this.showErrorScreen = true;
      });
    } else {
      this.isLoading = false;
    }
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
      this.isGustoConnected = gustoData.folder_id && gustoData.package_id ? true : false;
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
