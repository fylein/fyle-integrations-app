import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { brandingKbArticles, brandingConfig } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { Travelperk } from 'src/app/core/models/travelperk/travelperk.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-travelperk-onboarding-landing',
  templateUrl: './travelperk-onboarding-landing.component.html',
  styleUrls: ['./travelperk-onboarding-landing.component.scss']
})
export class TravelperkOnboardingLandingComponent implements OnInit {

  brandingKbArticles = brandingKbArticles;

  AppName = AppName;

  showErrorScreen: boolean;

  travelperkData: Travelperk;

  isTravelperkSetupInProgress: boolean;

  isIntegrationConnected: boolean;

  isConnectionInProgress: boolean;

  org: Org = this.orgService.getCachedOrg();

  readonly brandingConfig = brandingConfig;

  constructor(
    private travelperkService: TravelperkService,
    private orgService: OrgService,
    private toastService: IntegrationsToastService,
    private router: Router
  ) { }

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
    const url = `${environment.travelperk_base_url}/oauth2/authorize?client_id=${environment.travelperk_client_id}&redirect_uri=${environment.travelperk_redirect_uri}&scope=expenses:read&response_type=code&state=${environment.production ? this.org.id : `${this.org.id}_travelperk_local_redirect`}`;

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
          this.travelperkService.getTravelperkData().subscribe(() => {
            this.isIntegrationConnected = true;
            this.isConnectionInProgress = false;
            this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Connected Travelperk successfully');
            this.router.navigateByUrl('/integrations/travelperk/onboarding/import_settings');
            popup?.close();
            clearInterval(activePopup);
          });
        }
      }
    }, 2000);
  }

  ngOnInit(): void {
  }

}
