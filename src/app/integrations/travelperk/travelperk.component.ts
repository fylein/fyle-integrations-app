import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { concat, toArray } from 'rxjs';
import { AppName, RedirectLink } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { Travelperk, WorkatoConnectionStatus } from 'src/app/core/models/travelperk/travelperk.model';
import { EventsService } from 'src/app/core/services/core/events.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';

@Component({
  selector: 'app-travelperk',
  templateUrl: './travelperk.component.html',
  styleUrls: ['./travelperk.component.scss']
})
export class TravelperkComponent implements OnInit {
  iframeSource: string = 'https://app.workato.com/direct_link/embedded/connections/';

  RedirectLink = RedirectLink;

  AppName = AppName;

  iframeSourceUrl: SafeResourceUrl;

  isLoading: boolean = true;

  showErrorScreen: boolean;

  travelperkData: Travelperk;

  isTravelperkSetupInProgress: boolean;

  org: Org = this.orgService.getCachedOrg();

  constructor(
    private travelperkService: TravelperkService,
    private orgService: OrgService,
    private eventsService: EventsService
  ) { }

  private addConnectionWidget() {
    const connectionId = this.travelperkData.travelperk_connection_id.toString();
    const managedUserId = this.org.managed_user_id;
    this.isLoading = true;

    this.orgService.generateToken(managedUserId).subscribe(res => {
      const token = res.token;
      const workatoBaseUrl = 'https://app.workato.com/direct_link/embedded/connections/';
      const iframeSource = workatoBaseUrl + connectionId + '?workato_dl_token=' + token;
      this.iframeSourceUrl = this.orgService.sanitizeUrl(iframeSource);
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

  private checkTravelperkDataAndTriggerConnectionWidget() {
    if (!this.travelperkData) {
      this.travelperkService.getTravelperkData().subscribe((travelperkData : Travelperk) => {
        this.travelperkData = travelperkData;
        this.addConnectionWidget();
      });
    } else {
      this.addConnectionWidget();
    }
  }

  private updateOrCreateTravelperkConfiguration(workatoConnectionStatus: WorkatoConnectionStatus): void {
    this.travelperkService.getConfigurations().subscribe(() => {
      const isRecipeEnabled: boolean = workatoConnectionStatus.payload.connected ? true : false;
      this.travelperkService.patchConfigurations(isRecipeEnabled).subscribe();
    }, () => {
      if (workatoConnectionStatus.payload.connected) {
        this.travelperkService.postConfigurations().subscribe();
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

    if (syncData.length) {
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
    } else {
      this.isLoading = false;
      this.checkTravelperkDataAndTriggerConnectionWidget();
    }
  }


  private setupPage(): void {
    this.travelperkService.getTravelperkData().subscribe((travelperkData : Travelperk) => {
      this.travelperkData = travelperkData;
      this.setupTravelperk();
    }, () => {
      this.setupTravelperk();
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
