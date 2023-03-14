import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { concat, toArray } from 'rxjs';
import { RedirectLink } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { Travelperk } from 'src/app/core/models/travelperk/travelperk.model';
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

  iframeSourceUrl: SafeResourceUrl;

  isLoading: boolean = true;

  showErrorScreen: boolean;

  travelperkData: Travelperk;

  isTravelperkSetupInProgress: boolean;

  org: Org = this.orgService.getCachedOrg();

  constructor(
    private travelperkService: TravelperkService,
    private orgService: OrgService
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
      syncData.push(this.orgService.connectFyle());
    }

    if (!this.travelperkData?.travelperk_connection_id) {
      syncData.push(this.travelperkService.connectTravelperk());
    }

    if (!this.travelperkData?.is_s3_connected) {
      syncData.push(this.travelperkService.connectAwsS3());
    }

    return syncData;
  }

  private checkTravelperkDataAndTriggerConnectionWidget() {
    if (!this.travelperkData) {
      this.travelperkService.getTravelperkData().subscribe((travelperkData : Travelperk) => {
        this.travelperkData = travelperkData;
      });
    }
    this.addConnectionWidget();
  }

  private setupTravelperk() {
    const syncData = this.syncData();

    if (syncData.length) {
      this.isTravelperkSetupInProgress = true;
      concat(...syncData).pipe(
        toArray()
      ).subscribe(() => {
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
