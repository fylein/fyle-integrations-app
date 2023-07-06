import { Component, OnInit } from '@angular/core';
import { concat, toArray } from 'rxjs';
import { ToastSeverity } from 'fyle-integrations-ui-lib';
import { AppName, RedirectLink } from 'fyle-integrations-ui-lib';
import { Org } from 'fyle-integrations-ui-lib';
import { Travelperk } from 'fyle-integrations-ui-lib';
import { OrgService } from 'fyle-integrations-ui-lib';
import { QbdToastService } from 'fyle-integrations-ui-lib';
import { TravelperkService } from 'fyle-integrations-ui-lib';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-travelperk',
  templateUrl: './travelperk.component.html',
  styleUrls: ['./travelperk.component.scss']
})
export class TravelperkComponent implements OnInit {
  RedirectLink = RedirectLink;

  AppName = AppName;

  isLoading: boolean = true;

  showErrorScreen: boolean;

  travelperkData: Travelperk;

  isTravelperkSetupInProgress: boolean;

  isIntegrationConnected: boolean;

  isConnectionInProgress: boolean;

  org: Org = this.orgService.getCachedOrg();

  constructor(
    private travelperkService: TravelperkService,
    private orgService: OrgService,
    private toastService: QbdToastService
  ) { }

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

  private setConnectionStatus(): void {
    this.travelperkService.getConfigurations().subscribe((configuration) => {
      this.isIntegrationConnected = configuration.is_recipe_enabled;
    });
  }

  private setupTravelperk() {
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
      this.setConnectionStatus();
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
    });
  }

  connectTravelperk(): void {
    this.isConnectionInProgress = true;
    const url = `${environment.travelperk_base_url}/oauth2/authorize?client_id=${environment.travelperk_client_id}&redirect_uri=${environment.travelperk_redirect_uri}&scope=expenses:read&response_type=code&state=${environment.production ? 'none' : 'travelperk_local_redirect'}`;
    const popup = window.open(url, 'popup', 'popup=true, width=500, height=800, left=500');

    const activePopup = setInterval(() => {
      if (popup?.location?.href?.includes('code')) {
        const callbackURL = popup?.location.href;
        const code = callbackURL.split('code=')[1].split('&')[0];

        this.travelperkService.connect(code).subscribe(() => {
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Connected Travelperk successfully');
          this.isIntegrationConnected = true;
          this.isConnectionInProgress = false;
        });

        popup.close();
      } else if (!popup || !popup.closed) {
        return;
      }

      clearInterval(activePopup);
    }, 500);
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
