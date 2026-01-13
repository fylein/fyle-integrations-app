import { Router } from '@angular/router';
import { TravelPerkOnboardingState } from 'src/app/core/models/enum/enum.model';
import { Component, Inject, OnInit } from '@angular/core';
import { Travelperk } from 'src/app/core/models/travelperk/travelperk.model';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk-core/travelperk.service';
import { AuthService } from 'src/app/core/services/common/auth.service';

@Component({
    selector: 'app-travelperk',
    templateUrl: './travelperk.component.html',
    styleUrls: ['./travelperk.component.scss'],
    standalone: false
})
export class TravelperkComponent implements OnInit {

  isLoading: boolean;

  travelperkData: Travelperk;

  isIntegrationConnected: boolean;

  windowReference: Window;

  constructor(
    private travelperkService: TravelperkService,
    private storageService: StorageService,
    private windowService: WindowService,
    private router: Router,
    private authService: AuthService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/integrations/travelperk') {
      const onboardingStateComponentMap = {
        [TravelPerkOnboardingState.CONNECTION]: '/integrations/travelperk/onboarding/landing',
        [TravelPerkOnboardingState.PAYMENT_PROFILE_SETTINGS]: '/integrations/travelperk/onboarding/payment_profile_settings',
        [TravelPerkOnboardingState.ADVANCED_SETTINGS]: '/integrations/travelperk/onboarding/advanced_settings',
        [TravelPerkOnboardingState.COMPLETE]: '/integrations/travelperk/main/configuration'
      };
      this.isLoading = false;
      this.router.navigateByUrl(onboardingStateComponentMap[this.travelperkData.onboarding_state]);
    }
  }

  private setupPage(): void {
    this.isLoading = true;
    this.travelperkService.getTravelperkData().subscribe((travelperkData : Travelperk) => {
      this.travelperkData = travelperkData;
      this.isIntegrationConnected = travelperkData.is_travelperk_connected;
      this.storageService.set('onboarding-state', this.travelperkData.onboarding_state);
      this.storageService.set('workspaceId', this.travelperkData.org);
      this.travelperkService.syncPaymentProfile().subscribe();
      this.travelperkService.syncCategories().subscribe();
      this.navigate();
    }, () => {
      this.isLoading = false;
      this.router.navigateByUrl('/integrations/travelperk/onboarding/landing');
    });
  }

  ngOnInit(): void {
    this.authService.updateUserTokens('TRAVELPERK');
    this.setupPage();
  }
}
