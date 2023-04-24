import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { concat, toArray } from 'rxjs';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AppName, RedirectLink } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { Travelperk, WorkatoConnectionStatus } from 'src/app/core/models/travelperk/travelperk.model';
import { EventsService } from 'src/app/core/services/core/events.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { QbdToastService } from 'src/app/core/services/qbd/qbd-core/qbd-toast.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';

@Component({
  selector: 'app-travelperk',
  templateUrl: './travelperk.component.html',
  styleUrls: ['./travelperk.component.scss']
})
export class TravelperkComponent implements OnInit {
  // iframeSource: string = 'https://app.workato.com/direct_link/embedded/connections/';

  RedirectLink = RedirectLink;

  AppName = AppName;

  // iframeSourceUrl: SafeResourceUrl | null;

  isLoading: boolean = true;

  showErrorScreen: boolean;

  travelperkData: Travelperk;

  isTravelperkSetupInProgress: boolean;

  isIntegrationConnected: boolean;

  org: Org = this.orgService.getCachedOrg();

  constructor(
    private travelperkService: TravelperkService,
    private orgService: OrgService,
    private eventsService: EventsService,
    private toastService: QbdToastService
  ) { }

  private addConnectionWidget() {
    const connectionId = this.travelperkData.travelperk_connection_id.toString();
    const managedUserId = this.org.managed_user_id;
    this.isLoading = true;

    this.orgService.generateToken(managedUserId).subscribe(res => {
      const token = res.token;
      const workatoBaseUrl = 'https://app.workato.com/direct_link/embedded/connections/';
      const iframeSource = workatoBaseUrl + connectionId + '?workato_dl_token=' + token;
      // this.iframeSourceUrl = this.orgService.sanitizeUrl(iframeSource);
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      this.isTravelperkSetupInProgress = false;
      this.showErrorScreen = true;
    });
  }

  private syncData() {
    const syncData = [];

    if (!this.org?.managed_user_id) {
      syncData.push(this.orgService.createWorkatoWorkspace());
    }

    if (!this.travelperkData || !this.travelperkData?.folder_id) {
      syncData.push(this.travelperkService.createFolder());
    }

    if (!this.travelperkData || !this.travelperkData?.package_id) {
      syncData.push(this.travelperkService.uploadPackage());
    }

    if (!this.org?.is_fyle_connected) {
      syncData.push(this.orgService.connectFyle(AppName.TRAVELPERK));
    }

    if (!this.travelperkData?.travelperk_connection_id) {
      syncData.push(this.travelperkService.connectTravelperk());
    }

    if (!this.travelperkData?.is_s3_connected) {
      syncData.push(this.travelperkService.connectAwsS3());
    }

    syncData.push(this.orgService.getOrgs(this.org.fyle_org_id));
    return syncData;
  }

  private validateAndInitiateConnectionWidget(): void {
    this.travelperkService.getConfigurations().subscribe((configuration) => {
      this.isIntegrationConnected = configuration.is_recipe_enabled;
      if (!configuration.is_recipe_enabled) {
        // this.addConnectionWidget();
      }
    }, () => {
      // this.addConnectionWidget();
    });
  }

  private checkTravelperkDataAndTriggerConnectionWidget() {
    if (!this.travelperkData) {
      this.travelperkService.getTravelperkData().subscribe((travelperkData: Travelperk) => {
        this.travelperkData = travelperkData;
        this.validateAndInitiateConnectionWidget();
      });
    } else {
      this.validateAndInitiateConnectionWidget();
    }
  }

  private updateOrCreateTravelperkConfiguration(workatoConnectionStatus: WorkatoConnectionStatus): void {
    this.travelperkService.getConfigurations().subscribe(() => {
      const isRecipeEnabled: boolean = workatoConnectionStatus.payload.connected ? true : false;
      this.travelperkService.patchConfigurations(isRecipeEnabled).subscribe(() => {
        if (isRecipeEnabled) {
          // this.iframeSourceUrl = null;
          this.isIntegrationConnected = true;
        }
      });
    }, () => {
      if (workatoConnectionStatus.payload.connected) {
        this.travelperkService.postConfigurations().subscribe(() => {
          // this.iframeSourceUrl = null;
          this.isIntegrationConnected = true;
        });
      }
    });
  }

  private setupWorkatoConnectionWatcher(): void {
    this.eventsService.getWorkatoConnectionStatus.subscribe((workatoConnectionStatus: WorkatoConnectionStatus) => {
      this.updateOrCreateTravelperkConfiguration(workatoConnectionStatus);
    });
  }

  private setupTravelperk() {
    this.setupWorkatoConnectionWatcher();
    const syncData = this.syncData();

    this.isTravelperkSetupInProgress = true;
    concat(...syncData).pipe(
      toArray()
    ).subscribe((responses) => {
      responses.forEach((response: any) => {
        if (response?.hasOwnProperty('managed_user_id') ) {
          this.org.managed_user_id = response.managed_user_id;
        }
      });
      this.isLoading = false;
      this.isTravelperkSetupInProgress = false;
      this.checkTravelperkDataAndTriggerConnectionWidget();
    }, () => {
      this.isLoading = false;
      this.isTravelperkSetupInProgress = false;
      this.showErrorScreen = true;
    });
  }


  private setupPage(): void {
    this.travelperkService.getTravelperkData().subscribe((travelperkData : Travelperk) => {
      this.travelperkData = travelperkData;
      this.setupTravelperk();
    }, () => {
      this.setupTravelperk();
    });
  }

  disconnect(): void {
    this.travelperkService.patchConfigurations(false).subscribe(() => {
      this.isIntegrationConnected = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Disconnected Travelperk successfully');
      // this.addConnectionWidget();
    });
  }

  connectTravelperk(): void {
    const url = 'https://app.sandbox-travelperk.com/oauth2/authorize?client_id=n7wz4RsmYdSQAWbBnymxIsgCzw8goKNEYEcHw4w6&redirect_uri=https://integrations-dummy.fyleapps.tech/&scope=expenses:read&response_type=code';
    const popup = window.open(url, 'popup', 'popup=true,width=500,height=800,left=500');
    const checkPopup = setInterval(() => {
      if (popup?.location?.href?.includes('code')) {
          const callbackURL = popup?.location.href;
          console.log('callbackURL',callbackURL)
          popup.close();
      } else if (!popup || !popup.closed) {
        return;
      }

      clearInterval(checkPopup);
    }, 1000);
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
