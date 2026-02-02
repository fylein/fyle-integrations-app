import { Router } from '@angular/router';
import { TravelPerkOnboardingState } from 'src/app/core/models/enum/enum.model';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { concatMap, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { Travelperk } from 'src/app/core/models/travelperk/travelperk.model';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk-core/travelperk.service';
import { AuthService } from 'src/app/core/services/common/auth.service';
import { LoadingService } from 'src/app/core/services/common/loading.service';

@Component({
    selector: 'app-travelperk',
    templateUrl: './travelperk.component.html',
    styleUrls: ['./travelperk.component.scss'],
    standalone: false
})
export class TravelperkComponent implements OnInit, OnDestroy {

  isLoading: boolean;

  private isComponentLoading: boolean = false;

  private isGuardLoading: boolean = false;

  travelperkData: Travelperk;

  isIntegrationConnected: boolean;

  windowReference: Window;

  private destroy$ = new Subject<void>();

  constructor(
    private travelperkService: TravelperkService,
    private storageService: StorageService,
    private windowService: WindowService,
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    this.isComponentLoading = false;
    this.updateLoadingState();
    if (pathName === '/integrations/travelperk') {
      const onboardingStateComponentMap = {
        [TravelPerkOnboardingState.CONNECTION]: '/integrations/travelperk/onboarding/landing',
        [TravelPerkOnboardingState.PAYMENT_PROFILE_SETTINGS]: '/integrations/travelperk/onboarding/payment_profile_settings',
        [TravelPerkOnboardingState.ADVANCED_SETTINGS]: '/integrations/travelperk/onboarding/advanced_settings',
        [TravelPerkOnboardingState.COMPLETE]: '/integrations/travelperk/main/configuration'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.travelperkData.onboarding_state]);
    }
  }

  private updateLoadingState(): void {
    this.isLoading = this.isComponentLoading || this.isGuardLoading;
  }

  private setupPage(): void {
    this.isComponentLoading = true;
    this.updateLoadingState();
    this.travelperkService.getTravelperkData().subscribe((travelperkData : Travelperk) => {
      this.travelperkData = travelperkData;
      this.isIntegrationConnected = travelperkData.is_travelperk_connected;
      this.storageService.set('onboarding-state', this.travelperkData.onboarding_state);
      this.storageService.set('workspaceId', this.travelperkData.org);
      this.travelperkService.syncPaymentProfile().pipe(
        concatMap(() => this.travelperkService.syncCategories())
      ).subscribe(() => {
        this.navigate();
      }, () => {
        this.isComponentLoading = false;
        this.updateLoadingState();
        this.router.navigateByUrl('/integrations/travelperk/onboarding/landing');
      });
    }, () => {
      this.isComponentLoading = false;
      this.updateLoadingState();
      this.router.navigateByUrl('/integrations/travelperk/onboarding/landing');
    });
  }

  ngOnInit(): void {
    this.authService.updateUserTokens('TRAVELPERK');
    this.setupPage();

    // Subscribe to loading service to show/hide loader during guard checks
    this.loadingService.loading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isLoading => {
      this.isGuardLoading = isLoading;
      this.updateLoadingState();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
