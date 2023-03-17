import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { concat, toArray } from 'rxjs';
import { AppName, RedirectLink } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { Travelperk, TravelperkConfiguration, TravelperkConfigurationPost, WorkatoConnectionStatus } from 'src/app/core/models/travelperk/travelperk.model';
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

  travelperkConfiguration: TravelperkConfiguration;

  travelperkData: Travelperk;

  isTravelperkSetupInProgress: boolean;

  org: Org = this.orgService.getCachedOrg();

  constructor(
    private travelperkService: TravelperkService,
    private orgService: OrgService,
    private eventsService: EventsService
  ) {
    this.eventsService.getWorkatoConnectionStatus.subscribe((workatoConnectionStatus: WorkatoConnectionStatus)=>{
      if (workatoConnectionStatus.payload.connected){
        console.log("IF")
        this.travelperkService.getConfigurations().subscribe((travelperkConfiguration)=>{
          console.log(travelperkConfiguration)
          this.travelperkConfiguration= travelperkConfiguration;
          if (!travelperkConfiguration.is_recipe_enabled){
            console.log("setup org if case")
            this.travelperkService.patchConfigurations(true)
          }
        }, ()=>{
          const payload: TravelperkConfigurationPost = {
            org : this.org.id
          }
          this.travelperkService.postConfigurations(payload).subscribe((travelperkConfiguration)=>{
            console.log(travelperkConfiguration)
            this.travelperkConfiguration = travelperkConfiguration;
          })
        });
      } 

      else if (!workatoConnectionStatus.payload.connected) {
        console.log("else")
        this.travelperkService.getConfigurations().subscribe((travelperkConfiguration)=>{
          this.travelperkConfiguration = travelperkConfiguration;
          if (travelperkConfiguration?.is_recipe_enabled){
            console.log("setup org else case")
            this.travelperkService.patchConfigurations(false)
          }
        }, ()=>{

        })
      }
    })
  }

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

    syncData.push(this.orgService.getOrgs(this.org.fyle_org_id))
    return syncData;

  }

  private checkTravelperkDataAndTriggerConnectionWidget() {
    if (!this.travelperkData) {
      this.travelperkService.getTravelperkData().subscribe((travelperkData : Travelperk) => {
        this.travelperkData = travelperkData;
        console.log(this.travelperkData)
        this.addConnectionWidget();
      });
    } else {
      this.addConnectionWidget();
    }
  }



  private setupTravelperk() {
    const syncData = this.syncData();

    console.log(syncData)
    if (syncData.length) {
      console.log("Entered the if block now")
      this.isTravelperkSetupInProgress = true;
      concat(...syncData).pipe(
        toArray()
      ).subscribe((responses) => {
        responses.forEach((response: any )=> {
          if (response?.hasOwnProperty('managed_user_id') ) {
            this.org.managed_user_id = response['managed_user_id'];
          }
        })
        this.isLoading = false;
        this.isTravelperkSetupInProgress = false;
        console.log("Concatenation is done")
        this.checkTravelperkDataAndTriggerConnectionWidget();
      }, () => {
        this.isLoading = false;
        this.isTravelperkSetupInProgress = false;
        this.showErrorScreen = true;
      });
    } else {
      console.log("Etred the else block")
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
