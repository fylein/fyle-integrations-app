import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { brandingKbArticles, brandingConfig, brandingDemoVideoLinks } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity, TravelPerkOnboardingState } from 'src/app/core/models/enum/enum.model';
import { Org } from 'src/app/core/models/org/org.model';
import { Travelperk } from 'src/app/core/models/travelperk/travelperk.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { OrgService } from 'src/app/core/services/org/org.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk-core/travelperk.service';
import { environment } from 'src/environments/environment';
import { TranslocoService } from '@jsverse/transloco';
import { BrandingService } from 'src/app/core/services/common/branding.service';

@Component({
  selector: 'app-travelperk-onboarding-landing',
  templateUrl: './travelperk-onboarding-landing.component.html',
  styleUrls: ['./travelperk-onboarding-landing.component.scss']
})
export class TravelperkOnboardingLandingComponent implements OnInit {

  brandingKbArticles = brandingKbArticles;

  AppName = AppName;

  travelperkData: Travelperk;

  isTravelperkSetupInProgress: boolean;

  isIntegrationConnected: boolean;

  isConnectionInProgress: boolean;

  org: Org = this.orgService.getCachedOrg();

  readonly brandingConfig = brandingConfig;

  embedVideoLink = brandingDemoVideoLinks.onboarding.SAGE300;

  isLoading: boolean;

  constructor(
    private travelperkService: TravelperkService,
    private orgService: OrgService,
    private toastService: IntegrationsToastService,
    private storageService: StorageService,
    private router: Router,
    private translocoService: TranslocoService,
    public brandingService: BrandingService
  ) { }

  disconnect(): void {
    this.isConnectionInProgress = true;
    this.travelperkService.disconnect().subscribe(() => {
      this.isIntegrationConnected = false;
      this.isConnectionInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('travelperkOnboardingLanding.disconnectSuccess'));
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
            this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('travelperkOnboardingLanding.connectSuccess'));
            this.travelperkData?.onboarding_state === TravelPerkOnboardingState.COMPLETE ? '' : this.storageService.set('onboarding-state', TravelPerkOnboardingState.PAYMENT_PROFILE_SETTINGS);
            forkJoin([
              this.travelperkService.syncPaymentProfile(),
              this.travelperkService.syncCategories()
            ]).subscribe(() => {
              popup?.close();
              clearInterval(activePopup);
              this.travelperkData?.onboarding_state === TravelPerkOnboardingState.COMPLETE ? this.router.navigateByUrl('/integrations/travelperk/main') : this.router.navigateByUrl('/integrations/travelperk/onboarding/payment_profile_settings');
            });
          });
        }
      }
    }, 2000);
  }

  private setupPage(): void {
    this.travelperkService.getTravelperkData().subscribe((travelperkData : Travelperk) => {
      this.travelperkData = travelperkData;
      this.isIntegrationConnected = travelperkData.is_travelperk_connected;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
