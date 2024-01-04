import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { Travelperk } from 'src/app/core/models/travelperk/travelperk.model';
import { OrgService } from 'src/app/core/services/org/org.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';
import { environment } from 'src/environments/environment';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { WindowService } from 'src/app/core/services/common/window.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-travelperk',
  templateUrl: './travelperk.component.html',
  styleUrls: ['./travelperk.component.scss']
})
export class TravelperkComponent implements OnInit {
  brandingKbArticles = brandingKbArticles;

  AppName = AppName;

  isLoading: boolean = true;

  showErrorScreen: boolean;

  travelperkData: Travelperk;

  isTravelperkSetupInProgress: boolean;

  isIntegrationConnected: boolean;

  isConnectionInProgress: boolean;

  org: Org = this.orgService.getCachedOrg();


  readonly brandingConfig = brandingConfig;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private travelperkService: TravelperkService,
    private orgService: OrgService,
    private toastService: IntegrationsToastService,
    private windowService: WindowService
  ) { }

  private setupPage(): void {
    this.travelperkService.getTravelperkData().subscribe((travelperkData : Travelperk) => {
      this.travelperkData = travelperkData;
      this.isIntegrationConnected = travelperkData.is_travelperk_connected;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  disconnect(): void {
    this.isConnectionInProgress = true;
    this.travelperkService.disconnect().subscribe(() => {
      this.isIntegrationConnected = false;
      this.isConnectionInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Disconnected Travelperk successfully');
    });
  }

  connectTravelperk(): void {
    this.isConnectionInProgress = true;
    const url = `${environment.travelperk_base_url}/oauth2/authorize?client_id=${environment.travelperk_client_id}&redirect_uri=https://staging1.fyle.tech/app/settings/#/integrations/native_apps?integrationIframeTarget=integrations/travelperk&scope=expenses:read&response_type=code&state=${environment.production ? 'none' : 'travelperk_local_redirect'}`;

    const popup = window.open(url, 'popup', 'popup=true, width=500, height=800, left=500');

    const activePopup = setInterval(() => {
      try {
        if (popup?.location?.href?.includes('code')) {
          popup.close();
        } else if (!popup || !popup.closed) {
          return;
        }

        clearInterval(activePopup);
      } catch (error) {
        if (error instanceof DOMException && error.message.includes('An attempt was made to break through the security policy of the user agent')) {
          this.travelperkService.getTravelperkData().subscribe((travelperkData : Travelperk) => {
            this.isIntegrationConnected = true;
            this.isConnectionInProgress = false;
            this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Connected Travelperk successfully');
            popup?.close();
            clearInterval(activePopup);
          });
        }
      }
    }, 2000);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.travelperkService.connect(params.code).subscribe(() => {
          window.close();
        });
      } else {
        this.setupPage();
      }
    });
  }
}
